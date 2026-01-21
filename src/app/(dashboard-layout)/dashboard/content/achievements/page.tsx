"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowUpDown, Plus, Save, X } from "lucide-react"
import { toast } from "sonner"

import {
  useGetAchievementsQuery,
  useReorderAchievementsMutation,
  useUpdateAchievementMutation,
  useDeleteAchievementMutation,
} from "@/store/api/achievement.api"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import AchievementReorderList from "@/components/modules/achievement/achievement-reorder-list"
import AchievementTable from "@/components/modules/achievement/achievement-table"
import AchievementViewModal from "@/components/modules/achievement/achievement-view-modal"
import AchievementFormModal from "@/components/modules/achievement/achievement-form-modal"


export default function AdminAchievementsPage() {
  const [isReordering, setIsReordering] = useState(false)
  const [openForm, setOpenForm] = useState(false)
  const [openView, setOpenView] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [items, setItems] = useState<any[]>([])
  const previousOrder = useRef<any[]>([])

  const { data, isLoading, isFetching } = useGetAchievementsQuery({})
  const [reorderItems] = useReorderAchievementsMutation()
  const [updateItem] = useUpdateAchievementMutation()
  const [deleteItem] = useDeleteAchievementMutation()

  useEffect(() => {
    if (data?.data) setItems(data.data)
  }, [data])

  if (isLoading && !isFetching) {
    return <div className="space-y-5 p-6"><Skeleton className="h-64 w-full" /></div>
  }

// Update these functions in AdminAchievementsPage.tsx
  const toggleFeatured = async (item: any) => {
    try {
      const fd = new FormData()
      // Toggle the value
      const newValue = !item.isFeatured
      fd.append("isFeatured", String(newValue))
      
      await updateItem({ id: item.id, data: fd }).unwrap()
      toast.success(`Achievement ${newValue ? 'featured' : 'unfeatured'}`)
    } catch (err) { 
      toast.error("Failed to update featured status") 
    }
  }

  const toggleActive = async (item: any) => {
    try {
      const fd = new FormData()
      // Toggle the value
      const newValue = !item.isActive
      fd.append("isActive", String(newValue))
      
      await updateItem({ id: item.id, data: fd }).unwrap()
      toast.success(`Achievement is now ${newValue ? 'active' : 'inactive'}`)
    } catch (err) { 
      toast.error("Failed to update active status") 
    }
  }

  const confirmDelete = (item: any) => {
    toast.custom((t) => (
      <div className="rounded-lg border bg-background p-4 w-[320px]">
        <p className="text-sm mb-4">Delete achievement <b>{item.title}</b>?</p>
        <div className="flex justify-end gap-2">
          <Button size="sm" variant="outline" onClick={() => toast.dismiss(t)}>Cancel</Button>
          <Button size="sm" variant="destructive" onClick={async () => {
            try {
              await deleteItem(item.id).unwrap()
              toast.success("Deleted")
            } catch { toast.error("Failed") }
            finally { toast.dismiss(t) }
          }}>Delete</Button>
        </div>
      </div>
    ))
  }

  const saveOrder = async () => {
    try {
      await reorderItems({ ids: items.map((i) => i.id) }).unwrap()
      setIsReordering(false)
      toast.success("Order saved")
    } catch {
      setItems(previousOrder.current)
      toast.error("Failed to save order")
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Achievements</h2>
        <div className="flex gap-2">
          {!isReordering ? (
            <>
              <Button variant="outline" onClick={() => {
                previousOrder.current = [...items]
                setIsReordering(true)
              }}>
                <ArrowUpDown className="mr-1 size-4" /> Reorder
              </Button>
              <Button onClick={() => { setSelectedItem(null); setOpenForm(true); }}>
                <Plus className="mr-1 size-4" /> Add Achievement
              </Button>
            </>
          ) : (
            <>
              <Button variant="destructive" onClick={() => { setItems(previousOrder.current); setIsReordering(false); }}>
                <X className="mr-1 size-4" /> Cancel
              </Button>
              <Button onClick={saveOrder}>
                <Save className="mr-1 size-4" /> Save
              </Button>
            </>
          )}
        </div>
      </div>

      {isReordering ? (
        <AchievementReorderList items={items} onChange={setItems} />
      ) : (
        <AchievementTable 
          data={items} 
          onView={(i:any) => { setSelectedItem(i); setOpenView(true); }}
          onEdit={(i:any) => { setSelectedItem(i); setOpenForm(true); }}
          onDelete={confirmDelete}
          onToggleFeatured={toggleFeatured}
          onToggleActive={toggleActive}
        />
      )}

      <AchievementViewModal open={openView} onClose={() => setOpenView(false)} item={selectedItem} />
      <AchievementFormModal open={openForm} onClose={() => setOpenForm(false)} item={selectedItem} />
    </div>
  )
}