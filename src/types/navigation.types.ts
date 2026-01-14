import { type LucideIcon } from "lucide-react"

export type NavItem = {
  title: string
  url?: string             
  icon?: LucideIcon
  isActive?: boolean
  items?: {
    title: string
    url: string
  }[]
}
