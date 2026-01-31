import { Education } from "@/types/education.types"
import Image from "next/image"

export default function EducationItem({
  education,
}: {
  education: Education
}) {
  return (
    <div className="relative flex gap-4">
      {/* Timeline Dot */}
      <span className="absolute -left-[30px] top-1.5 h-3 w-3 rounded-full bg-primary" />

      {/* Icon */}
      {education.icon ? (
        <Image
          src={education.icon}
          alt={education.institution}
          width={40}
          height={40}
          className="rounded bg-white"
        />
      ) : (
        <div className="h-10 w-10 rounded bg-muted flex items-center justify-center text-sm">
          🎓
        </div>
      )}

      {/* Content */}
      <div className="flex-1 space-y-1">
        {/* Institution + Year (same line) */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-semibold leading-tight">
            {education.institution}
          </h3>

          {education.year && (
            <span className="text-sm text-muted-foreground">
              {education.year}
            </span>
          )}
        </div>

        {/* Level */}
        <p className="text-sm font-medium">
          {education.level}
          {education.field && ` · ${education.field}`}
        </p>

        {/* GPA + Status */}
        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          {education.gpa && <span>GPA: {education.gpa}</span>}
          {education.status && <span>{education.status}</span>}
        </div>
      </div>
    </div>
  )
}
