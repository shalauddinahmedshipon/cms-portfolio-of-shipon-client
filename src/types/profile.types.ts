export interface Profile {
  id: string
  name?: string
  designation?: string
  headline?: string
  bio?: string
  avatarUrl?: string
  bannerUrl?: string
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

export interface CodingProfile {
  id: string
  platform: string
  username: string
  profileUrl?: string
  iconUrl?: string
  rating?: number
  badge?: string
  highlight: boolean
  profileId: string
}