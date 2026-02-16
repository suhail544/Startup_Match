export type UserRole = "ENTREPRENEUR" | "INVESTOR";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Entrepreneur {
  id: string;
  userId: string;
  bio: string;
  location: string;
  user: User;
}

export interface Investor {
  id: string;
  userId: string;
  companyName: string;
  investmentRange: string;
  focusAreas: string[];
  user: User;
}

export interface Idea {
  id: string;
  businessName: string;
  shortDescription: string;
  fullDescription?: string;
  problemStatement?: string;
  solution?: string;
  targetMarket?: string;
  businessModel?: string;
  fundingRequired: number;
  category: string;
  location: string;
  status: "DRAFT" | "PUBLISHED" | "FUNDED";
  entrepreneurId: string;
  entrepreneur?: {
    id?: string;
    bio?: string;
    location?: string;
    user: {
      id?: string;
      name: string;
    };
  };
}

export interface SavedIdea {
  id: string;
  ideaId: string;
  investorId: string;
  idea: Idea;
}

export interface Interest {
  id: string;
  ideaId: string;
  investorId: string;
  message: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  idea: Idea;
}
