export interface Achievement {
  id: string;
  title: string;
  description?: string;
  category?: string;
  iconUrl?: string;
  proofUrl?: string;
  achievedAt?: string;
  isFeatured: boolean;
  isActive: boolean;
  order: number;
}
