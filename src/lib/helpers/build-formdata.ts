import type { Education } from "@/types/education.types"
import type { Experience } from "@/types/experience.types"
import type { Skill } from "@/types/skill.types"
/* ───────── EDUCATION ───────── */

export function buildEducationFormData(
  data: Partial<Education>,
  iconFile?: File | null,
) {
  const fd = new FormData()

  const allowedKeys: (keyof Education)[] = [
    "level",
    "institution",
    "field",
    "year",
    "gpa",
    "status",
  ]

  for (const key of allowedKeys) {
    const value = data[key]
    if (value !== undefined && value !== null && value !== "") {
      fd.append(key, String(value))
    }
  }

  if (iconFile) {
    fd.append("icon", iconFile) // backend expects "icon"
  }

  return fd
}

/* ───────── EXPERIENCE ───────── */

export function buildExperienceFormData(
  data: Partial<Experience>,
  logoFile?: File | null,
) {
  const fd = new FormData()

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      fd.append(key, String(value))
    }
  })

  if (logoFile) {
    // ✅ EXACT backend field name
    fd.append("companyLogo", logoFile)
  }

  return fd
}


// src/lib/helpers/build-formdata.ts

export const buildGalleryFormData = (
  data: { title?: string; id?: string } | null,
  file?: File | null
) => {
  const formData = new FormData()
  if (!data) return formData

  if (data.title) formData.append("title", data.title)
  if (file) formData.append("image", file)

  return formData
}

