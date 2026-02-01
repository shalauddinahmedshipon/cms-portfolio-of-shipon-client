import { notFound } from "next/navigation";
import { getEventById } from "@/lib/api";
import EventDetailClient from "@/components/modules/event/EventDetailClient";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EventDetailPage({ params }: Props) {
  const { id } = await params;

  console.log("[Event Detail] Requested ID:", id);   // ← add

  if (!id) {
    console.log("[Event Detail] No ID provided");
    notFound();
  }

  const event = await getEventById(id);

  if (!event) {
    console.log("[Event Detail] Event not found for ID:", id);
    notFound();
  }

  console.log("[Event Detail] Event loaded:", event.id, event.name); // ← add

  return <EventDetailClient event={event} />;
}