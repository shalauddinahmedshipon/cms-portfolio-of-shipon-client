"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AppEvent, EventsResponse } from "@/types/event.types";
import { cn } from "@/lib/utils";
import { getEvents } from "@/lib/api";
import EventCard from "./EventCard";
import EventsSkeleton from "./EventsSkeleton";


const TABS = ["ALL", "CONFERENCE", "WORKSHOP", "MEETUP", "WEBINAR", "CONTEST", "HACKATHON", "FAVORITES"] as const;
type Tab = typeof TABS[number];

export default function EventsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [eventsData, setEventsData] = useState<EventsResponse>({
    data: [],
    meta: { page: 1, limit: 12, total: 0, totalPages: 1 },
  });
  const [loading, setLoading] = useState(true);

  const currentType   = searchParams.get("eventType") as AppEvent["eventType"] | null;
  const currentFav    = searchParams.get("isFavorite") === "true";
  const currentPage   = Number(searchParams.get("page") || 1);

  const activeTab: Tab = currentFav
    ? "FAVORITES"
    : currentType || "ALL";

  const fetchEvents = async () => {
    setLoading(true);
    const data = await getEvents({
      page: currentPage,
      limit: 12,
      eventType: currentType ?? undefined,
      isFavorite: currentFav || undefined,
    });
    setEventsData(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, [currentType, currentFav, currentPage]);

  const handleTabChange = (tab: Tab) => {
    const params = new URLSearchParams(searchParams.toString());

    if (tab === "ALL") {
      params.delete("eventType");
      params.delete("isFavorite");
    } else if (tab === "FAVORITES") {
      params.delete("eventType");
      params.set("isFavorite", "true");
    } else {
      params.set("eventType", tab);
      params.delete("isFavorite");
    }

    params.set("page", "1");
    router.push(`/event?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/event?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const { data: events, meta } = eventsData;

  if (loading) {
     return <EventsSkeleton count={12} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-6xl px-4 py-10">
        <div className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight mt-10">Events</h1>
        </div>

        {/* Tabs */}
        <div className="mb-10 border-b">
          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={cn(
                  "px-5 py-1.5 text-sm font-medium rounded-lg transition-all whitespace-nowrap",
                  activeTab === tab
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                {tab === "ALL" ? "All Events" : tab === "FAVORITES" ? "Favorites" : tab}
              </button>
            ))}
          </div>
        </div>

        {events.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>

            {meta.totalPages > 1 && (
              <div className="flex items-center justify-between gap-4">
                <button
                  onClick={() => handlePageChange(meta.page - 1)}
                  disabled={meta.page === 1}
                  className="p-3 rounded-lg border hover:bg-accent disabled:opacity-40"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex-1 overflow-x-auto scrollbar-hide">
                  <div className="flex items-center gap-2 min-w-max">
                    {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => handlePageChange(p)}
                        className={cn(
                          "min-w-[40px] h-10 px-4 rounded-lg text-sm font-medium",
                          p === meta.page
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "border hover:bg-accent"
                        )}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handlePageChange(meta.page + 1)}
                  disabled={meta.page === meta.totalPages}
                  className="p-3 rounded-lg border hover:bg-accent disabled:opacity-40"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        ) : (
          <Card className="border-none shadow-md">
            <CardContent className="py-16 text-center">
              <h3 className="text-xl font-medium mb-2">No events found</h3>
              <p className="text-muted-foreground">Try a different filter or category</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}