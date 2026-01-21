"use client"

import { useEffect, useMemo, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Upload, X } from "lucide-react"
import { toast } from "sonner"
import { useCreateAchievementMutation, useUpdateAchievementMutation, useGetAchievementsQuery } from "@/store/api/achievement.api"

export default function AchievementFormModal({ open, onClose, item }: any) {
  const [form, setForm] = useState<any>({ title: "", category: "", achievedAt: "", proofUrl: "", description: "" })
  const [iconFile, setIconFile] = useState<File | null>(null)
  const [existingIcon, setExistingIcon] = useState<string | null>(null)

  // Fetch all achievements to suggest existing categories
  const { data: achievementsData } = useGetAchievementsQuery({})
  const [createAchievement, { isLoading: creating }] = useCreateAchievementMutation()
  const [updateAchievement, { isLoading: updating }] = useUpdateAchievementMutation()
  
  const isSaving = creating || updating

  // Memoize unique categories for suggestions
  const suggestedCategories = useMemo(() => {
    if (!achievementsData?.data) return []
    const categories = achievementsData.data.map((a: any) => a.category).filter(Boolean)
    return Array.from(new Set(categories))
  }, [achievementsData])

  useEffect(() => {
    if (item && open) {
      setForm({
        title: item.title,
        category: item.category || "",
        achievedAt: item.achievedAt ? item.achievedAt.split("T")[0] : "",
        proofUrl: item.proofUrl || "",
        description: item.description || ""
      })
      setExistingIcon(item.iconUrl)
    } else {
      setForm({ title: "", category: "", achievedAt: "", proofUrl: "", description: "" })
      setExistingIcon(null)
    }
    setIconFile(null)
  }, [item, open])

  const handleSubmit = async () => {
    if (!form.title) return toast.error("Title is required")
    
    const fd = new FormData()
    // Append all form fields
    Object.keys(form).forEach(key => {
      if (form[key] !== undefined && form[key] !== null) {
        fd.append(key, form[key])
      }
    })
    
    if (iconFile) fd.append("icon", iconFile)

    try {
      if (item?.id) {
        await updateAchievement({ id: item.id, data: fd }).unwrap()
      } else {
        await createAchievement(fd).unwrap()
      }
      toast.success("Achievement saved successfully")
      onClose()
    } catch (err: any) {
      toast.error(err?.data?.message || "Error saving achievement")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{item ? "Edit" : "Add"} Achievement</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. Google Kickstart Round A" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Input 
                list="category-suggestions"
                value={form.category} 
                onChange={e => setForm({...form, category: e.target.value.toUpperCase()})} 
                placeholder="Type or select category"
              />
              <datalist id="category-suggestions">
                {suggestedCategories.map((cat: any) => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
            </div>
            <div className="space-y-2">
              <Label>Achieved Date</Label>
              <Input type="date" value={form.achievedAt} onChange={e => setForm({...form, achievedAt: e.target.value})} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Proof URL (Optional)</Label>
            <Input value={form.proofUrl} onChange={e => setForm({...form, proofUrl: e.target.value})} placeholder="https://..." />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
          </div>

          <div className="space-y-2">
            <Label>Icon</Label>
            {(existingIcon || iconFile) && (
              <div className="relative w-16 h-16 border rounded mb-2">
                <img src={iconFile ? URL.createObjectURL(iconFile) : existingIcon!} className="w-full h-full object-contain" alt="preview" />
                <button onClick={() => {setExistingIcon(null); setIconFile(null)}} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition">
                  <X size={12}/>
                </button>
              </div>
            )}
            <Label className="flex items-center justify-center border-2 border-dashed p-4 cursor-pointer hover:bg-muted transition-colors">
              <Upload className="mr-2 size-4 text-muted-foreground" /> 
              <span className="text-sm text-muted-foreground">Upload Icon</span>
              <input type="file" hidden accept="image/*" onChange={e => setIconFile(e.target.files?.[0] || null)} />
            </Label>
          </div>

          <Button className="w-full" onClick={handleSubmit} disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 animate-spin" /> : null}
            {item ? "Update Achievement" : "Create Achievement"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}