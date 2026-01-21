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
  useCreateProjectMutation,
  useUpdateProjectMutation,
} from "@/store/api/project.api"

/* -------------------------------------------------------------------------- */
/*                              JODIT (NO SSR)                                 */
/* -------------------------------------------------------------------------- */
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false })

type Props = {
  open: boolean
  onClose: () => void
  project?: any
}

export default function ProjectFormModal({ open, onClose, project }: Props) {
  const [form, setForm] = useState<any>({
    category: "LEARNING",
  })
  const [description, setDescription] = useState("")
  const [images, setImages] = useState<File[]>([])
  const [existingImages, setExistingImages] = useState<string[]>([])
  const [removedImages, setRemovedImages] = useState<string[]>([])
  const [isEditorFullscreen, setIsEditorFullscreen] = useState(false)

  const [createProject, { isLoading: creating }] =
    useCreateProjectMutation()
  const [updateProject, { isLoading: updating }] =
    useUpdateProjectMutation()

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

  const normalConfig = useMemo(
    () => ({
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
    }),
    []
  )


const fullscreenConfig = useMemo(
  () => ({
    readonly: false,
    height: "100vh",
    toolbarAdaptive: false,
    toolbarSticky: false,
    zIndex: 10002,
    showCharsCounter: false,
    showWordsCounter: false,
    askBeforePasteHTML: false,
    buttons:
      "bold,italic,underline,strikethrough,|,ul,ol,|,font,fontsize,|,align,|,link,image,table,|,undo,redo,|,source,|",
    extraButtons: [exitFullscreenButton],

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


  }),
  []
)


  /* -------------------------------------------------------------------------- */
  /*                          LOAD PROJECT (EDIT MODE)                           */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    if (!open) return

    if (project) {
      setForm(project)
      setDescription(project.description || "")
      setExistingImages(project.images || [])
      setRemovedImages([])
    } else {
      setForm({ category: "LEARNING" })
      setDescription("")
      setExistingImages([])
      setRemovedImages([])
    }

    setImages([])
  }, [project, open])

  useEffect(() => {
    if (!open) setIsEditorFullscreen(false)
  }, [open])

  /* -------------------------------------------------------------------------- */
  /*                                  SUBMIT                                    */
  /* -------------------------------------------------------------------------- */
  const handleSubmit = async () => {
    if (!form.name?.trim()) {
      toast.error("Project name is required")
      return
    }

    try {
      const fd = new FormData()

      fd.append("name", form.name)
      fd.append("title", form.title ?? "")
      fd.append("technology", form.technology ?? "")
      fd.append("category", form.category)
      fd.append("description", description)

      if (form.liveSiteUrl) fd.append("liveSiteUrl", form.liveSiteUrl)
      if (form.githubFrontendUrl)
        fd.append("githubFrontendUrl", form.githubFrontendUrl)
      if (form.githubBackendUrl)
        fd.append("githubBackendUrl", form.githubBackendUrl)

      images.forEach((img) => fd.append("images", img))

      if (removedImages.length > 0) {
        removedImages.forEach((url) =>
          fd.append("removedImages[]", url),
        )
      }

      project?.id
        ? await updateProject({ id: project.id, data: fd }).unwrap()
        : await createProject(fd).unwrap()

      toast.success("Project saved successfully")
      onClose()
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to save project")
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
              {project ? "Update Project" : "Create Project"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-10">
            {/* NAME + CATEGORY */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Project Name</Label>
                <Input
                  value={form.name ?? ""}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <select
                  className="w-full rounded-md border px-3 py-2"
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                >
                  <option value="LEARNING">Learning</option>
                  <option value="LIVE">Live</option>
                </select>
              </div>
            </div>

            {/* SINGLE ROW FIELDS */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Project Title</Label>
                <Input
                  value={form.title ?? ""}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Technology Stack</Label>
                <Input
                  placeholder="NestJS, Next.js, PostgreSQL"
                  value={form.technology ?? ""}
                  onChange={(e) =>
                    setForm({ ...form, technology: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Live Site URL</Label>
                <Input
                  value={form.liveSiteUrl ?? ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      liveSiteUrl: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>GitHub Frontend URL</Label>
                <Input
                  value={form.githubFrontendUrl ?? ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      githubFrontendUrl: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>GitHub Backend URL</Label>
                <Input
                  value={form.githubBackendUrl ?? ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      githubBackendUrl: e.target.value,
                    })
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
  <Label>Project Images</Label>

  {/* IMAGES GRID (OLD + NEW TOGETHER) */}
  {(existingImages.length > 0 || images.length > 0) && (
    <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
      {/* EXISTING IMAGES */}
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

      {/* NEW IMAGES */}
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

  {/* UPLOAD AREA */}
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
                  "Save Project"
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
