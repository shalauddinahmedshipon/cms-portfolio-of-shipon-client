import { Achievement } from "@/types/achievement";
import { ProjectsResponse } from "@/types/api.response.types";
import { Experience } from "@/types/experience.types";
import { CodingProfile } from "@/types/profile.types";
import { Project } from "@/types/project.types";
import { SkillCategory } from "@/types/skill.types";
import { cache } from "react";

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

// Get all projects with pagination and filters
export async function getProjects(params?: {
  page?: number;
  limit?: number;
  search?: string;
  category?: "LEARNING" | "LIVE";
  isActive?: boolean;
  isFavorite?: boolean;
}): Promise<ProjectsResponse> {
  try {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);
    if (params?.category) queryParams.append("category", params.category);
    if (params?.isActive !== undefined) queryParams.append("isActive", params.isActive.toString());
    if (params?.isFavorite !== undefined) queryParams.append("isFavorite", params.isFavorite.toString());

    const res = await fetch(`${API_URL}/project?${queryParams.toString()}`, {
      cache:"no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch projects");
    }

    const response = await res.json();
    
    if (response.success && response.data) {
      return response.data;
    }

    return {
      data: [],
      meta: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      },
    };
  } catch (error) {
    console.error("Error fetching projects:", error);
    return {
      data: [],
      meta: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      },
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


