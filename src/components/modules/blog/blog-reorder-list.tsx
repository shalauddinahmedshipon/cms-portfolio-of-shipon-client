"use client"

import { Reorder, useDragControls } from "framer-motion"
import { GripVertical } from "lucide-react"

type Props = {
  blogs: any[]
  onChange: (items: any[]) => void
}

// ── New small component for each item ──
function BlogReorderItem({ blog, index }: { blog: any; index: number }) {
  const dragControls = useDragControls()

  return (
    <Reorder.Item
      as="li"
      key={blog.id}
      value={blog}
      dragListener={false}
      dragControls={dragControls}
      className="flex items-center gap-4 px-4 py-3 bg-background hover:bg-muted/50"
    >
      {/* DRAG HANDLE */}
      <button
        type="button"
        onPointerDown={(e) => dragControls.start(e)}
        className="cursor-grab active:cursor-grabbing text-muted-foreground"
      >
        <GripVertical size={18} />
      </button>

      {/* ORDER */}
      <div className="w-8 text-sm text-muted-foreground">{index + 1}</div>

      {/* COVER IMAGE */}
      <div className="h-12 w-20 overflow-hidden rounded border bg-muted">
        {blog.coverImage ? (
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
            No image
          </div>
        )}
      </div>

      {/* NAME + CATEGORY */}
      <div className="flex-1">
        <p className="font-medium">{blog.title}</p>
        <p className="text-xs text-muted-foreground">{blog.category || "—"}</p>
      </div>

      {/* STATUS */}
      <div className="text-xs text-muted-foreground">
        {blog.isActive ? "Active" : "Inactive"}
      </div>
    </Reorder.Item>
  )
}

export default function BlogsReorderList({ blogs, onChange }: Props) {
  return (
    <Reorder.Group
      as="ul"
      axis="y"
      values={blogs}
      onReorder={onChange}
      className="divide-y rounded-md border bg-background"
    >
      {blogs.map((b, index) => (
        <BlogReorderItem key={b.id} blog={b} index={index} />
      ))}
    </Reorder.Group>
  )
}
