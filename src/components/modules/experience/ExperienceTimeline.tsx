"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import {
  Pencil,
  Trash2,
  Briefcase,
  Loader2,
} from "lucide-react"
import type { Experience } from "@/types/experience.types"
import { formatMonthYear } from "@/lib/utils"

type Props = {
  items: Experience[]
  deletingId?: string | null
  onEdit: (item: Experience) => void
  onDelete: (id: string) => void
}

export function ExperienceTimeline({
  items,
  deletingId,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="space-y-6">
      {items.map((e, index) => {
        const isDeleting = deletingId === e.id

        return (
          <motion.div
            key={e.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
            className="rounded-2xl border bg-card p-5 shadow-sm"
          >
            {/* header */}
            <div className="flex justify-between gap-4">
              <div className="flex gap-4">
                {/* icon / logo */}
                <div className="size-16 rounded-xl border-2 bg-muted flex items-center justify-center shrink-0">
                  {e.companyLogo ? (
                    <img
                      src={e.companyLogo}
                      alt={e.companyName}
                      className="size-16 rounded-lg object-cover"
                    />
                  ) : (
                    <Briefcase className="size-7 text-muted-foreground" />
                  )}
                </div>

                {/* main info */}
                <div>
                  <h4 className="text-base font-semibold leading-tight">
                    {e.role}
                  </h4>

                  <p className="text-sm text-muted-foreground">
                    {e.companyName}
                    {e.location && ` • ${e.location}`}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    {e.employmentType && (
                      <Badge variant="secondary">
                        {e.employmentType}
                      </Badge>
                    )}

                    <span className="text-xs text-muted-foreground">
                      {formatMonthYear(e.startDate)} –{" "}
                      {e.isCurrent
                        ? "Present"
                        : formatMonthYear(e.endDate)}
                    </span>

                    {e.isCurrent && (
                      <Badge className="bg-primary text-primary-foreground">
                        Current
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* actions */}
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => onEdit(e)}
                  className="p-2 rounded-md border hover:bg-muted"
                  aria-label="Edit experience"
                  disabled={isDeleting}
                >
                  <Pencil className="size-4" />
                </button>

                <button
                  onClick={() => onDelete(e.id)}
                  className="p-2 rounded-md border text-destructive hover:bg-destructive/10 disabled:opacity-60"
                  aria-label="Delete experience"
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Trash2 className="size-4" />
                  )}
                </button>
              </div>
            </div>

            {/* description */}
            {e.description && (
              <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
                {e.description}
              </p>
            )}
          </motion.div>
        )
      })}
    </div>
  )
}
