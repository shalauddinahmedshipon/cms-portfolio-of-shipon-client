// types/gallery.types.ts
export interface Gallery {
  id: string
  title: string
  image?: string
  createdAt: string
  updatedAt: string
}


// types/gallery.types.ts
export interface GalleryItem {
  id: string;
  title: string;
  image: string;
  createdAt: string;
}

export interface GalleryResponse {
  data: GalleryItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
