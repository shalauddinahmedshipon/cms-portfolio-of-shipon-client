"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Reorder, motion } from "framer-motion"
import {
  Plus,
  Trash2,
  Star,
  GripVertical,
  Upload,
  Edit2Icon,
  Loader2,
} from "lucide-react"
import { toast } from "sonner"

import {
  useGetCodingProfilesQuery,
  useCreateCodingProfileMutation,
  useUpdateCodingProfileMutation,
  useDeleteCodingProfileMutation,
  useReorderCodingProfilesMutation,
} from "@/store/api/profile.api"

import type { CodingProfile } from "@/types/profile.types"

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

/* ---------------------------------------------------------------- */

const EMPTY_PROFILE: Partial<CodingProfile> = {
  platform: "",
  username: "",
  profileUrl: "",
  rating: undefined,
  badge: "",
  highlight: false,
}

/* ----------------------- HELPERS ----------------------- */

function applyHighlightPin(items: CodingProfile[]) {
  return [...items].sort(
    (a, b) => Number(b.highlight) - Number(a.highlight),
  )
}

function restoreSourceOrder(
  rendered: CodingProfile[],
  source: CodingProfile[],
) {
  const map = new Map(source.map((i) => [i.id, i]))
  return rendered.map((i) => map.get(i.id)!)
}

function buildFormData(
  profile: Partial<CodingProfile>,
  iconFile?: File | null,
) {
  const allowedKeys: (keyof CodingProfile)[] = [
    "platform",
    "username",
    "profileUrl",
    "rating",
    "badge",
    "highlight",
  ]

  const fd = new FormData()

  for (const key of allowedKeys) {
    const value = profile[key]
    if (value !== undefined && value !== null && value !== "") {
      fd.append(key, String(value))
    }
  }

  if (iconFile) fd.append("icon", iconFile)

  return fd
}

/* ---------------------------------------------------------------- */

export default function CodingProfilePage() {
  const { data, isLoading } = useGetCodingProfilesQuery()

  const [createProfile, { isLoading: isCreating }] =
    useCreateCodingProfileMutation()

  const [updateProfile, { isLoading: isUpdating }] =
    useUpdateCodingProfileMutation()

  const [deleteProfile] = useDeleteCodingProfileMutation()
  const [reorderProfiles] = useReorderCodingProfilesMutation()

  const isSaving = isCreating || isUpdating

  const [profiles, setProfiles] = useState<CodingProfile[]>([])
  const previousOrder = useRef<CodingProfile[]>([])

  const [open, setOpen] = useState(false)
  const [active, setActive] = useState<Partial<CodingProfile> | null>(null)
  const [iconFile, setIconFile] = useState<File | null>(null)

  /* ---------------------- LOAD ---------------------- */
  useEffect(() => {
    if (data) setProfiles(data)
  }, [data])

  /* ---------------------- RENDER ORDER ---------------------- */
  const renderedProfiles = useMemo(
    () => applyHighlightPin(profiles),
    [profiles],
  )

  /* ---------------------- REORDER ---------------------- */
  const onReorder = async (rendered: CodingProfile[]) => {
    const sourceOrder = restoreSourceOrder(rendered, profiles)

    previousOrder.current = profiles
    setProfiles(sourceOrder)

    try {
      await reorderProfiles(
        sourceOrder.map((item, index) => ({
          id: item.id,
          order: index,
        })),
      ).unwrap()

      toast.success("Order updated", {
        action: {
          label: "Undo",
          onClick: () => {
            setProfiles(previousOrder.current)
            reorderProfiles(
              previousOrder.current.map((item, index) => ({
                id: item.id,
                order: index,
              })),
            )
          },
        },
      })
    } catch {
      setProfiles(previousOrder.current)
      toast.error("Failed to save order")
    }
  }

  /* ---------------------- SAVE ---------------------- */
  const saveProfile = async () => {
    if (!active?.platform || !active.username) {
      toast.error("Platform & username are required")
      return
    }

    const formData = buildFormData(active, iconFile)

    try {
      let saved: CodingProfile

      if (active.id) {
        saved = await updateProfile({
          id: active.id,
          data: formData,
        }).unwrap()

        setProfiles((prev) =>
          prev.map((p) => (p.id === saved.id ? saved : p)),
        )
      } else {
        saved = await createProfile(formData).unwrap()
        setProfiles((prev) => [...prev, saved])
      }

      setOpen(false)
      setActive(null)
      setIconFile(null)
      toast.success("Profile saved")
    } catch (err: any) {
      toast.error(
        err?.data?.message?.[0] ||
          err?.data?.message ||
          "Failed to save profile",
      )
    }
  }

  /* ---------------------- DELETE ---------------------- */
  const removeProfile = async (id: string) => {
    try {
      await deleteProfile(id).unwrap()
      setProfiles((prev) => prev.filter((p) => p.id !== id))
      toast.success("Profile deleted")
    } catch {
      toast.error("Delete failed")
    }
  }

  /* ---------------------- LOADING ---------------------- */
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <Skeleton key={i} className="h-16 rounded-lg" />
        ))}
      </div>
    )
  }

  /* ---------------------- UI ---------------------- */
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Coding Profiles</h2>
        <Button
          size="sm"
          onClick={() => {
            setActive(EMPTY_PROFILE)
            setIconFile(null)
            setOpen(true)
          }}
        >
          <Plus className="size-4 mr-1" /> Add
        </Button>
      </div>

      {/* List */}
      <Reorder.Group
        axis="y"
        values={renderedProfiles}
        onReorder={onReorder}
        className="space-y-2"
      >
        {renderedProfiles.map((p) => (
          <Reorder.Item
            key={p.id}
            value={p}
            className="focus:outline-none"
          >
            <Card>
              <CardContent className="flex items-center justify-between px-3">
                <div className="flex items-center gap-6 min-w-0">
                  <GripVertical className="size-4 text-muted-foreground cursor-grab" />

                  {p.iconUrl && (
                    <img
                      src={p.iconUrl}
                      alt={p.platform}
                      className="size-16 rounded-md"
                    />
                  )}

                  <div className="flex flex-wrap items-center gap-x-2 text-lg min-w-0">
                    <span className="font-medium truncate">
                      {p.platform}
                    </span>
                    <span className="text-muted-foreground truncate">
                      @{p.username}
                    </span>

                    {p.rating && (
                      <span className="text-xs">• {p.rating}</span>
                    )}

                    {p.badge && (
                      <span className="text-xs bg-muted px-2 rounded">
                        {p.badge}
                      </span>
                    )}

                    {p.highlight && (
                      <Star className="size-3 text-yellow-500" />
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setActive(p)
                      setIconFile(null)
                      setOpen(true)
                    }}
                  >
                    <Edit2Icon />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeProfile(p.id)}
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Reorder.Item>
        ))}
      </Reorder.Group>

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
              {active?.id ? "Edit Coding Profile" : "Add Coding Profile"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <Input
              placeholder="Platform"
              value={active?.platform ?? ""}
              onChange={(e) =>
                setActive({ ...active!, platform: e.target.value })
              }
            />

            <Input
              placeholder="Username"
              value={active?.username ?? ""}
              onChange={(e) =>
                setActive({ ...active!, username: e.target.value })
              }
            />

            <Input
              placeholder="Profile URL"
              value={active?.profileUrl ?? ""}
              onChange={(e) =>
                setActive({ ...active!, profileUrl: e.target.value })
              }
            />

            <Input
              type="number"
              placeholder="Rating"
              value={active?.rating ?? ""}
              onChange={(e) =>
                setActive({
                  ...active!,
                  rating: Number(e.target.value),
                })
              }
            />

            <Input
              placeholder="Badge"
              value={active?.badge ?? ""}
              onChange={(e) =>
                setActive({ ...active!, badge: e.target.value })
              }
            />

            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <Upload className="size-4" />
              Upload Icon
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) =>
                  setIconFile(e.target.files?.[0] ?? null)
                }
              />
            </label>

            <div className="flex items-center gap-2">
              <Checkbox
                checked={active?.highlight ?? false}
                onCheckedChange={(v) =>
                  setActive({ ...active!, highlight: Boolean(v) })
                }
              />
              <span className="text-sm flex items-center gap-1">
                <Star className="size-4" /> Highlight
              </span>
            </div>

            <Button
              onClick={saveProfile}
              disabled={isSaving}
              className="w-full"
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
