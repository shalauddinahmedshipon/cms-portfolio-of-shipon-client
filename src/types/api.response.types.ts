import { Blog } from "./blog.types";
import { Event } from "./event.types";
import { Project } from "./project.types";

// src/types/api-response.ts
export interface ApiResponse<T> {
  statusCode: number
  success: boolean
  message: string
  data: T
}


export interface BlogsResponse {
  data: Blog[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ProjectsResponse {
  data: Project[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
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
