import { Education } from "@/types/education.types"

export function buildEducationFormData(
  data: Partial<Education>,
  iconFile?: File | null,
) {
  const allowedKeys: (keyof Education)[] = [
    "level",
    "institution",
    "field",
    "year",
    "gpa",
    "status",
  ]

  const fd = new FormData()

  for (const key of allowedKeys) {
    const value = data[key]
    if (value !== undefined && value !== null && value !== "") {
      fd.append(key, String(value))
    }
  }

  if (iconFile) fd.append("icon", iconFile)

  return fd
}
