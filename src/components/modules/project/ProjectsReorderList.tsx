"use client"

import { Reorder, useDragControls } from "framer-motion"
import { GripVertical } from "lucide-react"

type Props = {
  projects: any[]
  onChange: (items: any[]) => void
}

export default function ProjectsReorderList({
  projects,
  onChange,
}: Props) {
  return (
    <Reorder.Group
      as="ul"                 // ✅ REQUIRED
      axis="y"
      values={projects}
      onReorder={onChange}
      className="divide-y rounded-md border bg-background"
    >
      {projects.map((p, index) => {
        const dragControls = useDragControls()

        return (
          <Reorder.Item
            as="li"            // ✅ REQUIRED
            key={p.id}
            value={p}          // object identity MUST be stable
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
            <div className="w-8 text-sm text-muted-foreground">
              {index + 1}
            </div>

            {/* IMAGE */}
            <div className="h-12 w-20 overflow-hidden rounded border bg-muted">
              {p.images?.[0] ? (
                <img
                  src={p.images[0]}   // ✅ CLOUDINARY DIRECT
                  alt={p.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                  No image
                </div>
              )}
            </div>

            {/* NAME */}
            <div className="flex-1">
              <p className="font-medium">{p.name}</p>
              <p className="text-xs text-muted-foreground">
                {p.category}
              </p>
            </div>

            {/* STATUS */}
            <div className="text-xs text-muted-foreground">
              {p.isActive ? "Active" : "Inactive"}
            </div>
          </Reorder.Item>
        )
      })}
    </Reorder.Group>
  )
}
