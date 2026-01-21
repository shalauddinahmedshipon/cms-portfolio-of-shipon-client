export type EventType =
  | 'CONFERENCE'
  | 'WORKSHOP'
  | 'MEETUP'
  | 'WEBINAR'
  | 'CONTEST'
  | 'HACKATHON';

export interface Event {
  id: string;
  name: string;
  title: string;
  description: string;
  location: string;
  eventDate: string;
  eventType: EventType;
  isActive: boolean;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface EventListResponse {
  data: Event[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
