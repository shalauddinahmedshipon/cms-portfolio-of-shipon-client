"use client"

import { useEffect, useState } from "react"
import { Plus, Search, RotateCcw } from "lucide-react"
import { toast } from "sonner"
import debounce from "lodash/debounce"

import {
  useGetEventsQuery,
  useUpdateEventMutation,
  useDeleteEventMutation,
} from "@/store/api/event.api"

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
import EventsTable from "@/components/modules/event/event-table"
import EventFormModal from "@/components/modules/event/event-form-modal"
import EventViewModal from "@/components/modules/event/event-view-modal"

export default function AdminEventsPage() {
  /* ---------------- STATE ---------------- */
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [eventType, setEventType] = useState("all")
  const [status, setStatus] = useState("all")
  const [favorite, setFavorite] = useState("all") // ✅ NEW

  const [openForm, setOpenForm] = useState(false)
  const [openView, setOpenView] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<any>(null)

  const [events, setEvents] = useState<any[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  /* ---------------- SEARCH (DEBOUNCE) ---------------- */
  const debouncedSetSearch = debounce((value: string) => {
    setSearch(value.trim())
    setPage(1)
  }, 400)

  /* ---------------- QUERY PARAMS ---------------- */
  const queryParams = {
    page,
    limit: 10,
    search: search || undefined,
    eventType: eventType === "all" ? undefined : eventType,
    isActive: status === "all" ? undefined : status === "active",
    isFavorite: favorite === "all" ? undefined : favorite === "favorite", // ✅ NEW
  }

  const { data, isLoading, isFetching } = useGetEventsQuery(queryParams)
  const [updateEvent] = useUpdateEventMutation()
  const [deleteEvent] = useDeleteEventMutation()

  /* ---------------- DATA SYNC ---------------- */
  useEffect(() => {
    if (data) {
      setEvents(data.data)
      setTotalPages(data.meta.totalPages)
      setTotal(data.meta.total)
    }
  }, [data])

  /* ---------------- RESET PAGE ON FILTER CHANGE ---------------- */
  useEffect(() => {
    setPage(1)
  }, [search, eventType, status, favorite]) // ✅ include favorite

  /* ---------------- PAGE LOADING SKELETON ---------------- */
  if (isLoading && !isFetching) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-8 w-48" />
        <div className="flex flex-wrap gap-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-36" />
          <Skeleton className="h-10 w-36" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  /* ---------------- TOGGLES ---------------- */
  const toggleActive = async (e: any) => {
    try {
      const fd = new FormData()
      fd.append("isActive", String(!e.isActive))
      fd.append("isFavorite", String(e.isFavorite)) // preserve favorite
      await updateEvent({ id: e.id, data: fd }).unwrap()
      toast.success("Status updated")
    } catch {
      toast.error("Failed to update status")
    }
  }

  const toggleFavorite = async (e: any) => {
    try {
      const fd = new FormData()
      fd.append("isFavorite", String(!e.isFavorite))
      fd.append("isActive", String(e.isActive)) // preserve active
      await updateEvent({ id: e.id, data: fd }).unwrap()
      toast.success("Favorite updated")
    } catch {
      toast.error("Failed to update favorite")
    }
  }

  /* ---------------- DELETE ---------------- */
  const confirmDelete = (e: any) => {
    toast.custom((t) => (
      <div className="rounded-lg border bg-background p-4 w-[320px]">
        <h4 className="font-semibold mb-2">Delete Event</h4>
        <p className="text-sm mb-4">
          Delete <b>{e.name}</b>?
        </p>
        <div className="flex justify-end gap-2">
          <Button size="sm" variant="outline" onClick={() => toast.dismiss(t)}>
            Cancel
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={async () => {
              toast.loading("Deleting...", { id: e.id })
              try {
                await deleteEvent(e.id).unwrap()
                toast.success("Deleted", { id: e.id })
              } catch {
                toast.error("Delete failed", { id: e.id })
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

  /* ---------------- RESET FILTERS ---------------- */
  const resetFilters = () => {
    setSearch("")
    setEventType("all")
    setStatus("all")
    setFavorite("all") // ✅ reset favorite
    setPage(1)
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="space-y-5">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Events</h2>
        <Button
          onClick={() => {
            setSelectedEvent(null)
            setOpenForm(true)
          }}
        >
          <Plus className="mr-1 size-4" />
          Add Event
        </Button>
      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[220px] relative">
          <label className="text-xs text-muted-foreground mb-1 block">Search</label>
          <Search className="absolute left-3 top-9 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or location..."
            className="pl-9"
            onChange={(e) => debouncedSetSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground">Event Type</label>
          <Select value={eventType} onValueChange={setEventType}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="CONFERENCE">Conference</SelectItem>
              <SelectItem value="WORKSHOP">Workshop</SelectItem>
              <SelectItem value="MEETUP">Meetup</SelectItem>
              <SelectItem value="WEBINAR">Webinar</SelectItem>
              <SelectItem value="CONTEST">Contest</SelectItem>
              <SelectItem value="HACKATHON">Hackathon</SelectItem>
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

        <Button variant="ghost" size="icon" onClick={resetFilters} title="Reset filters">
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      {/* CONTENT */}
      {isFetching ? (
        <div className="space-y-2 py-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      ) : (
        <EventsTable
          data={events}
          onView={(e) => {
            setSelectedEvent(e)
            setOpenView(true)
          }}
          onEdit={(e) => {
            setSelectedEvent(e)
            setOpenForm(true)
          }}
          onDelete={confirmDelete}
          onToggleActive={toggleActive}
          onToggleFavorite={toggleFavorite} // ✅ NEW
        />
      )}

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
          Page {page} of {totalPages} ({total} events)
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

      {/* MODALS */}
      <EventViewModal
        open={openView}
        onClose={() => setOpenView(false)}
        event={selectedEvent}
      />

      <EventFormModal
        open={openForm}
        event={selectedEvent}
        onClose={() => setOpenForm(false)}
      />
    </div>
  )
}
