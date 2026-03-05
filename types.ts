
export enum RoomType {
  KITCHEN = 'Kitchen',
  LIVING_ROOM = 'Living Room',
  BEDROOM = 'Bedroom',
  BATHROOM = 'Bathroom',
  EXTERIOR = 'Exterior',
  DINING = 'Dining Room',
  OFFICE = 'Home Office',
  BACKYARD = 'Backyard & Patio'
}

export enum RenoStyle {
  MODERN = 'Ultra Modern',
  SCANDINAVIAN = 'Scandinavian Minimalist',
  JAPANDI = 'Japandi Zen',
  INDUSTRIAL = 'Industrial Loft',
  BOHEMIAN = 'Bohemian Chic',
  TRADITIONAL = 'Modern Traditional',
  MID_CENTURY = 'Mid-Century Modern',
  COASTAL = 'Luxury Coastal',
  FARMHOUSE = 'Modern Farmhouse',
  MEDITERRANEAN = 'Mediterranean Villa',
  ART_DECO = 'Art Deco Revival',
  VICTORIAN = 'Modern Victorian',
  BRUTALIST = 'Soft Brutalist',
  DESERT = 'Desert Modern',
  TROPICAL = 'Tropical Oasis',
  FRENCH_COUNTRY = 'French Countryside',
  MAXIMALIST = 'Curated Maximalist'
}

export enum UserRole {
  BUYER = 'Buyer',
  INVESTOR = 'Investor',
  AGENT = 'Agent'
}

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  avatar?: string;
  company?: string;
  bio?: string;
  location: string;
}

export interface RenovationVision {
  id: string;
  originalImage: string;
  transformedImage: string;
  roomType: RoomType;
  style: RenoStyle;
  estimatedCostRange: string;
  aiDescription: string;
  timestamp: number;
  sharedWithAgent?: boolean;
}
