"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowLeft, CalendarDays, MapPin, Clock, Star, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { format, isPast, isFuture, formatDistanceToNow } from "date-fns";
import { AppEvent } from "@/types/event.types";
import { cn } from "@/lib/utils"; 

interface Props {
  event: AppEvent;
}

export default function EventDetailClient({ event }: Props) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = event.images || [];
  const date = new Date(event.eventDate);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  const prevSlide = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const nextSlide = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const goToSlide = (index: number) => {
    setCurrentImageIndex(index);
  };

  const status = isPast(date)
    ? "Past Event"
    : isFuture(date)
    ? "Upcoming"
    : "Happening Now";

  const statusColor =
    status === "Past Event" ? "text-red-600" :
    status === "Happening Now" ? "text-green-600" :
    "text-blue-600";

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-6xl px-5 py-20">
        {/* Back link */}
        <Link
          href="/event"
          className="group mb-4 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Events
        </Link>

        {/* Hero / Carousel */}
        <div className="mb-8 md:mb-10">
          {images.length > 0 ? (
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative rounded-xl md:rounded-2xl overflow-hidden shadow-lg border bg-muted aspect-[4/3] sm:aspect-[5/3] md:aspect-[16/7] lg:aspect-[16/6]">
                <Image
                  src={images[currentImageIndex]}
                  alt={`${event.name} - image ${currentImageIndex + 1}`}
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-[1.03]"
                  priority
                />

                {event.isFavorite && (
                  <div className="absolute top-3 left-3 md:top-4 md:left-4 z-20">
                    <Star className="w-5 h-5 md:w-6 md:h-6 fill-yellow-400 text-yellow-500 drop-shadow-md" />
                  </div>
                )}

                <div className="absolute top-3 right-3 md:top-4 md:right-4 flex flex-wrap gap-2 z-20">
                  <span
                    className={`px-2.5 py-1 md:px-3 md:py-1.5 text-xs md:text-sm font-semibold rounded-full bg-background/85 backdrop-blur-md border shadow-sm ${statusColor}`}
                  >
                    {status}
                  </span>
                  <span className="px-2.5 py-1 md:px-3 md:py-1.5 text-xs md:text-sm font-medium rounded-full bg-background/85 backdrop-blur-md border shadow-sm">
                    {event.eventType}
                  </span>
                </div>

                {/* Navigation Arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevSlide}
                      className="absolute left-3 top-1/2 -translate-y-1/2 z-10 p-2.5 rounded-full bg-background/70 backdrop-blur-md border hover:bg-background/90 transition-all shadow-md hover:shadow-lg"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                    <button
                      onClick={nextSlide}
                      className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-2.5 rounded-full bg-background/70 backdrop-blur-md border hover:bg-background/90 transition-all shadow-md hover:shadow-lg"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => goToSlide(idx)}
                      className={cn(
                        "snap-start relative flex-shrink-0 w-20 h-14 sm:w-24 sm:h-16 md:w-28 md:h-20 rounded-lg overflow-hidden border-2 transition-all duration-200",
                        idx === currentImageIndex
                          ? "border-primary scale-105 shadow-md"
                          : "border-transparent opacity-75 hover:opacity-100 hover:border-muted-foreground/60"
                      )}
                    >
                      <Image
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="aspect-[16/7] rounded-xl md:rounded-2xl bg-muted flex items-center justify-center border text-muted-foreground text-sm md:text-base">
              No event images available
            </div>
          )}
        </div>

        {/* Main content */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Main description */}
          <div className="lg:col-span-8 order-2 lg:order-1 space-y-8 md:space-y-10">
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight mb-2">
                {event.name}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                {event.title}
              </p>
            </div>

            <div className="prose prose-neutral max-w-none dark:prose-invert prose-headings:font-semibold">
              <h2 className="text-xl md:text-2xl font-semibold mb-4">About this event</h2>
              <div
                dangerouslySetInnerHTML={{
                  __html: event.description || "<p>No detailed description provided.</p>",
                }}
              />
            </div>
          </div>

          {/* Event Info Card - RIGHT side */}
          <div className="lg:col-span-4 order-1 lg:order-2">
            <Card className="bg-card/80 backdrop-blur-sm border shadow-md sticky top-16 md:top-20 lg:top-24">
              <CardContent className="p-5 md:p-6 space-y-5 md:space-y-6">
                <h3 className="text-lg md:text-xl font-semibold">Event Details</h3>
                <div className="space-y-4 text-sm md:text-base">
                  <div className="flex items-start gap-3">
                    <CalendarDays className="w-5 h-5 mt-0.5 flex-shrink-0 text-muted-foreground" />
                    <div>
                      <p className="font-medium">
                        {format(date, "EEEE, MMMM d, yyyy")}
                      </p>
                      <p className="text-muted-foreground">
                        {format(date, "h:mm a")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 mt-0.5 flex-shrink-0 text-muted-foreground" />
                    <p>{formatDistanceToNow(date, { addSuffix: true })}</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0 text-muted-foreground" />
                    <p className="line-clamp-3">{event.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}