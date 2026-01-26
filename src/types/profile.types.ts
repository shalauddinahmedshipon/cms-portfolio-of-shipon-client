export type BannerType = "IMAGE" | "VIDEO"

export interface Profile {
  id: string
  name?: string
  designation?: string
  headline?: string
  bio?: string
  avatarUrl?: string
  bannerUrl?: string
  bannerType?: BannerType   
  resumeUrl?: string
  location?: string
  contactInfo?: ContactInfo
  codingProfile: CodingProfile[]
  createdAt: string
  updatedAt: string
}

export interface ContactInfo {
  id: string
  email?: string
  github?: string
  linkedin?: string
  facebook?: string
  whatsapp?: string
  twitter?: string
  profileId: string
}

// src/types/profile.types.ts
export type CodingProfile = {
  id: string
  platform: string
  username: string
  profileUrl?: string   // <-- optional
  rating?: number
  badge?: string
  highlight: boolean
  iconUrl?: string
}
