"use client"

import { useEffect, useState } from "react"
import { Plus, Trash2, Upload, Pencil, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "sonner"

import {
  useGetEducationsQuery,
  useCreateEducationMutation,
  useUpdateEducationMutation,
  useDeleteEducationMutation,
} from "@/store/api/education.api"

import type { Education } from "@/types/education.types"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

import { buildEducationFormData } from "@/lib/helpers/build-education-formdata"

/* ------------------------------------------------------------------ */

const EMPTY: Partial<Education> = {
  level: "",
  institution: "",
  field: "",
  year: undefined,
  gpa: undefined,
  status: "",
}

/* ------------------------------------------------------------------ */

export default function EducationPage() {
  const { data, isLoading } = useGetEducationsQuery()

  const [createEducation, { isLoading: isCreating }] =
    useCreateEducationMutation()

  const [updateEducation, { isLoading: isUpdating }] =
    useUpdateEducationMutation()

  const [deleteEducation] = useDeleteEducationMutation()

  const isSaving = isCreating || isUpdating

  const [items, setItems] = useState<Education[]>([])
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState<Partial<Education> | null>(null)
  const [iconFile, setIconFile] = useState<File | null>(null)

  /* ------------------ Load data ------------------ */
  useEffect(() => {
    if (data) setItems(data)
  }, [data])

  /* ------------------ Save ------------------ */
  const save = async () => {
    if (!active?.level || !active.institution) {
      toast.error("Level & Institution are required")
      return
    }

    const fd = buildEducationFormData(active, iconFile)

    try {
      let saved: Education

      if (active.id) {
        saved = await updateEducation({
          id: active.id,
          data: fd,
        }).unwrap()

        setItems((prev) =>
          prev.map((i) => (i.id === saved.id ? saved : i)),
        )
      } else {
        saved = await createEducation(fd).unwrap()
        setItems((prev) => [saved, ...prev])
      }

      toast.success("Saved successfully")
      setOpen(false)
      setActive(null)
      setIconFile(null)
    } catch (err: any) {
      toast.error(err?.data?.message?.[0] || "Failed to save")
    }
  }

  /* ------------------ Delete ------------------ */
  const remove = async (id: string) => {
    try {
      await deleteEducation(id).unwrap()
      setItems((prev) => prev.filter((i) => i.id !== id))
      toast.success("Deleted")
    } catch {
      toast.error("Delete failed")
    }
  }

  /* ------------------ Loading skeleton ------------------ */
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
    )
  }

  /* ------------------ UI ------------------ */
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Education</h2>

        <Button
          size="sm"
          onClick={() => {
            setActive(EMPTY)
            setIconFile(null)
            setOpen(true)
          }}
        >
          <Plus className="size-4 mr-1" /> Add
        </Button>
      </div>

      {/* List */}
      <div className="space-y-6">
        {items.map((e) => (
          <Card
            key={e.id}
            className="hover:shadow-md transition-shadow"
          >
            <CardContent className="flex gap-4">
              {/* Icon */}
              <div className="shrink-0">
                {e.icon ? (
                  <img
                    src={e.icon}
                    alt={e.institution}
                    className="size-12 rounded-lg border object-cover"
                  />
                ) : (
                  <div className="size-12 rounded-lg bg-muted flex items-center justify-center text-xs text-muted-foreground">
                    N/A
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium truncate">
                    {e.level} — {e.institution}
                  </h3>

                  {e.status && (
                    <Badge variant="secondary">{e.status}</Badge>
                  )}
                </div>

                <div className="text-sm text-muted-foreground mt-1">
                  {e.field && <span>{e.field}</span>}
                  {e.year && <span> • {e.year}</span>}
                  {e.gpa && <span> • GPA {e.gpa}</span>}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-start gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setActive(e)
                    setIconFile(null)
                    setOpen(true)
                  }}
                >
                  <Pencil className="size-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(e.id)}
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal */}
      <Dialog
        open={open}
        onOpenChange={(v) => {
          if (!isSaving) setOpen(v)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {active?.id ? "Edit Education" : "Add Education"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <Input
              placeholder="Level (SSC / HSC / BSc)"
              value={active?.level ?? ""}
              onChange={(e) =>
                setActive({ ...active!, level: e.target.value })
              }
            />

            <Input
              placeholder="Institution"
              value={active?.institution ?? ""}
              onChange={(e) =>
                setActive({
                  ...active!,
                  institution: e.target.value,
                })
              }
            />

            <Input
              placeholder="Field"
              value={active?.field ?? ""}
              onChange={(e) =>
                setActive({ ...active!, field: e.target.value })
              }
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                type="number"
                placeholder="Year"
                value={active?.year ?? ""}
                onChange={(e) =>
                  setActive({
                    ...active!,
                    year: Number(e.target.value),
                  })
                }
              />

              <Input
                type="number"
                step="0.01"
                placeholder="GPA"
                value={active?.gpa ?? ""}
                onChange={(e) =>
                  setActive({
                    ...active!,
                    gpa: Number(e.target.value),
                  })
                }
              />
            </div>

            <Input
              placeholder="Status (Completed / Running)"
              value={active?.status ?? ""}
              onChange={(e) =>
                setActive({ ...active!, status: e.target.value })
              }
            />

            {/* Icon preview + upload */}
            <div className="flex items-center gap-3">
              {(iconFile || active?.icon) && (
                <img
                  src={
                    iconFile
                      ? URL.createObjectURL(iconFile)
                      : active?.icon
                  }
                  className="size-12 rounded-lg border object-cover"
                  alt="icon"
                />
              )}

              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <Upload className="size-4" />
                {active?.icon ? "Replace icon" : "Upload icon"}
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) =>
                    setIconFile(e.target.files?.[0] ?? null)
                  }
                />
              </label>
            </div>

            {/* Save button with loader */}
            <Button
              onClick={save}
              className="w-full"
              disabled={isSaving}
            >
              {isSaving ? (
                <motion.div
                  className="flex items-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.8,
                      ease: "linear",
                    }}
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
