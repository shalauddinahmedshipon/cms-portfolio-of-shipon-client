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

export interface AppEvent {           // ← changed name
  id: string;
  name: string;
  title: string;
  description: string;
  location: string;
  eventDate: string;                  // ISO string
  eventType: 'CONFERENCE' | 'WORKSHOP' | 'MEETUP' | 'WEBINAR' | 'CONTEST' | 'HACKATHON';
  serialNo?: number;
  isActive: boolean;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
  images: string[];
}

export interface EventsResponse {
  data: AppEvent[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}