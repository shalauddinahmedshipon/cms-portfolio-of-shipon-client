"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowUpDown, Plus, Save, X, Search, RotateCcw } from "lucide-react"
import { toast } from "sonner"
import debounce from "lodash/debounce"

import {
  useGetProjectsQuery,
  useReorderProjectsMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} from "@/store/api/project.api"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import ProjectsTable from "@/components/modules/project/project-table"
import ProjectsReorderList from "@/components/modules/project/ProjectsReorderList"
import ProjectFormModal from "@/components/modules/project/project-form-modal"
import ProjectViewModal from "@/components/modules/project/ProjectViewModal"

export default function AdminProjectsPage() {
  /* ---------------- STATE ---------------- */
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [status, setStatus] = useState("all")
  const [favorite, setFavorite] = useState("all")

  const [isReordering, setIsReordering] = useState(false)
  const [openForm, setOpenForm] = useState(false)
  const [openView, setOpenView] = useState(false)
  const [selectedProject, setSelectedProject] = useState<any>(null)

  const [projects, setProjects] = useState<any[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const previousOrder = useRef<any[]>([])

  /* ---------------- SEARCH (DEBOUNCE) ---------------- */
  const debouncedSetSearch = debounce((value: string) => {
    setSearch(value.trim())
    setPage(1)
  }, 400)

  /* ---------------- QUERY PARAMS ---------------- */
  const queryParams = isReordering
    ? { page: 1, limit: 1000 }
    : {
        page,
        limit: 10,
        search: search || undefined,
        category: category === "all" ? undefined : category,
        isActive:
          status === "all"
            ? undefined
            : status === "active",
        isFavorite:
          favorite === "all"
            ? undefined
            : favorite === "favorite",
      }

  const { data, isLoading, isFetching } = useGetProjectsQuery(queryParams)

  const [reorderProjects] = useReorderProjectsMutation()
  const [updateProject] = useUpdateProjectMutation()
  const [deleteProject] = useDeleteProjectMutation()

  /* ---------------- DATA SYNC ---------------- */
  useEffect(() => {
    if (data) {
      setProjects(data.data)
      setTotalPages(data.meta.totalPages)
      setTotal(data.meta.total)
    }
  }, [data])

  /* ---------------- RESET PAGE ON FILTER CHANGE ---------------- */
  useEffect(() => {
    if (!isReordering) {
      setPage(1)
    }
  }, [search, category, status, favorite, isReordering])

  if (isLoading && !isFetching) return <Skeleton className="h-40" />

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
          <Button size="sm" variant="outline" onClick={() => toast.dismiss(t)}>
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
      await reorderProjects({ ids: projects.map((p) => p.id) }).unwrap()
      setIsReordering(false)
      toast.success("Order updated")
    } catch {
      setProjects(previousOrder.current)
      toast.error("Reorder failed")
    }
  }

  /* ---------------- RESET FILTERS ---------------- */
  const resetFilters = () => {
    setSearch("")
    setCategory("all")
    setStatus("all")
    setFavorite("all")
    setPage(1)
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="space-y-5">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Projects</h2>

        {!isReordering ? (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                previousOrder.current = [...projects]
                setIsReordering(true)
              }}
            >
              <ArrowUpDown className="mr-1 size-4" />
              Reorder
            </Button>

            <Button onClick={() => {
    setSelectedProject(null) // ✅ VERY IMPORTANT
    setOpenForm(true)
  }}>
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

      {/* FILTERS */}
      {!isReordering && (
        <div className="flex flex-wrap gap-4 items-end">
          {/* SEARCH */}
          <div className="flex-1 min-w-[220px] relative">
            <label className="text-xs text-muted-foreground mb-1 block">
              Search
            </label>
            <Search className="absolute left-3 top-9 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or title..."
              className="pl-9"
              onChange={(e) => debouncedSetSearch(e.target.value)}
            />
          </div>

          {/* CATEGORY */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">Category</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="LEARNING">Learning</SelectItem>
                <SelectItem value="LIVE">Live</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* STATUS */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">Status</label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* FAVORITE */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">Favorite</label>
            <Select value={favorite} onValueChange={setFavorite}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="favorite">Only Favorites</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* RESET */}
          <Button
            variant="ghost"
            size="icon"
            onClick={resetFilters}
            title="Reset filters"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* CONTENT */}
      {isReordering ? (
        <ProjectsReorderList projects={projects} onChange={setProjects} />
      ) : (
        <>
          {isFetching && (
            <div className="text-center py-4 text-muted-foreground">
              Loading...
            </div>
          )}

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

          {/* PAGINATION */}
          <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1 || isFetching}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>

            <span>
              Page {page} of {totalPages} ({total} projects)
            </span>

            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages || isFetching}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </>
      )}

      <ProjectViewModal
        open={openView}
        onClose={() => setOpenView(false)}
        project={selectedProject}
      />

      <ProjectFormModal
        open={openForm}
        project={selectedProject}
        onClose={() => setOpenForm(false)}
      />
    </div>
  )
}
