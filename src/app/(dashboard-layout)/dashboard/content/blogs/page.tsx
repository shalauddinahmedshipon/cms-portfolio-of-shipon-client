"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowUpDown, Plus, Save, X, Search, RotateCcw } from "lucide-react"
import { toast } from "sonner"
import debounce from "lodash/debounce"

import {
  useGetBlogsQuery,
  useReorderBlogsMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} from "@/store/api/blog.api"

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
import BlogsTable from "@/components/modules/blog/blog-table"
import BlogFormModal from "@/components/modules/blog/blog-form-modal"
import BlogViewModal from "@/components/modules/blog/blog-view-modal"
import BlogsReorderList from "@/components/modules/blog/blog-reorder-list"

export default function AdminBlogsPage() {
  /* ---------------- STATE ---------------- */
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [status, setStatus] = useState("all")
  const [favorite, setFavorite] = useState("all")

  const [isReordering, setIsReordering] = useState(false)
  const [openForm, setOpenForm] = useState(false)
  const [openView, setOpenView] = useState(false)
  const [selectedBlog, setSelectedBlog] = useState<any>(null)

  const [blogs, setBlogs] = useState<any[]>([])
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

  const { data, isLoading, isFetching } = useGetBlogsQuery(queryParams)
  const [reorderBlogs] = useReorderBlogsMutation()
  const [updateBlog] = useUpdateBlogMutation()
  const [deleteBlog] = useDeleteBlogMutation()

  /* ---------------- DATA SYNC ---------------- */
  useEffect(() => {
    if (data) {
      setBlogs(data.data)
      setTotalPages(data.meta.totalPages)
      setTotal(data.meta.total)
    }
  }, [data])

  useEffect(() => {
    if (!isReordering) setPage(1)
  }, [search, category, status, favorite, isReordering])

  /* ---------------- PAGE LOADING SKELETON ---------------- */
  if (isLoading && !isFetching) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-8 w-48" />
        <div className="flex flex-wrap gap-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-36" />
          <Skeleton className="h-10 w-36" />
          <Skeleton className="h-10 w-36" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  /* ---------------- TOGGLES ---------------- */
 const toggleFeatured = async (b: any) => {
  try {
    const fd = new FormData()
    fd.append("isFeatured", String(!b.isFeatured))
    fd.append("isActive", String(b.isActive))

    await updateBlog({ id: b.id, data: fd }).unwrap()
    toast.success("Featured updated")
  } catch {
    toast.error("Failed to update featured")
  }
}


  const toggleActive = async (b: any) => {
    try {
      const fd = new FormData()
      fd.append("isActive", String(!b.isActive))
       fd.append("isFeatured", String(b.isFeatured))
      await updateBlog({ id: b.id, data: fd }).unwrap()
      toast.success("Status updated")
    } catch {
      toast.error("Failed to update status")
    }
  }

  /* ---------------- DELETE ---------------- */
  const confirmDelete = (b: any) => {
    toast.custom((t) => (
      <div className="rounded-lg border bg-background p-4 w-[320px]">
        <h4 className="font-semibold mb-2">Delete Blog</h4>
        <p className="text-sm mb-4">
          Delete <b>{b.name}</b>?
        </p>

        <div className="flex justify-end gap-2">
          <Button size="sm" variant="outline" onClick={() => toast.dismiss(t)}>
            Cancel
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={async () => {
              toast.loading("Deleting...", { id: b.id })
              try {
                await deleteBlog(b.id).unwrap()
                toast.success("Deleted", { id: b.id })
              } catch {
                toast.error("Delete failed", { id: b.id })
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
      await reorderBlogs({ ids: blogs.map((b) => b.id) }).unwrap()
      setIsReordering(false)
      toast.success("Order updated")
    } catch {
      setBlogs(previousOrder.current)
      toast.error("Reorder failed")
    }
  }

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
        <h2 className="text-lg font-semibold">Blogs</h2>

        {!isReordering ? (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                previousOrder.current = [...blogs]
                setIsReordering(true)
              }}
            >
              <ArrowUpDown className="mr-1 size-4" />
              Reorder
            </Button>

            <Button
              onClick={() => {
                setSelectedBlog(null)
                setOpenForm(true)
              }}
            >
              <Plus className="mr-1 size-4" />
              Add Blog
            </Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="destructive"
              onClick={() => {
                setBlogs(previousOrder.current)
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
          <div className="flex-1 min-w-[220px] relative">
            <label className="text-xs text-muted-foreground mb-1 block">
              Search
            </label>
            <Search className="absolute left-3 top-9 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, title or author..."
              className="pl-9"
              onChange={(e) => debouncedSetSearch(e.target.value)}
            />
          </div>

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
        <BlogsReorderList blogs={blogs} onChange={setBlogs} />
      ) : (
        <>
          {isFetching && (
            <div className="space-y-2 py-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          )}

          <BlogsTable
            data={blogs}
            onView={(b) => {
              setSelectedBlog(b)
              setOpenView(true)
            }}
            onEdit={(b) => {
              setSelectedBlog(b)
              setOpenForm(true)
            }}
            onDelete={confirmDelete}
            onToggleFeatured={toggleFeatured}
            onToggleActive={toggleActive}
          />

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
              Page {page} of {totalPages} ({total} blogs)
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

      <BlogViewModal
        open={openView}
        onClose={() => setOpenView(false)}
        blog={selectedBlog}
      />

      <BlogFormModal
        open={openForm}
        blog={selectedBlog}
        onClose={() => setOpenForm(false)}
      />
    </div>
  )
}
