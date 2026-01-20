"use client"
import { useEffect, useMemo, useRef, useState } from "react"
import { Reorder } from "framer-motion"
import {
  Plus,
  GripVertical,
  Edit,
  Trash2,
  ArrowUpDown,
  Save,
  X,
} from "lucide-react"
import { toast } from "sonner"

import {
  useGetProjectsQuery,
  useDeleteProjectMutation,
  useReorderProjectsMutation,
} from "@/store/api/project.api"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import ProjectFormModal from "@/components/modules/project/project-form-modal"


export default function AdminProjectsPage() {
  const [page, setPage] = useState(1)
  const [isReordering, setIsReordering] = useState(false)
  const previousOrder = useRef<any[]>([])

  const { data, isLoading } = useGetProjectsQuery({
    page: isReordering ? 1 : page,
    limit: isReordering ? 1000 : 10,
  })

  const [deleteProject] = useDeleteProjectMutation()
  const [reorderProjects, { isLoading: savingOrder }] =
    useReorderProjectsMutation()

  const [projects, setProjects] = useState<any[]>([])
  const [openForm, setOpenForm] = useState(false)
  const [active, setActive] = useState<any>(null)

  useEffect(() => {
    if (data?.data) {
      const sorted = [...data.data].sort(
        (a, b) => (a.serialNo ?? 0) - (b.serialNo ?? 0),
      )
      setProjects(sorted)
    }
  }, [data])

 const onSaveReorder = async () => {
  try {
    await reorderProjects({
      ids: projects.map((p) => p.id),
    }).unwrap()

    setIsReordering(false)
    toast.success("Project order saved")
  } catch {
    setProjects(previousOrder.current)
    toast.error("Failed to reorder")
  }
}


  if (isLoading) {
    return <Skeleton className="h-40 w-full" />
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Projects</h2>

        <div className="flex gap-2">
          {!isReordering ? (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  previousOrder.current = projects
                  setIsReordering(true)
                }}
              >
                <ArrowUpDown className="size-4 mr-1" />
                Reorder
              </Button>

              <Button onClick={() => setOpenForm(true)}>
                <Plus className="size-4 mr-1" /> Add Project
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="destructive"
                onClick={() => {
                  setProjects(previousOrder.current)
                  setIsReordering(false)
                }}
              >
                <X className="size-4 mr-1" />
                Cancel
              </Button>

              <Button onClick={onSaveReorder} disabled={savingOrder}>
                <Save className="size-4 mr-1" />
                Save Order
              </Button>
            </>
          )}
        </div>
      </div>

      {/* List */}
      <Reorder.Group
        axis="y"
        values={projects}
        onReorder={setProjects}
      >
        {projects.map((p) => (
          <Reorder.Item
            key={p.id}
            value={p}
            dragListener={isReordering}
          >
            <Card className="p-4 flex justify-between items-center">
              <div className="flex items-center gap-4">
                {isReordering && (
                  <GripVertical className="cursor-grab text-muted-foreground" />
                )}

                <img
                  src={p.images?.[0]}
                  className="h-14 w-20 rounded object-cover"
                />

                <div>
                  <p className="font-medium">{p.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {p.category} • #{p.serialNo ?? "-"}
                  </p>
                </div>
              </div>

              {!isReordering && (
                <div className="flex gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      setActive(p)
                      setOpenForm(true)
                    }}
                  >
                    <Edit />
                  </Button>

                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={async () => {
                      await deleteProject(p.id)
                      toast.success("Project deleted")
                    }}
                  >
                    <Trash2 className="text-destructive" />
                  </Button>
                </div>
              )}
            </Card>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      {/* Modal */}
      <ProjectFormModal
        open={openForm}
        onClose={() => {
          setActive(null)
          setOpenForm(false)
        }}
        project={active}
      />
    </div>
  )
}
