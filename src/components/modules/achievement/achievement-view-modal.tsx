"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Calendar, ExternalLink, Award } from "lucide-react"

type Props = {
  open: boolean
  onClose: () => void
  item: any
}

export default function AchievementViewModal({ open, onClose, item }: Props) {
  if (!item) return null

  const {
    title,
    description,
    category,
    iconUrl,
    proofUrl,
    achievedAt,
    isFeatured,
    isActive,
    createdAt,
  } = item

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-4 mb-2">
            <div className="h-16 w-16 rounded-lg border bg-muted flex items-center justify-center overflow-hidden p-2">
              {iconUrl ? (
                <img src={iconUrl} alt={title} className="h-full w-full object-contain" />
              ) : (
                <Award className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
              <p className="text-sm text-muted-foreground capitalize">
                {category?.replace("_", " ").toLowerCase() || "General Achievement"}
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* BADGES & STATUS */}
          <div className="flex flex-wrap gap-3">
            <Badge variant={isActive ? "default" : "secondary"}>
              {isActive ? "Active" : "Inactive"}
            </Badge>
            {isFeatured && (
              <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">
                Featured
              </Badge>
            )}
            {achievedAt && (
              <div className="flex items-center text-sm text-muted-foreground gap-1 ml-auto">
                <Calendar className="size-4" />
                {new Date(achievedAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            )}
          </div>

          <Separator />

          {/* DESCRIPTION */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Details</Label>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {description || "No description provided for this achievement."}
            </p>
          </div>

          {/* PROOF LINK */}
          {proofUrl && (
            <div className="pt-2">
              <a
                href={proofUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline"
              >
                View Proof / Certificate
                <ExternalLink className="size-3" />
              </a>
            </div>
          )}

          <Separator />

          {/* METADATA */}
          <div className="text-[10px] text-muted-foreground flex justify-between italic">
            <span>System ID: {item.id}</span>
            <span>Added: {new Date(createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}