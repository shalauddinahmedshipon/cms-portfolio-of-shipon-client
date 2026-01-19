"use client"

import { useEffect, useRef, useState } from "react"
import { Reorder, motion } from "framer-motion"
import {
  Plus,
  Trash2,
  GripVertical,
  Edit2Icon,
  Loader2,
} from "lucide-react"
import { toast } from "sonner"

import {
  useGetSkillCategoriesQuery,
  useCreateSkillCategoryMutation,
  useUpdateSkillCategoryMutation,
  useDeleteSkillCategoryMutation,
  useCreateSkillMutation,
  useUpdateSkillMutation,
  useDeleteSkillMutation,
  useReorderSkillsMutation,
  useReorderCategoriesMutation,
} from "@/store/api/skill.api"

import type { SkillCategory, Skill } from "@/types/skill.types"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

/* ---------------------------------------------------------------- */

const EMPTY_CATEGORY: Partial<SkillCategory> = {
  name: "",
  skills: [],
}

/* ---------------------------------------------------------------- */

export default function SkillPage() {
  const { data, isLoading } = useGetSkillCategoriesQuery()

  const [createCategory, { isLoading: isCreatingCategory }] =
    useCreateSkillCategoryMutation()
  const [updateCategory, { isLoading: isUpdatingCategory }] =
    useUpdateSkillCategoryMutation()
  const [deleteCategory] = useDeleteSkillCategoryMutation()

  const [createSkill, { isLoading: isCreatingSkill }] =
    useCreateSkillMutation()
  const [updateSkill, { isLoading: isUpdatingSkill }] =
    useUpdateSkillMutation()
  const [deleteSkill] = useDeleteSkillMutation()

  const [reorderCategories] = useReorderCategoriesMutation()
  const [reorderSkills] = useReorderSkillsMutation()

  const isSavingCategory =
    isCreatingCategory || isUpdatingCategory
  const isSavingSkill =
    isCreatingSkill || isUpdatingSkill

  const [categories, setCategories] = useState<SkillCategory[]>([])
  const previousCategories = useRef<SkillCategory[]>([])

  /* ---------------- CATEGORY MODAL ---------------- */
  const [openCategory, setOpenCategory] = useState(false)
  const [activeCategory, setActiveCategory] =
    useState<Partial<SkillCategory> | null>(null)

  /* ---------------- SKILL MODAL ---------------- */
  const [openSkill, setOpenSkill] = useState(false)
  const [activeSkill, setActiveSkill] =
    useState<Partial<Skill> | null>(null)
  const [skillCategoryId, setSkillCategoryId] = useState("")
  const [skillFile, setSkillFile] = useState<File | null>(null)
  const [skillPreview, setSkillPreview] =
    useState<string | null>(null)

  /* ---------------- LOAD ---------------- */
  useEffect(() => {
    if (data) {
      setCategories(
        data.map((c) => ({
          ...c,
          skills: c.skills ?? [],
        })),
      )
    }
  }, [data])

  /* ---------------- CATEGORY REORDER ---------------- */
  const onReorderCategories = async (
    reordered: SkillCategory[],
  ) => {
    previousCategories.current = categories
    setCategories(reordered)

    try {
      await reorderCategories(
        reordered.map((c, index) => ({
          id: c.id,
          order: index,
        })),
      ).unwrap()
    } catch {
      setCategories(previousCategories.current)
      toast.error("Failed to reorder categories")
    }
  }

  /* ---------------- SKILL REORDER ---------------- */
  const onReorderSkills = async (
    categoryId: string,
    reordered: Skill[],
  ) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === categoryId
          ? { ...c, skills: reordered }
          : c,
      ),
    )

    try {
      await reorderSkills(
        reordered.map((s, index) => ({
          id: s.id,
          order: index,
        })),
      ).unwrap()
    } catch {
      toast.error("Failed to reorder skills")
    }
  }

  /* ---------------- CATEGORY SAVE ---------------- */
  const saveCategory = async () => {
    if (!activeCategory?.name) {
      toast.error("Category name required")
      return
    }

    try {
      let saved: SkillCategory

      if (activeCategory.id) {
        saved = await updateCategory({
          id: activeCategory.id,
          name: activeCategory.name,
        }).unwrap()

        setCategories((prev) =>
          prev.map((c) =>
            c.id === saved.id
              ? { ...saved, skills: c.skills ?? [] }
              : c,
          ),
        )
      } else {
        saved = await createCategory({
          name: activeCategory.name,
        }).unwrap()

        setCategories((prev) => [
          ...prev,
          { ...saved, skills: [] },
        ])
      }

      setOpenCategory(false)
      setActiveCategory(null)
      toast.success("Category saved")
    } catch {
      toast.error("Save failed")
    }
  }

  /* ---------------- CATEGORY DELETE ---------------- */
  const removeCategory = async (id: string) => {
    if (!confirm("Delete category and all skills?")) return
    try {
      await deleteCategory(id).unwrap()
      setCategories((prev) =>
        prev.filter((c) => c.id !== id),
      )
      toast.success("Category deleted")
    } catch {
      toast.error("Delete failed")
    }
  }

  /* ---------------- SKILL HELPERS ---------------- */
  const getNextSkillOrder = (categoryId: string) => {
    const cat = categories.find((c) => c.id === categoryId)
    return cat?.skills?.length ?? 0
  }

  /* ---------------- SKILL MODAL ---------------- */
  const openSkillModal = (
    categoryId: string,
    skill?: Skill,
  ) => {
    setSkillCategoryId(categoryId)
    setActiveSkill(skill ?? { name: "" })
    setSkillPreview(skill?.icon ?? null)
    setSkillFile(null)
    setOpenSkill(true)
  }

  const saveSkill = async () => {
    if (!activeSkill?.name) {
      toast.error("Skill name required")
      return
    }

    const fd = new FormData()
    fd.append("name", activeSkill.name)
    fd.append("categoryId", skillCategoryId)
    fd.append(
      "order",
      String(
        activeSkill.order ??
          getNextSkillOrder(skillCategoryId),
      ),
    )

    if (skillFile) fd.append("icon", skillFile)

    try {
      if (activeSkill.id) {
        await updateSkill({
          id: activeSkill.id,
          data: fd,
        }).unwrap()
        toast.success("Skill updated")
      } else {
        await createSkill(fd).unwrap()
        toast.success("Skill created")
      }

      setOpenSkill(false)
      setActiveSkill(null)
    } catch {
      toast.error("Failed to save skill")
    }
  }

  const removeSkill = async (id: string) => {
    if (!confirm("Delete skill?")) return
    try {
      await deleteSkill(id).unwrap()
      toast.success("Skill deleted")
    } catch {
      toast.error("Delete failed")
    }
  }

  /* ---------------- LOADING ---------------- */
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <Skeleton key={i} className="h-28 rounded-lg" />
        ))}
      </div>
    )
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">
          Skills Management
        </h2>
        <Button
          size="sm"
          onClick={() => {
            setActiveCategory(EMPTY_CATEGORY)
            setOpenCategory(true)
          }}
        >
          <Plus className="size-4 mr-1" /> Add Category
        </Button>
      </div>

      <Reorder.Group
        axis="y"
        values={categories}
        onReorder={onReorderCategories}
        className="space-y-4"
      >
        {categories.map((category) => (
          <Reorder.Item key={category.id} value={category}>
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <GripVertical className="size-4 text-muted-foreground" />
                    <h3 className="font-medium">
                      {category.name}
                    </h3>
                  </div>

                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        openSkillModal(category.id)
                      }
                    >
                      <Plus />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setActiveCategory(category)
                        setOpenCategory(true)
                      }}
                    >
                      <Edit2Icon />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        removeCategory(category.id)
                      }
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </div>
                </div>

                <Reorder.Group
                  axis="y"
                  values={category.skills ?? []}
                  onReorder={(skills) =>
                    onReorderSkills(category.id, skills)
                  }
                  className="space-y-2 pl-6"
                >
                  {(category.skills ?? []).map((skill) => (
                    <Reorder.Item key={skill.id} value={skill}>
                      <div className="flex items-center gap-3 p-2 border rounded-md">
                        <GripVertical className="size-4 text-muted-foreground" />
                        {skill.icon && (
                          <img
                            src={skill.icon}
                            className="h-8 w-8 rounded border object-cover"
                          />
                        )}
                        <span className="flex-1 text-sm">
                          {skill.name}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            openSkillModal(
                              category.id,
                              skill,
                            )
                          }
                        >
                          <Edit2Icon className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            removeSkill(skill.id)
                          }
                        >
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </div>
                    </Reorder.Item>
                  ))}
                </Reorder.Group>
              </CardContent>
            </Card>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      {/* CATEGORY MODAL */}
      <Dialog open={openCategory} onOpenChange={setOpenCategory}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {activeCategory?.id ? "Edit" : "Add"} Category
            </DialogTitle>
          </DialogHeader>

          <Input
            value={activeCategory?.name ?? ""}
            onChange={(e) =>
              setActiveCategory({
                ...activeCategory!,
                name: e.target.value,
              })
            }
            placeholder="Category name"
          />

          <Button
            onClick={saveCategory}
            disabled={isSavingCategory}
          >
            {isSavingCategory ? (
              <motion.div className="flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" />
                Saving...
              </motion.div>
            ) : (
              "Save"
            )}
          </Button>
        </DialogContent>
      </Dialog>

      {/* SKILL MODAL */}
      <Dialog open={openSkill} onOpenChange={setOpenSkill}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {activeSkill?.id ? "Edit" : "Add"} Skill
            </DialogTitle>
          </DialogHeader>

          <Input
            value={activeSkill?.name ?? ""}
            onChange={(e) =>
              setActiveSkill({
                ...activeSkill!,
                name: e.target.value,
              })
            }
            placeholder="Skill name"
          />

          <Input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) {
                setSkillFile(file)
                setSkillPreview(URL.createObjectURL(file))
              }
            }}
          />

          {skillPreview && (
            <img
              src={skillPreview}
              className="h-16 w-16 rounded border"
            />
          )}

          <Button
            onClick={saveSkill}
            disabled={isSavingSkill}
          >
            {isSavingSkill ? (
              <motion.div className="flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" />
                Saving...
              </motion.div>
            ) : (
              "Save"
            )}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}
