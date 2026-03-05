
import { GoogleGenAI, Type } from "@google/genai";
import { RoomType, RenoStyle } from "../types";

export interface ListingProperty {
  address: string;
  price: string;
  image: string;
  beds: string;
  baths: string;
  link: string;
  description: string;
}

export interface Contractor {
  id: string;
  name: string;
  rating: number;
  specialty: string;
  location: string;
  image: string;
  description: string;
  website?: string;
}

export interface SearchFilters {
  minPrice?: string;
  maxPrice?: string;
  beds?: string;
  baths?: string;
  propertyType?: string;
  sortBy?: string;
}

export const searchListings = async (query: string, filters?: SearchFilters): Promise<{ text: string; properties: ListingProperty[] }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const filterString = filters ? `
    Filters applied:
    - Price Range: ${filters.minPrice || 'Any'} to ${filters.maxPrice || 'Any'}
    - Bedrooms: ${filters.beds || 'Any'}
    - Bathrooms: ${filters.baths || 'Any'}
    - Property Type: ${filters.propertyType || 'Any'}
    - Sorting by: ${filters.sortBy || 'Default'}
  ` : '';

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `You are a real estate intelligence expert for Georgia properties. 
    A user is searching for: "${query}". 
    ${filterString}

    CRITICAL DIRECTIVE: You MUST ONLY use property data, photos, and descriptions found at https://beandestiny.georgiamls.com/idxsearch/. 
    DO NOT hallucinate or use data from any other source. The "description" field for each property MUST be the actual property description text from that specific website. The "image" field MUST be the actual listing photo URL from the property page.
    When referring to the source of the data in your summary, ALWAYS use "GeorgiaMLS.com".
    
    1. Provide a VERY SIMPLE and CONCISE summary of market trends for this specific search (max 3 sentences). Focus on "The Vision" - why these homes are good for renovation.
    2. Provide 3-4 specific property examples currently available on GeorgiaMLS.com.
    
    Return the response as JSON.`,
    config: {
      tools: [
        { googleSearch: {} },
        { urlContext: {} }
      ],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          text: { type: Type.STRING, description: "Simple 2-3 sentence market summary focusing on renovation potential." },
          properties: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                address: { type: Type.STRING },
                price: { type: Type.STRING },
                image: { type: Type.STRING, description: "The EXACT listing photo URL from the property page on beandestiny.georgiamls.com." },
                beds: { type: Type.STRING },
                baths: { type: Type.STRING },
                link: { type: Type.STRING, description: "The direct URL to this listing on GeorgiaMLS.com" },
                description: { type: Type.STRING, description: "The EXACT property description text from GeorgiaMLS.com" }
              },
              required: ["address", "price", "image", "beds", "baths", "link", "description"]
            }
          }
        },
        required: ["text", "properties"]
      }
    },
  });

  try {
    return JSON.parse(response.text || '{"text": "", "properties": []}');
  } catch (e) {
    console.error("Failed to parse listing search results", e);
    return {
      text: "Market is active. Explore the portal for high-potential properties.",
      properties: []
    };
  }
};

export const searchContractors = async (specialty: string, location: string, sortBy?: string): Promise<Contractor[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = `Find 4-6 highly-rated, real-world contractors in ${location} that specialize in ${specialty}. 
  Provide accurate business names, their current rating (out of 5), and a brief description of their expertise.
  Use Google Search to ensure these are actual active businesses.
  
  ${sortBy ? `CRITICAL: Sort the results by ${sortBy}.` : ''}

  Return the results as a JSON array of objects.
  For the image field, provide a high-quality Unsplash URL related to construction or ${specialty}.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            name: { type: Type.STRING },
            rating: { type: Type.NUMBER },
            specialty: { type: Type.STRING },
            location: { type: Type.STRING },
            image: { type: Type.STRING },
            description: { type: Type.STRING },
            website: { type: Type.STRING }
          },
          required: ["id", "name", "rating", "specialty", "location", "image", "description"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text || "[]");
  } catch (e) {
    console.error("Failed to parse contractor data", e);
    return [];
  }
};

export const transformImage = async (
  base64Image: string,
  roomType: RoomType,
  style: RenoStyle,
  additionalNotes: string
): Promise<{ imageUrl: string; description: string; costEstimate: string }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

  const imagePrompt = `You are an elite architectural designer for Unveil. 
    Task: Transform this ${roomType} into a ${style} masterpiece.
    Guidelines: 
    - Maintain structural integrity (windows, doors, load-bearing locations).
    - Replace all flooring, wall finishes, furniture, and lighting.
    - Style: ${style}. 
    - Additional User Vision: ${additionalNotes}.
    - Ensure high-fidelity, photorealistic output suitable for real estate marketing.
    - Provide a single clear renovation image.`;

  const imageResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/png',
            data: base64Image.split(',')[1],
          },
        },
        { text: imagePrompt },
      ],
    },
  });

  let transformedUrl = "";
  for (const part of imageResponse.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      transformedUrl = `data:image/png;base64,${part.inlineData.data}`;
    }
  }

  const analysisResponse = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Original details: ${roomType}, Style: ${style}. Additional info: ${additionalNotes}. 
    Provide a professional architectural summary and a rough renovation cost estimate in JSON format.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          description: { type: Type.STRING },
          costEstimate: { type: Type.STRING }
        },
        required: ["description", "costEstimate"]
      }
    }
  });

  const analysis = JSON.parse(analysisResponse.text || '{}');

  return {
    imageUrl: transformedUrl,
    description: analysis.description || "Beautiful renovation in progress.",
    costEstimate: analysis.costEstimate || "Consult local contractors."
  };
};
