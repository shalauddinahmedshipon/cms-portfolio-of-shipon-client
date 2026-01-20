"use client"

import { Reorder, useDragControls } from "framer-motion"
import { GripVertical } from "lucide-react"

type Props = {
  projects: any[]
  onChange: (items: any[]) => void
}

// ── New small component for each item ──
function ProjectReorderItem({ project, index }: { project: any; index: number }) {
  const dragControls = useDragControls()   // Hook is now called consistently

  return (
    <Reorder.Item
      as="li"
      key={project.id}
      value={project}
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
        {project.images?.[0] ? (
          <img
            src={project.images[0]}
            alt={project.name}
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
        <p className="font-medium">{project.name}</p>
        <p className="text-xs text-muted-foreground">{project.category}</p>
      </div>

      {/* STATUS */}
      <div className="text-xs text-muted-foreground">
        {project.isActive ? "Active" : "Inactive"}
      </div>
    </Reorder.Item>
  )
}

export default function ProjectsReorderList({
  projects,
  onChange,
}: Props) {
  return (
    <Reorder.Group
      as="ul"
      axis="y"
      values={projects}
      onReorder={onChange}
      className="divide-y rounded-md border bg-background"
    >
      {projects.map((p, index) => (
        <ProjectReorderItem key={p.id} project={p} index={index} />
      ))}
    </Reorder.Group>
  )
}