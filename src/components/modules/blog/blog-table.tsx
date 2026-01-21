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
  onView?: (blog: any) => void
  onEdit?: (blog: any) => void
  onDelete?: (blog: any) => void
  onToggleFeatured?: (blog: any) => void
  onToggleActive?: (blog: any) => void
}

export default function BlogsTable({
  data = [],
  onView,
  onEdit,
  onDelete,
  onToggleFeatured,
  onToggleActive,
}: Props) {
  if (!data?.length) {
    return (
      <div className="rounded-md border p-8 text-center text-muted-foreground">
        No blogs found
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cover</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Featured</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((b: any) => (
            <TableRow key={b.id}>
              {/* COVER */}
              <TableCell>
                {b.coverImage ? (
                  <img
                    src={b.coverImage}
                    alt={b.title}
                    className="h-10 w-16 rounded object-cover"
                  />
                ) : (
                  <div className="h-10 w-16 rounded bg-muted flex items-center justify-center text-xs">
                    No img
                  </div>
                )}
              </TableCell>

              <TableCell className="font-medium">{b.title}</TableCell>
              <TableCell>{b.category || "—"}</TableCell>
              <TableCell>{b.tags?.length ? b.tags.join(", ") : "—"}</TableCell>

              {/* ACTIVE */}
              <TableCell>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={b.isActive}
                    onCheckedChange={() => onToggleActive?.(b)}
                    className="data-[state=checked]:bg-green-600"
                  />
                  <span className="text-sm font-medium min-w-[70px]">
                    {b.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </TableCell>

              {/* FEATURED */}
              <TableCell>
                <button
                  onClick={() => onToggleFeatured?.(b)}
                  className="hover:opacity-80 cursor-pointer"
                >
                  <Star
                    className={`size-4 ${
                      b.isFeatured
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    }`}
                  />
                </button>
              </TableCell>

              {/* ACTIONS */}
              <TableCell className="text-right space-x-1">
                <Button size="icon" variant="ghost" onClick={() => onView?.(b)}>
                  <Eye />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => onEdit?.(b)}>
                  <Edit />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => onDelete?.(b)}>
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
