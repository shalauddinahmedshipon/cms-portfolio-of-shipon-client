"use client"

import { useEffect, useState } from "react"
import { Plus, Trash2, Upload, Loader2, ChevronLeft, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "sonner"

import {
  useGetGalleryQuery,
  useCreateGalleryMutation,
  useDeleteGalleryMutation,
} from "@/store/api/gallery.api"

import type { Gallery } from "@/types/gallery.types"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { buildGalleryFormData } from "@/lib/helpers/build-formdata"

/* ------------------------------------------------------------------ */
const EMPTY: Partial<Gallery> = {
  title: "",
}
const PAGE_LIMIT = 9

/* ------------------------------------------------------------------ */
export default function GalleryPage() {
  const [page, setPage] = useState(1)
  const { data, isLoading } = useGetGalleryQuery({ page, limit: PAGE_LIMIT })
  const [createGallery, { isLoading: isCreating }] = useCreateGalleryMutation()
  const [deleteGallery] = useDeleteGalleryMutation()

  const isSaving = isCreating
  const [items, setItems] = useState<Gallery[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState<Partial<Gallery> | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)

  /* ------------------ Load data ------------------ */
  useEffect(() => {
    if (data) {
      setItems(Array.isArray(data.data) ? data.data : [])
      setTotalPages(data.totalPages ?? 1)
    }
  }, [data])

  /* ------------------ Save ------------------ */
  const save = async () => {
    if (!active?.title || !imageFile) {
      toast.error("Title and image are required")
      return
    }

    const fd = buildGalleryFormData(active, imageFile)

    try {
      const saved = await createGallery(fd).unwrap()
      setItems((prev) => [saved, ...prev])
      toast.success("Saved successfully")
      setOpen(false)
      setActive(null)
      setImageFile(null)
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to save")
    }
  }

  /* ------------------ Delete ------------------ */
  const remove = async (id: string) => {
    try {
      await deleteGallery(id).unwrap()
      setItems((prev) => prev.filter((i) => i.id !== id))
      toast.success("Deleted")
    } catch {
      toast.error("Delete failed")
    }
  }

  /* ------------------ Pagination handlers ------------------ */
  const prevPage = () => setPage((p) => Math.max(p - 1, 1))
  const nextPage = () => setPage((p) => Math.min(p + 1, totalPages))

  /* ------------------ Loading skeleton ------------------ */
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {Array.from({ length: PAGE_LIMIT }).map((_, i) => (
          <Skeleton key={i} className="h-48 rounded-lg" />
        ))}
      </div>
    )
  }

  /* ------------------ UI ------------------ */
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Gallery</h2>
        <Button
          size="sm"
          onClick={() => {
            setActive(EMPTY)
            setImageFile(null)
            setOpen(true)
          }}
        >
          <Plus className="size-4 mr-1" /> Add
        </Button>
      </div>

      {/* Gallery grid */}
     {/* Gallery grid */}
{items.length === 0 ? (
  <p className="text-muted-foreground text-sm">No images yet.</p>
) : (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
    {items.map((g, idx) => (
      <motion.div 
        key={g.id ?? `gallery-${idx}`} 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: idx * 0.05 }}
        className="relative w-full h-64 rounded-xl overflow-hidden group cursor-pointer border bg-muted"
      >
        {/* The Image */}
        <img 
          src={g.image} 
          alt={g.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
        />

        {/* Smooth Gradient Overlay (Hidden by default, fades in on hover) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          
          <div className="flex justify-between items-center translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <div className="flex flex-col">
              <span className="text-white font-medium text-sm truncate max-w-[150px]">
                {g.title}
              </span>
              <span className="text-white/60 text-[10px]">
                {new Date().toLocaleDateString()} {/* Replace with actual date if available */}
              </span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevents triggering other click events
                remove(g.id);
              }}
              className="p-2 bg-red-500/20 hover:bg-red-500 text-red-200 hover:text-white rounded-full transition-colors duration-200"
              title="Delete Image"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        </div>
      </motion.div>
    ))}
  </div>
)}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={prevPage}
            disabled={page === 1}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <span>
            Page {page} of {totalPages}
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={nextPage}
            disabled={page === totalPages}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      )}

      {/* Add Modal */}
      <Dialog
        open={open}
        onOpenChange={(v) => {
          if (!isSaving) setOpen(v)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Gallery Image</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <Input
              placeholder="Title"
              value={active?.title ?? ""}
              onChange={(e) => setActive({ ...active!, title: e.target.value })}
            />

            {/* Image preview + upload */}
            <div className="flex items-center gap-3">
              {imageFile && (
                <img
                  src={URL.createObjectURL(imageFile)}
                  className="w-48 h-48 rounded-lg border object-cover"
                  alt="preview"
                />
              )}

              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <Upload className="size-4" />
                Upload image
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                />
              </label>
            </div>

            {/* Save button */}
            <Button onClick={save} className="w-full" disabled={isSaving}>
              {isSaving ? (
                <motion.div
                  className="flex items-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                  >
                    <Loader2 className="size-4" />
                  </motion.div>
                  Saving...
                </motion.div>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
