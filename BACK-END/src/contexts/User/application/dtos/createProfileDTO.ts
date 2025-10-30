import { UserProfile } from "@prisma/client";

export interface createProfileData {
  bio: string;
  skills: string[];
  interests: string[];
  location: string;
}

export interface createProfileResult {}
