import { Achievement } from "@/types/achievement";
import { ProjectsResponse } from "@/types/api.response.types";
import { Blog, BlogsResponse } from "@/types/blog.types";
import { AppEvent, EventsResponse } from "@/types/event.types";
import { Experience } from "@/types/experience.types";
import { GalleryResponse } from "@/types/gallery.types";
import { CodingProfile } from "@/types/profile.types";
import { Project } from "@/types/project.types";
import { SkillCategory } from "@/types/skill.types";


export async function getProfile() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Profile fetch failed", res.status);
      return null;
    }

    const json = await res.json();
    return json.data ?? null;
  } catch (err) {
    console.error("getProfile error:", err);
    return null;
  }
}

export async function getExperiences(): Promise<Experience[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/experience`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Experience fetch failed", res.status);
      return [];
    }

    const json = await res.json();
    return json.data ?? [];
  } catch (err) {
    console.error("getExperiences error:", err);
    return [];
  }
}

export async function getSkills(): Promise<SkillCategory[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/skill/categories`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Skills fetch failed", res.status);
      return [];
    }

    const json = await res.json();
    return json.data ?? [];
  } catch (err) {
    console.error("getSkills error:", err);
    return [];
  }
}


export async function getCodingProfiles(): Promise<CodingProfile[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/profile/coding-profiles`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      console.error("Coding profiles fetch failed", res.status);
      return [];
    }

    const json = await res.json();
    return json.data ?? [];
  } catch (err) {
    console.error("getCodingProfiles error:", err);
    return [];
  }
}

export async function getAchievements(): Promise<Achievement[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/achievements`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      console.error("Achievements fetch failed", res.status);
      return [];
    }

    const json = await res.json();
    return json.data ?? [];
  } catch (err) {
    console.error("getAchievements error:", err);
    return [];
  }
}

export async function getEducation() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/education`,
    { cache: "no-store" }
  )
  const json = await res.json()
  return json.data
}


const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Get featured projects (isFavorite=true)
export async function getFeaturedProjects(): Promise<Project[]> {
  try {
    const res = await fetch(
      `${API_URL}/project?isFavorite=true&isActive=true&limit=100`,
      {
        next: { revalidate: 60 }, // Revalidate every 60 seconds
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch featured projects");
    }

    const response = await res.json();
    
    if (response.success && response.data?.data) {
      return response.data.data;
    }

    return [];
  } catch (error) {
    console.error("Error fetching featured projects:", error);
    return [];
  }
}

export async function getProjects(params?: {
  page?: number;
  limit?: number;
  category?: "LEARNING" | "LIVE";
  isFavorite?: boolean;
}): Promise<ProjectsResponse> {
  try {
    const queryParams = new URLSearchParams();

    queryParams.set("page", String(params?.page ?? 1));
    queryParams.set("limit", String(params?.limit ?? 12));

    if (params?.category) {
      queryParams.set("category", params.category);
    }

    if (params?.isFavorite !== undefined) {
      queryParams.set("isFavorite", String(params.isFavorite));
    }

    // 🔑 IMPORTANT: public site should show ACTIVE projects only
    queryParams.set("isActive", "true");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/project?${queryParams.toString()}`,
      { cache: "no-store" }
    );

    if (!res.ok) throw new Error("Failed to fetch projects");

    const response = await res.json();

    // ✅ SAME NORMALIZATION AS ADMIN PANEL
    const innerData = response?.data?.data || [];
    const innerMeta = response?.data?.meta || {
      page: 1,
      limit: 12,
      total: innerData.length,
      totalPages: 1,
    };

    return {
      data: innerData,
      meta: innerMeta,
    };
  } catch (error) {
    console.error("Error fetching projects:", error);
    return {
      data: [],
      meta: { page: 1, limit: 12, total: 0, totalPages: 0 },
    };
  }
}



// Get single project by id
export async function getProjectById(id: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/project/${id}`,
      { cache: "no-store" }
    );

    const json = await res.json();

    if (!res.ok || !json.success) {
      return null;
    }

    return json.data;
  } catch (error) {
    console.error("getProjectById error:", error);
    return null;
  }
}


export async function getEvents(params?: {
  page?: number;
  limit?: number;
  search?: string;
  eventType?: string;
  isActive?: boolean;
  isFavorite?: boolean;
}): Promise<EventsResponse> {
  try {
    const query = new URLSearchParams();

    query.set("page",  String(params?.page  ?? 1));
    query.set("limit", String(params?.limit ?? 12));

    if (params?.search)     query.set("search",    params.search);
    if (params?.eventType)  query.set("eventType", params.eventType);
    if (params?.isActive !== undefined) query.set("isActive",   String(params.isActive));
    if (params?.isFavorite !== undefined) query.set("isFavorite", String(params.isFavorite));

    // Public frontend → only show active events by default
    if (params?.isActive === undefined) {
      query.set("isActive", "true");
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/event?${query.toString()}`,
      { cache: "no-store" }
    );

    if (!res.ok) throw new Error("Failed to fetch events");

    const json = await res.json();

    // Normalize shape (same pattern as your projects)
    const innerData = json?.data?.data || [];
    const innerMeta = json?.data?.meta || {
      page: 1,
      limit: 12,
      total: innerData.length,
      totalPages: 1,
    };

    return {
      data: innerData,
      meta: innerMeta,
    };
  } catch (err) {
    console.error("getEvents error:", err);
    return { data: [], meta: { page: 1, limit: 12, total: 0, totalPages: 0 } };
  }
}

export async function getEventById(id: string): Promise<AppEvent | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/event/${id}`,
      { cache: "no-store" }
    );
    

    const json = await res.json();
    console.log(json);
    console.log("[getEventById] Status:", res.status);
console.log("[getEventById] Response body:", JSON.stringify(json, null, 2));
    if (!res.ok || !json.success) return null;

    return json.data ?? null;
  } catch (err) {
    console.error("getEventById error:", err);
    return null;
  }
}

// Optional: for home page featured events
export async function getFeaturedEvents(limit = 6): Promise<AppEvent[]> {
  try {
    const res = await getEvents({
      isFavorite: true,
      isActive: true,
      limit,
    });

    return res.data;
  } catch {
    return [];
  }
}


// ────────────────────────────────────────────────
// Blog related fetchers
// ────────────────────────────────────────────────

export async function getBlogs(params?: {
  page?: number;
  limit?: number;
  search?: string;
  category?: Blog["category"];
  isActive?: boolean;
  isFeatured?: boolean;
}): Promise<BlogsResponse> {
  try {
    const query = new URLSearchParams();

    query.set("page",  String(params?.page  ?? 1));
    query.set("limit", String(params?.limit ?? 10));

    if (params?.search)    query.set("search",    params.search);
    if (params?.category)  query.set("category",  params.category);
    if (params?.isActive !== undefined) query.set("isActive",   String(params.isActive));
    if (params?.isFeatured !== undefined) query.set("isFeatured", String(params.isFeatured));

    // Public frontend → only show active blogs by default
    if (params?.isActive === undefined) {
      query.set("isActive", "true");
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/blog?${query.toString()}`,
      { cache: "no-store" }
    );

    if (!res.ok) throw new Error("Failed to fetch blogs");

    const json = await res.json();

    const innerData = json?.data?.data || [];
    const innerMeta = json?.data?.meta || {
      page: 1,
      limit: 10,
      total: innerData.length,
      totalPages: 1,
    };

    return {
      data: innerData,
      meta: innerMeta,
    };
  } catch (err) {
    console.error("getBlogs error:", err);
    return { data: [], meta: { page: 1, limit: 10, total: 0, totalPages: 0 } };
  }
}

export async function getBlogById(id: string): Promise<Blog | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/blog/${id}`,
      { cache: "no-store" }
    );

    const json = await res.json();
    if (!res.ok || !json.success) return null;

    return json.data ?? null;
  } catch (err) {
    console.error("getBlogById error:", err);
    return null;
  }
}

export async function getFeaturedBlogs(limit = 6): Promise<Blog[]> {
  try {
    const res = await getBlogs({
      isFeatured: true,
      isActive: true,
      limit,
    });
    return res.data;
  } catch {
    return [];
  }
}



// ────────────────────────────────────────────────
// Gallery
// ────────────────────────────────────────────────

export async function getGallery(params?: {
  page?: number;
  limit?: number;
}): Promise<GalleryResponse> {
  try {
    const query = new URLSearchParams();

    query.set("page",  String(params?.page  ?? 1));
    query.set("limit", String(params?.limit ?? 12));

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/gallery?${query.toString()}`,
      { cache: "no-store" }
    );

    if (!res.ok) throw new Error("Failed to fetch gallery");

    const json = await res.json();

    const innerData = json?.data?.data || [];
    const innerMeta = json?.data?.meta || {
      page: 1,
      limit: 12,
      total: innerData.length,
      totalPages: 1,
    };

    return {
      data: innerData,
      meta: innerMeta,
    };
  } catch (err) {
    console.error("getGallery error:", err);
    return { data: [], meta: { page: 1, limit: 12, total: 0, totalPages: 0 } };
  }
}
