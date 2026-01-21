"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

type Props = {
  open: boolean
  onClose: () => void
  event: any
}

// Format date like "15 Jan, 2025 14:30"
const formatDateTime = (dateStr: string | Date) => {
  if (!dateStr) return "—"
  const date = new Date(dateStr)
  return date.toLocaleString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
}

export default function EventViewModal({ open, onClose, event }: Props) {
  if (!event) return null

  const {
    name,
    title,
    eventType,
    location,
    eventDate,
    description,
    images = [],
    isActive,
    createdAt,
    updatedAt,
  } = event

  const mainImage = images[0]
  const galleryImages = images.slice(1)

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[80vw] max-w-none sm:max-w-none h-[90vh] overflow-y-auto p-6">
        {/* MAIN THUMBNAIL IMAGE */}
        {mainImage && (
          <div className="w-full h-64 md:h-80 rounded-lg overflow-hidden mb-4 border bg-muted">
            <img
              src={mainImage}
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* GALLERY BELOW THUMBNAIL */}
        {galleryImages.length > 0 && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-4">
              {galleryImages.map((img: string, idx: number) => (
                <div
                  key={idx}
                  className="w-36 h-36 rounded-lg overflow-hidden border bg-muted flex-shrink-0"
                >
                  <img
                    src={img}
                    alt={`Event image ${idx + 2}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* HEADER */}
        <DialogHeader className="mb-6">
          <DialogTitle className="text-3xl font-bold">{name || "Unnamed Event"}</DialogTitle>
          {title && <p className="text-muted-foreground mt-1">{title}</p>}
        </DialogHeader>

        {/* EVENT INFO ROW */}
        <div className="flex flex-wrap gap-6 mb-6 justify-between">
          {location && (
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Location</span>
              <p className="font-medium mt-1">{location}</p>
            </div>
          )}

          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Event Date & Time</span>
            <p className="font-medium mt-1">{formatDateTime(eventDate)}</p>
          </div>

          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Event Type</span>
            <Badge className="bg-blue-600 text-white mt-1">{eventType || "—"}</Badge>
          </div>

          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Status</span>
            <Badge
              className={`mt-1 ${isActive ? "bg-green-600" : "bg-red-500"}`}
            >
              {isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>

        <Separator />

        {/* DESCRIPTION */}
        <div className="my-6">
          <h3 className="text-lg font-semibold mb-2">Description</h3>
          {description ? (
            <div
              className="prose max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          ) : (
            <p className="text-muted-foreground italic">No description provided.</p>
          )}
        </div>

        {/* FOOTER: CREATED / UPDATED */}
        <div className="mt-8 text-sm text-muted-foreground flex flex-col gap-1 border-t pt-4">
          <p>Created: {formatDateTime(createdAt)}</p>
          <p>Last updated: {formatDateTime(updatedAt)}</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
