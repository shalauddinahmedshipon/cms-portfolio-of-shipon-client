"use client"
import { useEffect, useMemo, useState } from "react"
import dynamic from "next/dynamic"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Loader2, Upload, X } from "lucide-react"
import { toast } from "sonner"

import {
  useCreateEventMutation,
  useUpdateEventMutation,
} from "@/store/api/event.api"

/* -------------------------------------------------------------------------- */
/*                              JODIT (NO SSR)                                 */
/* -------------------------------------------------------------------------- */
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false })

type Props = {
  open: boolean
  onClose: () => void
  event?: any
}

export default function EventFormModal({ open, onClose, event }: Props) {
  const [form, setForm] = useState<any>({
    eventType: "CONFERENCE",
    isActive: true,
  })
  const [description, setDescription] = useState("")
  const [images, setImages] = useState<File[]>([])
  const [existingImages, setExistingImages] = useState<string[]>([])
  const [removedImages, setRemovedImages] = useState<string[]>([])
  const [isEditorFullscreen, setIsEditorFullscreen] = useState(false)

  const [createEvent, { isLoading: creating }] = useCreateEventMutation()
  const [updateEvent, { isLoading: updating }] = useUpdateEventMutation()

  const isSaving = creating || updating

  /* -------------------------------------------------------------------------- */
  /*                         JODIT ICON BUTTONS                                  */
  /* -------------------------------------------------------------------------- */
  const enterFullscreenButton = {
    exec: () => setIsEditorFullscreen(true),
    iconURL:
      "data:image/svg+xml;base64," +
      btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
          viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M1 5V1h4"/>
          <path d="M11 1h4v4"/>
          <path d="M15 11v4h-4"/>
          <path d="M5 15H1v-4"/>
        </svg>
      `),
  }

  const exitFullscreenButton = {
    exec: () => setIsEditorFullscreen(false),
    iconURL:
      "data:image/svg+xml;base64," +
      btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
          viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M1 1h4v4"/>
          <path d="M15 1h-4v4"/>
          <path d="M15 15h-4v-4"/>
          <path d="M1 15h4v-4"/>
        </svg>
      `),
  }

  /* -------------------------------------------------------------------------- */
  /*                             JODIT CONFIGS                                  */
  /* -------------------------------------------------------------------------- */
  const normalConfig = useMemo(() => ({
    readonly: false,
    height: 360,
    toolbarAdaptive: false,
    toolbarSticky: false,
    showCharsCounter: false,
    showWordsCounter: false,
    buttons:
      "bold,italic,underline,strikethrough,|,ul,ol,|,font,fontsize,|,align,|,link,image,|,undo,redo,|",
    extraButtons: [enterFullscreenButton],
    image: {
      resize: true,
      resizeUseAspectRatio: true,
      caption: true,
      openOnDblClick: true,
    },
    uploader: {
      url: `${process.env.NEXT_PUBLIC_API_URL}/gallery/editor-image`,
      method: "POST",
      filesVariableName: () => "files",
      withCredentials: false,
      isSuccess: (resp: any) => !!resp.files?.length,
      process: (resp: any) => ({
        files: resp.files,
        path: "",
        baseurl: "",
        error: 0,
      }),
      defaultHandlerSuccess: function (this: any, data: any) {
        if (!data.files?.length) return
        data.files.forEach((url: string) => {
          this.s.insertImage(url)
        })
      },
    },
  }), [])

  const fullscreenConfig = useMemo(() => ({
    ...normalConfig,
    height: "100vh",
    zIndex: 10002,
    buttons:
      "bold,italic,underline,strikethrough,|,ul,ol,|,font,fontsize,|,align,|,link,image,table,|,undo,redo,|,source,|",
    extraButtons: [exitFullscreenButton],
  }), [normalConfig])

  /* -------------------------------------------------------------------------- */
  /*                          LOAD EVENT (EDIT MODE)                             */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    if (!open) return

    if (event) {
      setForm(event)
      setDescription(event.description || "")
      setExistingImages(event.images || [])
      setRemovedImages([])
    } else {
      setForm({ eventType: "CONFERENCE", isActive: true })
      setDescription("")
      setExistingImages([])
      setRemovedImages([])
    }

    setImages([])
  }, [event, open])

  useEffect(() => {
    if (!open) setIsEditorFullscreen(false)
  }, [open])

  /* -------------------------------------------------------------------------- */
  /*                                  SUBMIT                                    */
  /* -------------------------------------------------------------------------- */
  const handleSubmit = async () => {
    if (!form.name?.trim()) {
      toast.error("Event name is required")
      return
    }

    try {
      const fd = new FormData()

      fd.append("name", form.name)
      fd.append("title", form.title ?? "")
      fd.append("location", form.location ?? "")
      fd.append("eventType", form.eventType)
      fd.append("description", description)
      if (form.eventDate)
        fd.append("eventDate", new Date(form.eventDate).toISOString())
      fd.append("isActive", String(form.isActive))

      images.forEach((img) => fd.append("images", img))
      removedImages.forEach((url) => fd.append("removedImages[]", url))

      event?.id
        ? await updateEvent({ id: event.id, data: fd }).unwrap()
        : await createEvent(fd).unwrap()

      toast.success("Event saved successfully")
      onClose()
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to save event")
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                                    UI                                      */
  /* -------------------------------------------------------------------------- */
  return (
    <>
      <Dialog open={open && !isEditorFullscreen} onOpenChange={onClose}>
        <DialogContent className="w-[80vw] max-w-none sm:max-w-none h-[90vh] overflow-y-auto">
          <DialogHeader className="mb-8">
            <DialogTitle className="text-2xl font-semibold">
              {event ? "Update Event" : "Create Event"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-10">
            {/* NAME + EVENT TYPE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Event Name</Label>
                <Input
                  value={form.name ?? ""}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Event Type</Label>
                <select
                  className="w-full rounded-md border px-3 py-2"
                  value={form.eventType}
                  onChange={(e) =>
                    setForm({ ...form, eventType: e.target.value })
                  }
                >
                  <option value="CONFERENCE">Conference</option>
                  <option value="WORKSHOP">Workshop</option>
                  <option value="MEETUP">Meetup</option>
                  <option value="WEBINAR">Webinar</option>
                  <option value="CONTEST">Contest</option>
                  <option value="HACKATHON">Hackathon</option>
                </select>
              </div>
            </div>

            {/* LOCATION + DATE + IS ACTIVE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  value={form.location ?? ""}
                  onChange={(e) =>
                    setForm({ ...form, location: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Event Date</Label>
                <Input
                  type="datetime-local"
                  value={form.eventDate?.slice(0, 16) ?? ""}
                  onChange={(e) =>
                    setForm({ ...form, eventDate: e.target.value })
                  }
                />
              </div>

              
            </div>

            {/* DESCRIPTION */}
            <div className="space-y-3">
              <Label>Description</Label>
              <div className="rounded-md border bg-white overflow-hidden">
                <JoditEditor
                  value={description}
                  config={normalConfig}
                  onChange={setDescription}
                />
              </div>
            </div>

            {/* IMAGE UPLOAD */}
            <div className="space-y-4">
              <Label>Event Images</Label>

              {(existingImages.length > 0 || images.length > 0) && (
                <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                  {existingImages.map((url) => (
                    <div
                      key={url}
                      className="relative group rounded-md overflow-hidden border"
                    >
                      <img
                        src={url}
                        className="h-24 w-full object-cover"
                      />
                      <button
                        onClick={() => {
                          setExistingImages((prev) =>
                            prev.filter((img) => img !== url),
                          )
                          setRemovedImages((prev) => [...prev, url])
                        }}
                        className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}

                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative group rounded-md overflow-hidden border"
                    >
                      <img
                        src={URL.createObjectURL(img)}
                        className="h-24 w-full object-cover"
                      />
                      <button
                        onClick={() =>
                          setImages(images.filter((_, i) => i !== idx))
                        }
                        className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <label className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 cursor-pointer hover:bg-muted transition">
                <Upload className="h-6 w-6 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Click or drag images here
                </span>
                <input
                  type="file"
                  hidden
                  multiple
                  accept="image/*"
                  onChange={(e) =>
                    setImages((prev) => [
                      ...prev,
                      ...Array.from(e.target.files ?? []),
                    ])
                  }
                />
              </label>
            </div>

            {/* ACTION */}
            <div className="pt-6">
              <Button onClick={handleSubmit} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Event"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {isEditorFullscreen && (
        <div className="fixed inset-0 z-[9999] bg-background">
          <JoditEditor
            value={description}
            config={fullscreenConfig}
            onChange={setDescription}
          />
        </div>
      )}
    </>
  )
}
