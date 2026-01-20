"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge" // assuming you have Badge from shadcn
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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[80vw] max-w-none sm:max-w-none h-[90vh] overflow-y-auto p-6">
        <DialogHeader className="mb-8">
          <DialogTitle className="text-2xl font-semibold">
            {name || "Unnamed Project"}
          </DialogTitle>
          {title && <p className="text-muted-foreground mt-1">{title}</p>}
        </DialogHeader>

        <div className="space-y-8">
          {/* Basic Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-1 space-x-2">
              <Label className="text-sm text-muted-foreground">Category</Label>
              <p className="font-medium">{category || "—"}</p>
            </div>

            <div className="space-y-1 space-x-2">
              <Label className="text-sm text-muted-foreground">Status</Label>
              <Badge
                variant={isActive ? "default" : "secondary"}
                className={isActive ? "bg-green-600 hover:bg-green-600" : ""}
              >
                {isActive ? "Active" : "Inactive"}
              </Badge>
            </div>

            <div className="space-y-1 space-x-2">
              <Label className="text-sm text-muted-foreground">Favorite</Label>
              <Badge variant={isFavorite ? "default" : "outline"}>
                {isFavorite ? "Yes" : "No"}
              </Badge>
            </div>

            <div className="space-y-1">
              <Label className="text-sm text-muted-foreground">Technology Stack</Label>
              <p className="font-medium">{technology || "—"}</p>
            </div>

            <div className="space-y-1">
              <Label className="text-sm text-muted-foreground">Live Site</Label>
              {liveSiteUrl ? (
                <a
                  href={liveSiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline block truncate"
                >
                  {liveSiteUrl}
                </a>
              ) : (
                <p className="text-muted-foreground">—</p>
              )}
            </div>

            <div className="space-y-1">
              <Label className="text-sm text-muted-foreground">GitHub Frontend</Label>
              {githubFrontendUrl ? (
                <a
                  href={githubFrontendUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline block truncate"
                >
                  {githubFrontendUrl}
                </a>
              ) : (
                <p className="text-muted-foreground">—</p>
              )}
            </div>

            <div className="space-y-1 md:col-span-2 lg:col-span-1">
              <Label className="text-sm text-muted-foreground">GitHub Backend</Label>
              {githubBackendUrl ? (
                <a
                  href={githubBackendUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline block truncate"
                >
                  {githubBackendUrl}
                </a>
              ) : (
                <p className="text-muted-foreground">—</p>
              )}
            </div>
          </div>

          <Separator />

          {/* Description */}
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

          {/* Images */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Project Images</Label>

            {images.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {images.map((img: string, idx: number) => (
                  <div
                    key={idx}
                    className="relative rounded-lg overflow-hidden border bg-muted aspect-video"
                  >
                    <img
                      src={img}
                      alt={`Project image ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg text-muted-foreground">
                <p>No images uploaded for this project</p>
              </div>
            )}
          </div>

          {/* Timestamps (optional footer-like) */}
          <div className="text-xs text-muted-foreground pt-4 border-t">
            <p>Created: {new Date(createdAt).toLocaleString()}</p>
            <p>Last updated: {new Date(updatedAt).toLocaleString()}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}