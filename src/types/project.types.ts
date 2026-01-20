export type Project = {
  id: string
  serialNo?: number
  name: string
  title: string
  description: string
  technology: string
  category: "LEARNING" | "LIVE"
  images: string[]
  liveSiteUrl?: string
  githubFrontendUrl?: string
  githubBackendUrl?: string
  isFavorite: boolean
  isActive: boolean
  createdAt: string
}