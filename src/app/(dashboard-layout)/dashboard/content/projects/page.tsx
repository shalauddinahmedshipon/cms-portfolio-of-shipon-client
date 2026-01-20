"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowUpDown, Plus, Save, X } from "lucide-react"
import { toast } from "sonner"

import {
  useGetProjectsQuery,
  useReorderProjectsMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} from "@/store/api/project.api"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import ProjectsTable from "@/components/modules/project/project-table"
import ProjectsReorderList from "@/components/modules/project/ProjectsReorderList"
import ProjectFormModal from "@/components/modules/project/project-form-modal"
import ProjectViewModal from "@/components/modules/project/ProjectViewModal"

export default function AdminProjectsPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [isReordering, setIsReordering] = useState(false)
  const [openForm, setOpenForm] = useState(false)
  const [openView, setOpenView] = useState(false)
  const [selectedProject, setSelectedProject] = useState<any>(null)

  const [projects, setProjects] = useState<any[]>([])
  const previousOrder = useRef<any[]>([])

  const { data, isLoading } = useGetProjectsQuery({
    page: isReordering ? 1 : page,
    limit: isReordering ? 1000 : 10,
    search,
  })

  const [reorderProjects] = useReorderProjectsMutation()
  const [updateProject] = useUpdateProjectMutation()
  const [deleteProject] = useDeleteProjectMutation()

  useEffect(() => {
    if (!isReordering && data?.data) {
      setProjects(data.data)
    }
  }, [data, isReordering])

  if (isLoading) return <Skeleton className="h-40" />

  /* ---------------- TOGGLES ---------------- */

  const toggleFavorite = async (p: any) => {
    try {
      const fd = new FormData()
      fd.append("isFavorite", String(!p.isFavorite))
      fd.append("isActive", String(p.isActive))
      await updateProject({ id: p.id, data: fd }).unwrap()
      toast.success("Favorite updated")
    } catch {
      toast.error("Failed to update favorite")
    }
  }

  const toggleActive = async (p: any) => {
    try {
      const fd = new FormData()
      fd.append("isActive", String(!p.isActive))
      fd.append("isFavorite", String(p.isFavorite))
      await updateProject({ id: p.id, data: fd }).unwrap()
      toast.success("Status updated")
    } catch {
      toast.error("Failed to update status")
    }
  }

  /* ---------------- DELETE ---------------- */

  const confirmDelete = (p: any) => {
    toast.custom((t) => (
      <div className="rounded-lg border bg-background p-4 w-[320px]">
        <h4 className="font-semibold mb-2">Delete Project</h4>
        <p className="text-sm mb-4">
          Delete <b>{p.name}</b>?
        </p>

        <div className="flex justify-end gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => toast.dismiss(t)}
          >
            Cancel
          </Button>

          <Button
            size="sm"
            variant="destructive"
            onClick={async () => {
              toast.loading("Deleting...", { id: p.id })
              try {
                await deleteProject(p.id).unwrap()
                toast.success("Deleted", { id: p.id })
              } catch {
                toast.error("Delete failed", { id: p.id })
              } finally {
                toast.dismiss(t)
              }
            }}
          >
            Delete
          </Button>
        </div>
      </div>
    ))
  }

  /* ---------------- SAVE ORDER ---------------- */

  const saveOrder = async () => {
    try {
      await reorderProjects({
        ids: projects.map((p) => p.id),
      }).unwrap()

      setIsReordering(false)
      toast.success("Order updated")
    } catch {
      setProjects(previousOrder.current)
      toast.error("Reorder failed")
    }
  }

  return (
    <div className="space-y-5">
      {/* HEADER */}
      <div className="flex justify-between">
        <h2 className="text-lg font-semibold">Projects</h2>

        {!isReordering ? (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                previousOrder.current = projects
                setIsReordering(true)
              }}
            >
              <ArrowUpDown className="mr-1 size-4" />
              Reorder
            </Button>

            <Button
              onClick={() => {
                setSelectedProject(null)
                setOpenForm(true)
              }}
            >
              <Plus className="mr-1 size-4" />
              Add Project
            </Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="destructive"
              onClick={() => {
                setProjects(previousOrder.current)
                setIsReordering(false)
              }}
            >
              <X className="mr-1 size-4" />
              Cancel
            </Button>

            <Button onClick={saveOrder}>
              <Save className="mr-1 size-4" />
              Save
            </Button>
          </div>
        )}
      </div>

      {!isReordering ? (
        <ProjectsTable
          data={projects}
          onView={(p) => {
            setSelectedProject(p)
            setOpenView(true)
          }}
          onEdit={(p) => {
            setSelectedProject(p)
            setOpenForm(true)
          }}
          onDelete={confirmDelete}
          onToggleFavorite={toggleFavorite}
          onToggleActive={toggleActive}
        />
      ) : (
        <ProjectsReorderList
          projects={projects}
          onChange={setProjects}
        />
      )}

      {/* VIEW MODAL */}
      <ProjectViewModal
        open={openView}
        onClose={() => {
          setOpenView(false)
          setSelectedProject(null)
        }}
        project={selectedProject}
      />

      {/* FORM MODAL */}
      <ProjectFormModal
        open={openForm}
        project={selectedProject}
        onClose={() => {
          setOpenForm(false)
          setSelectedProject(null)
        }}
      />
    </div>
  )
}