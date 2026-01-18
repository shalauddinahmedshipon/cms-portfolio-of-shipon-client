export const TAGS = {
  // Auth / User
  USER: "User",
  AUTH: "Auth",

  // Profile
  PROFILE: "Profile",
  CONTACT: "Contact",
  CODING_PROFILE: "CodingProfile",

  // Content
  PROJECT: "Project",
  BLOG: "Blog",
  EVENT: "Event",
  ACHIEVEMENT: "Achievement",
  GALLERY: "Gallery",

  // Resume
  SKILL_CATEGORY: "SkillCategory",
  SKILL: "Skill",
  EXPERIENCE: "Experience",
  EDUCATION: "Education",
} as const

// Union of all tag values
export type TagType = (typeof TAGS)[keyof typeof TAGS]
