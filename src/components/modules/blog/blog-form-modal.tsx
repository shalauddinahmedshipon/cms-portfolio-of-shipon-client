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

import { useCreateBlogMutation, useUpdateBlogMutation } from "@/store/api/blog.api"

/* -------------------------------------------------------------------------- */
/*                              JODIT (NO SSR)                                 */
/* -------------------------------------------------------------------------- */
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false })

type Props = {
  open: boolean
  onClose: () => void
  blog?: any
}

export default function BlogFormModal({ open, onClose, blog }: Props) {
  const [form, setForm] = useState<any>({
    category: "TECHNOLOGY",
    tags: [],
  })
  const [content, setContent] = useState("")
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null)
  const [existingCover, setExistingCover] = useState<string | null>(null)
  const [isEditorFullscreen, setIsEditorFullscreen] = useState(false)

  const [createBlog, { isLoading: creating }] = useCreateBlogMutation()
  const [updateBlog, { isLoading: updating }] = useUpdateBlogMutation()
  const isSaving = creating || updating

  /* -------------------------------------------------------------------------- */
  /*                         JODIT ICON BUTTONS                                  */
  /* -------------------------------------------------------------------------- */
  const enterFullscreenButton = {
    exec: () => setIsEditorFullscreen(true),
    iconURL:
      "data:image/svg+xml;base64," +
      btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
        viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M1 5V1h4"/>
        <path d="M11 1h4v4"/>
        <path d="M15 11v4h-4"/>
        <path d="M5 15H1v-4"/>
      </svg>`),
  }

  const exitFullscreenButton = {
    exec: () => setIsEditorFullscreen(false),
    iconURL:
      "data:image/svg+xml;base64," +
      btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
        viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M1 1h4v4"/>
        <path d="M15 1h-4v4"/>
        <path d="M15 15h-4v-4"/>
        <path d="M1 15h4v-4"/>
      </svg>`),
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
    image: { resize: true, resizeUseAspectRatio: true, caption: true, openOnDblClick: true },
    uploader: {
      url: `${process.env.NEXT_PUBLIC_API_URL}/gallery/editor-image`,
      method: "POST",
      filesVariableName: () => "files",
      withCredentials: false,
      isSuccess: (resp: any) => !!resp.files?.length,
      process: (resp: any) => ({ files: resp.files, path: "", baseurl: "", error: 0 }),
      defaultHandlerSuccess: function (this: any, data: any) {
        if (!data.files?.length) return
        data.files.forEach((url: string) => this.s.insertImage(url))
      },
    },
  }), [])

  const fullscreenConfig = useMemo(() => ({
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
    image: { resize: true, resizeUseAspectRatio: true, caption: true, openOnDblClick: true },
    uploader: normalConfig.uploader,
  }), [normalConfig])

  /* -------------------------------------------------------------------------- */
  /*                          LOAD BLOG (EDIT MODE)                               */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    if (!open) return
    if (blog) {
      setForm({
        title: blog.title,
        category: blog.category,
        tags: blog.tags.join(", "),
      })
      setContent(blog.content)
      setExistingCover(blog.coverImage || null)
      setCoverImageFile(null)
    } else {
      setForm({ category: "TECHNOLOGY", tags: [], title: "" })
      setContent("")
      setExistingCover(null)
      setCoverImageFile(null)
    }
  }, [blog, open])

  useEffect(() => {
    if (!open) setIsEditorFullscreen(false)
  }, [open])

  /* -------------------------------------------------------------------------- */
  /*                                  SUBMIT                                    */
  /* -------------------------------------------------------------------------- */
  const handleSubmit = async () => {
    if (!form.title?.trim()) {
      toast.error("Title is required")
      return
    }

    try {
      const fd = new FormData()
      fd.append("title", form.title)
      fd.append("category", form.category)
      fd.append("tags", form.tags || "")
      fd.append("content", content)
      if (coverImageFile) fd.append("coverImage", coverImageFile)

      blog?.id
        ? await updateBlog({ id: blog.id, data: fd }).unwrap()
        : await createBlog(fd).unwrap()

      toast.success("Blog saved successfully")
      onClose()
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to save blog")
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
              {blog ? "Update Blog" : "Create Blog"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-8">
            {/* TITLE */}
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

         
           {/* CATEGORY + TAGS */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* CATEGORY */}
  <div className="space-y-2">
    <Label>Category</Label>
    <select
      className="w-full rounded-md border px-3 py-2"
      value={form.category}
      onChange={(e) => setForm({ ...form, category: e.target.value })}
    >
      <option value="TECHNOLOGY">Technology</option>
      <option value="PROGRAMMING">Programming</option>
      <option value="LIFESTYLE">Lifestyle</option>
      <option value="TUTORIAL">Tutorial</option>
      <option value="NEWS">News</option>
    </select>
  </div>

  {/* TAGS */}
  <div className="space-y-2">
    <Label>Tags (comma separated)</Label>
    <Input
      value={form.tags}
      onChange={(e) => setForm({ ...form, tags: e.target.value })}
    />
  </div>
</div>


            {/* CONTENT */}
            <div className="space-y-3">
              <Label>Content</Label>
              <div className="rounded-md border bg-white overflow-hidden">
                <JoditEditor
                  value={content}
                  config={normalConfig}
                  onChange={setContent}
                />
              </div>
            </div>

            {/* COVER IMAGE */}
            <div className="space-y-2">
              <Label>Cover Image</Label>

              {existingCover && !coverImageFile && (
                <div className="relative w-64 h-40 border rounded overflow-hidden">
                  <img src={existingCover} className="w-full h-full object-cover" />
                  <button
                    onClick={() => setExistingCover(null)}
                    className="absolute top-1 right-1 p-1 rounded-full bg-black/50 text-white"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}

              {coverImageFile && (
                <div className="relative w-64 h-40 border rounded overflow-hidden">
                  <img
                    src={URL.createObjectURL(coverImageFile)}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => setCoverImageFile(null)}
                    className="absolute top-1 right-1 p-1 rounded-full bg-black/50 text-white"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}

              <label className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 cursor-pointer hover:bg-muted transition">
                <Upload className="h-6 w-6 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Click or drag image here
                </span>
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => setCoverImageFile(e.target.files?.[0] ?? null)}
                />
              </label>
            </div>

            {/* ACTION */}
            <div className="pt-4">
              <Button onClick={handleSubmit} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Blog"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {isEditorFullscreen && (
        <div className="fixed inset-0 z-[9999] bg-background">
          <JoditEditor
            value={content}
            config={fullscreenConfig}
            onChange={setContent}
          />
        </div>
      )}
    </>
  )
}
