"use client"

import {
  Star,
  Eye,
  Edit,
  Trash2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"   // ← make sure this is imported
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
  onView?: (project: any) => void
  onEdit?: (project: any) => void
  onDelete?: (project: any) => void
  onToggleFavorite?: (project: any) => void
  onToggleActive?: (project: any) => void
}

export default function ProjectsTable({
  data = [],
  onView,
  onEdit,
  onDelete,
  onToggleFavorite,
  onToggleActive,
}: Props) {

  if (!data?.length) {
    return (
      <div className="rounded-md border p-8 text-center text-muted-foreground">
        No projects found
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
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Favorite</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((p: any) => (
            <TableRow key={p.id}>
              <TableCell>
                {p.images?.[0] ? (
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    className="h-10 w-16 rounded object-cover"
                  />
                ) : (
                  <div className="h-10 w-16 rounded bg-muted flex items-center justify-center text-xs">
                    No img
                  </div>
                )}
              </TableCell>

              <TableCell className="font-medium">{p.name}</TableCell>
              <TableCell>{p.category}</TableCell>

              <TableCell>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={p.isActive}
                    onCheckedChange={() => onToggleActive?.(p)}
                    className="data-[state=checked]:bg-green-600"
                  />
                  <span className="text-sm font-medium min-w-[70px]">
                    {p.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </TableCell>

              <TableCell>
                <button
                  onClick={() => onToggleFavorite?.(p)}
                  className="hover:opacity-80 cursor-pointer"
                >
                  <Star
                    className={`size-4 ${
                      p.isFavorite
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    }`}
                  />
                </button>
              </TableCell>

              <TableCell className="text-right space-x-1">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => onView?.(p)}
                >
                  <Eye />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => onEdit?.(p)}
                >
                  <Edit />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => onDelete?.(p)}
                >
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