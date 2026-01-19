export type Skill = {
  id: string
  name: string
  icon: string
  order: number
  categoryId: string
}

export type SkillCategory = {
  id: string
  name: string
  order: number
  skills: Skill[]
}
