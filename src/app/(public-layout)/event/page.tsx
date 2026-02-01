import EventsClient from "@/components/modules/event/EventsClient";

export const metadata = {
  title: "Events",
  description: "Upcoming and past events, workshops, hackathons, meetups",
};

export default function EventsPage() {
  return <EventsClient />;
}