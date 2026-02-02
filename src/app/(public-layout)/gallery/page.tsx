// app/gallery/page.tsx
import GalleryClient from "@/components/modules/gallery/GalleryClient";

export const metadata = {
  title: "Gallery",
  description: "Moments, projects, events, and memories captured in photos",
};

export default function GalleryPage() {
  return <GalleryClient />;
}