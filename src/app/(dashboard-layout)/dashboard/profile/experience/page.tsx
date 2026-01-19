"use client"

import { useEffect, useState } from "react"
import { Plus, Trash2, Edit2 } from "lucide-react"
import { toast } from "sonner"

import {
  useGetExperiencesQuery,
  useCreateExperienceMutation,
  useUpdateExperienceMutation,
  useDeleteExperienceMutation,
} from "@/store/api/experience.api"

import type { Experience } from "@/types/experience.types"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

import { useAsyncModalForm } from "@/hooks/useAsyncModalForm"
import { ImageUpload } from "@/components/shared/ImageUpload"
import { ExperienceTimeline } from "@/components/modules/experience/ExperienceTimeline"
import { buildExperienceFormData } from "@/lib/helpers/build-formdata"


/* ---------------------------------------------------------------- */

const EMPTY: Partial<Experience> = {
  companyName: "",
  role: "",
  employmentType: "",
  startDate: "",
  endDate: "",
  isCurrent: false,
  location: "",
  description: "",
}

export default function ExperiencePage() {
  const { data, isLoading } = useGetExperiencesQuery()

  const [createExperience] = useCreateExperienceMutation()
  const [updateExperience] = useUpdateExperienceMutation()
  const [deleteExperience] = useDeleteExperienceMutation()

  const [items, setItems] = useState<Experience[]>([])
  const [logoFile, setLogoFile] = useState<File | null>(null)

  /* ------------------ MODAL FORM HOOK ------------------ */
  const form = useAsyncModalForm<Partial<Experience>>({
    initialData: EMPTY,

    onCreate: async (data) => {
     const fd = buildExperienceFormData(data, logoFile)
      const saved = await createExperience(fd).unwrap()
      setItems((prev) => [saved, ...prev])
      setLogoFile(null)
    },

    onUpdate: async (data) => {
      const fd = buildExperienceFormData(data, logoFile)
      const saved = await updateExperience({
        id: data.id!,
        data: fd,
      }).unwrap()

      setItems((prev) =>
        prev.map((i) => (i.id === saved.id ? saved : i)),
      )
      setLogoFile(null)
    },
  })

  /* ---------------------- LOAD ---------------------- */
  useEffect(() => {
    if (data) setItems(data)
  }, [data])

  /* ---------------------- DELETE ---------------------- */
  const remove = async (id: string) => {
    try {
      await deleteExperience(id).unwrap()
      setItems((prev) => prev.filter((i) => i.id !== id))
      toast.success("Deleted")
    } catch {
      toast.error("Delete failed")
    }
  }

  /* ---------------------- LOADING ---------------------- */
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
    )
  }

  /* ---------------------- UI ---------------------- */
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Experience</h2>
        <Button size="sm" onClick={form.openCreate}>
          <Plus className="size-4 mr-1" /> Add
        </Button>
      </div>

  
{/* Timeline */}
<ExperienceTimeline
  items={[...items].sort((a, b) => {
    const aTime = a.startDate
      ? new Date(a.startDate).getTime()
      : 0

    const bTime = b.startDate
      ? new Date(b.startDate).getTime()
      : 0

    return bTime - aTime
  })}
  onEdit={(e) => {
    form.openEdit(e)
    setLogoFile(null)
  }}
  onDelete={remove}
/>


      {/* Modal */}
      <Dialog open={form.open} onOpenChange={form.close}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {form.active?.id ? "Edit Experience" : "Add Experience"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <Input
              placeholder="Company Name"
              value={form.active?.companyName ?? ""}
              onChange={(e) =>
                form.setActive({
                  ...form.active!,
                  companyName: e.target.value,
                })
              }
            />

            <Input
              placeholder="Role"
              value={form.active?.role ?? ""}
              onChange={(e) =>
                form.setActive({
                  ...form.active!,
                  role: e.target.value,
                })
              }
            />

            <Input
              placeholder="Employment Type"
              value={form.active?.employmentType ?? ""}
              onChange={(e) =>
                form.setActive({
                  ...form.active!,
                  employmentType: e.target.value,
                })
              }
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                type="date"
                value={form.active?.startDate ?? ""}
                onChange={(e) =>
                  form.setActive({
                    ...form.active!,
                    startDate: e.target.value,
                  })
                }
              />

              <Input
                type="date"
                disabled={form.active?.isCurrent}
                value={form.active?.endDate ?? ""}
                onChange={(e) =>
                  form.setActive({
                    ...form.active!,
                    endDate: e.target.value,
                  })
                }
              />
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                checked={form.active?.isCurrent ?? false}
                onCheckedChange={(v) =>
                  form.setActive({
                    ...form.active!,
                    isCurrent: Boolean(v),
                    endDate: "",
                  })
                }
              />
              <span className="text-sm">Currently working</span>
            </div>

            <Input
              placeholder="Location"
              value={form.active?.location ?? ""}
              onChange={(e) =>
                form.setActive({
                  ...form.active!,
                  location: e.target.value,
                })
              }
            />

            <Textarea
              placeholder="Description"
              value={form.active?.description ?? ""}
              onChange={(e) =>
                form.setActive({
                  ...form.active!,
                  description: e.target.value,
                })
              }
            />

            {/* Image Upload with Preview */}
            <ImageUpload
              file={logoFile}
              preview={form.active?.companyLogo}
              onChange={setLogoFile}
            />

            <Button
              onClick={form.submit}
              disabled={form.loading}
              className="w-full"
            >
              {form.loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
