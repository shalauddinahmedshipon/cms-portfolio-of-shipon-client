"use client"

import { Eye, Edit, Trash2, Star, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"

export default function AchievementTable({ data, onView, onEdit, onDelete, onToggleFeatured, onToggleActive }: any) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Icon</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Featured</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((item: any) => (
            <TableRow key={item.id}>
              <TableCell>
                <img src={item.iconUrl || "/placeholder-icon.png"} className="h-8 w-8 object-contain" alt="" />
              </TableCell>
              <TableCell className="font-medium">{item.title}</TableCell>
              <TableCell className="text-xs uppercase">{item.category?.replace("_", " ")}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Switch checked={item.isActive} onCheckedChange={() => onToggleActive(item)} />
                </div>
              </TableCell>
              <TableCell>
                <Star onClick={() => onToggleFeatured(item)} className={`size-4 cursor-pointer ${item.isFeatured ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
              </TableCell>
              <TableCell className="text-right space-x-1">
                <Button size="icon" variant="ghost" onClick={() => onView(item)}><Eye size={16}/></Button>
                <Button size="icon" variant="ghost" onClick={() => onEdit(item)}><Edit size={16}/></Button>
                <Button size="icon" variant="ghost" onClick={() => onDelete(item)}><Trash2 size={16} className="text-destructive"/></Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}