export type Blog = {
  id: string;
  serialNo?: number;
  title: string;
  content: string;
  category: "TECHNOLOGY" | "PROGRAMMING" | "LIFESTYLE" | "TUTORIAL" | "NEWS";
  coverImage?: string;
  tags: string[];
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
};



