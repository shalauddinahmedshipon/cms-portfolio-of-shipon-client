"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Label } from "@radix-ui/react-label"

type Props = {
  open: boolean
  onClose: () => void
  blog: any
}

export default function BlogViewModal({ open, onClose, blog }: Props) {
  if (!blog) return null

  const {
    title,
    category,
    tags,
    description,
    coverImage,
    isActive,
    isFavorite,
    createdAt,
    updatedAt,
  } = blog

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[80vw] max-w-none sm:max-w-none h-[90vh] overflow-y-auto p-6">
        {/* COVER IMAGE */}
        {coverImage && (
          <div className="w-full h-64 md:h-80 rounded-lg overflow-hidden mb-4 border bg-muted">
            <img src={coverImage} alt={title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* HEADER */}
        <DialogHeader className="mb-6">
          <DialogTitle className="text-3xl font-bold">{title || "Untitled Blog"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-8">
          {/* CATEGORY + STATUS + FAVORITE */}
          <div className="flex flex-wrap items-center justify-start gap-6 mb-6">
            {/* CATEGORY */}
            <div className="flex items-center gap-2">
              <Label className="text-sm text-muted-foreground">Category:</Label>
              <Badge className="bg-blue-600 text-white">{category || "—"}</Badge>
            </div>

            {/* STATUS */}
            <div className="flex items-center gap-2">
              <Label className="text-sm text-muted-foreground">Status:</Label>
              <Badge className={`${isActive ? "bg-green-600" : "bg-red-500"}`}>
                {isActive ? "Active" : "Inactive"}
              </Badge>
            </div>

            {/* FAVORITE */}
            <div className="flex items-center gap-2">
              <Label className="text-sm text-muted-foreground">Favorite:</Label>
              <Badge className={isFavorite ? "bg-yellow-400" : "border"}>
                {isFavorite ? "Yes" : "No"}
              </Badge>
            </div>
          </div>

         {/* TAGS */}
{tags && tags.length > 0 && (
  <div>
    <Label className="text-sm text-muted-foreground">Tags:</Label>
    <div className="flex flex-wrap gap-2 mt-1">
      {(Array.isArray(tags) ? tags : tags.split(",")).map(
        (tag: string, idx: number) => (
          <Badge key={idx} className="bg-purple-600 text-white">
            {tag.trim()}
          </Badge>
        )
      )}
    </div>
  </div>
)}


          <Separator />

          {/* DESCRIPTION */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Description</Label>
            {description ? (
              <div
                className="prose prose-sm sm:prose max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            ) : (
              <p className="text-muted-foreground italic">No description provided.</p>
            )}
          </div>

          <Separator />

          {/* Timestamps */}
          <div className="text-xs text-muted-foreground pt-4 border-t flex flex-col gap-1">
            <p>Created: {new Date(createdAt).toLocaleString()}</p>
            <p>Last updated: {new Date(updatedAt).toLocaleString()}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
