"use client"

import { Eye, Edit, Trash2, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"

type Props = {
  data: any[]
  onView?: (event: any) => void
  onEdit?: (event: any) => void
  onDelete?: (event: any) => void
  onToggleActive?: (event: any) => void
  onToggleFavorite?: (event: any) => void
}

export default function EventsTable({
  data = [],
  onView,
  onEdit,
  onDelete,
  onToggleActive,
  onToggleFavorite,
}: Props) {
  if (!data?.length) {
    return (
      <div className="rounded-md border p-8 text-center text-muted-foreground">
        No events found
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Event Type</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Favorite</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((e) => (
            <TableRow key={e.id}>
              <TableCell>
                {e.images?.[0] ? (
                  <img
                    src={e.images[0]}
                    alt={e.name}
                    className="h-10 w-16 rounded object-cover"
                  />
                ) : (
                  <div className="h-10 w-16 rounded bg-muted flex items-center justify-center text-xs">
                    No img
                  </div>
                )}
              </TableCell>
              <TableCell className="font-medium">{e.name}</TableCell>
              <TableCell>{e.eventType || "—"}</TableCell>
              <TableCell>{e.location || "—"}</TableCell>
              <TableCell>
                {e.eventDate ? new Date(e.eventDate).toLocaleDateString() : "—"}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={e.isActive}
                    onCheckedChange={() => onToggleActive?.(e)}
                    className="data-[state=checked]:bg-green-600"
                  />
                  <span className="text-sm font-medium min-w-[70px]">
                    {e.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <button
                  onClick={() => onToggleFavorite?.(e)}
                  className="hover:opacity-80 cursor-pointer"
                >
                  <Star
                    className={`size-4 ${
                      e.isFavorite
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    }`}
                  />
                </button>
              </TableCell>
              <TableCell className="text-right space-x-1">
                <Button size="icon" variant="ghost" onClick={() => onView?.(e)}>
                  <Eye />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => onEdit?.(e)}>
                  <Edit />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => onDelete?.(e)}>
                  <Trash2 className="text-destructive" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
