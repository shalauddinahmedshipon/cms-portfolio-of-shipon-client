"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface GalleryItem {
  id: string;
  title: string;
  image: string;
}

export default function HomeGalleryClient({
  items,
}: {
  items: GalleryItem[];
}) {
  return (
    <section className="space-y-8 bg-white pt-12 pb-8 px-6 rounded-xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-semibold tracking-tight">
          Gallery
        </h2>

        <Link
          href="/gallery"
          className="group inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          See more
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Featured */}
        <div className="md:col-span-2 md:row-span-2 group relative overflow-hidden rounded-2xl">
          <Image
            src={items[0].image}
            alt={items[0].title}
            width={800}
            height={800}
            priority
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <Overlay title={items[0].title} />
        </div>

        {/* Others */}
        {items.slice(1).map((item) => (
          <div
            key={item.id}
            className="group relative overflow-hidden rounded-2xl"
          >
            <Image
              src={item.image}
              alt={item.title}
              width={400}
              height={400}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <Overlay title={item.title} />
          </div>
        ))}
      </div>
    </section>
  );
}

function Overlay({ title }: { title: string }) {
  return (
    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition">
      <div className="absolute bottom-0 p-4 opacity-0 group-hover:opacity-100 transition">
        <p className="text-sm font-medium text-white line-clamp-2">
          {title}
        </p>
      </div>
    </div>
  );
}
