"use client";

import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MapPin, Star } from "lucide-react";
import { format } from "date-fns";
import { AppEvent } from "@/types/event.types";

interface Props {
  event: AppEvent;
}

export default function EventCard({ event }: Props) {
  const firstImage = event.images?.[0];
  const date = new Date(event.eventDate);
  const isPast = date < new Date();

  return (
    <div className="rounded-xl border bg-card hover:shadow-lg transition-all duration-300 overflow-hidden h-full flex flex-col relative">
      {event.isFavorite && (
        <div className="absolute top-3 left-3 z-10">
          <Star className="w-5 h-5 fill-yellow-400 text-yellow-500 drop-shadow-md" />
        </div>
      )}

      {firstImage ? (
        <div className="relative w-full h-48 bg-muted overflow-hidden">
          <Image
            src={firstImage}
            alt={event.title}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute top-3 right-3">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-background/90 backdrop-blur-sm shadow-sm">
              {event.eventType}
            </span>
          </div>
        </div>
      ) : (
        <div className="h-48 bg-muted flex items-center justify-center text-muted-foreground text-sm">
          No image
        </div>
      )}

      <div className="p-5 flex-1 flex flex-col">
        <div className="mb-3">
          <h3 className="font-semibold text-lg mb-1 line-clamp-1">{event.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{event.title}</p>
        </div>

        <div className="mt-auto space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <CalendarDays className="w-4 h-4" />
            <span>{format(date, "PPP")} {isPast && "(Past)"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
        </div>

        <Link
          href={`/event/${event.id}`}
          className="mt-5 block text-center py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}