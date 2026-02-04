import HomeGalleryClient from "./HomeGalleryClient";

interface GalleryItem {
  id: string;
  title: string;
  image: string;
}

async function getGallery(): Promise<GalleryItem[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/gallery?limit=9`,
      {
        // ✅ ISR
        next: { revalidate: 3600 }, // revalidate every 1 hour
      }
    );

    if (!res.ok) {
      console.error("Gallery fetch failed:", res.status);
      return [];
    }

    const json = await res.json();

    // ✅ Safe backend-compatible extraction
    return json?.data?.data ?? json?.data ?? [];
  } catch (error) {
    console.error("Gallery fetch error:", error);
    return [];
  }
}

export default async function HomeGallery() {
  const items = await getGallery();

  if (!items.length) return null;

  return <HomeGalleryClient items={items} />;
}
