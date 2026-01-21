"use client"

import { Reorder, useDragControls } from "framer-motion"
import { GripVertical } from "lucide-react"

export default function AchievementReorderList({ items, onChange }: any) {
  return (
    <Reorder.Group as="ul" axis="y" values={items} onReorder={onChange} className="divide-y rounded-md border bg-background">
      {items.map((item: any, index: number) => (
        <ReorderItem key={item.id} item={item} index={index} />
      ))}
    </Reorder.Group>
  )
}

function ReorderItem({ item, index }: any) {
  const controls = useDragControls()
  return (
    <Reorder.Item value={item} dragListener={false} dragControls={controls} className="flex items-center gap-4 px-4 py-3 bg-background">
      <button onPointerDown={(e) => controls.start(e)} className="cursor-grab text-muted-foreground"><GripVertical size={18} /></button>
      <div className="w-4 text-xs text-muted-foreground">{index + 1}</div>
      <img src={item.iconUrl} className="h-8 w-8 object-contain" alt="" />
      <div className="flex-1 font-medium">{item.title}</div>
    </Reorder.Item>
  )
}