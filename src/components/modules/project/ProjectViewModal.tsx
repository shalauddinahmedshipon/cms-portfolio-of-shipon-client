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
  project: any
}

export default function ProjectViewModal({ open, onClose, project }: Props) {
  if (!project) return null

  const {
    name,
    title,
    category,
    technology,
    liveSiteUrl,
    githubFrontendUrl,
    githubBackendUrl,
    description,
    images = [],
    isActive,
    isFavorite,
    createdAt,
    updatedAt,
  } = project

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
                    alt={`Project image ${idx + 2}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* HEADER */}
        <DialogHeader className="mb-6">
          <DialogTitle className="text-3xl font-bold">{name || "Unnamed Project"}</DialogTitle>
          {title && <p className="text-muted-foreground mt-1">{title}</p>}
        </DialogHeader>

        <div className="space-y-8">
        {/* CATEGORY + STATUS + FAVORITE */}
<div className="flex flex-wrap items-center justify-start gap-18 mb-6">
  {/* CATEGORY */}
  <div className="flex items-center gap-2">
    <Label className="text-sm text-muted-foreground">Category:</Label>
    <div className="flex flex-wrap gap-2">
      {Array.isArray(category)
        ? category.map((cat: string, idx: number) => (
            <Badge key={idx} className="bg-blue-600 text-white">
              {cat}
            </Badge>
          ))
        : <Badge className="bg-blue-600 text-white">{category || "—"}</Badge>
      }
    </div>
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


          {/* TECHNOLOGY STACK */}
          <div>
            <Label className="text-sm text-muted-foreground">Technology Stack</Label>
            <p className="font-medium mt-1">{technology || "—"}</p>
          </div>

          {/* LINKS */}
          <div className="space-y-3">
            {liveSiteUrl && (
              <div>
                <Label className="text-sm text-muted-foreground">Live Site</Label>
                <a
                  href={liveSiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline block mt-1 truncate"
                >
                  {liveSiteUrl}
                </a>
              </div>
            )}
            {githubFrontendUrl && (
              <div>
                <Label className="text-sm text-muted-foreground">GitHub Frontend</Label>
                <a
                  href={githubFrontendUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline block mt-1 truncate"
                >
                  {githubFrontendUrl}
                </a>
              </div>
            )}
            {githubBackendUrl && (
              <div>
                <Label className="text-sm text-muted-foreground">GitHub Backend</Label>
                <a
                  href={githubBackendUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline block mt-1 truncate"
                >
                  {githubBackendUrl}
                </a>
              </div>
            )}
          </div>

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
