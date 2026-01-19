import { useState } from "react"
import { toast } from "sonner"

export function useAsyncModalForm<T>({
  onCreate,
  onUpdate,
  initialData,
}: {
  onCreate: (data: T) => Promise<any>
  onUpdate: (data: T & { id: string }) => Promise<any>
  initialData: T
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [active, setActive] = useState<T | null>(null)

  const openCreate = () => {
    setActive(initialData)
    setOpen(true)
  }

  const openEdit = (data: T) => {
    setActive(data)
    setOpen(true)
  }

  const close = () => {
    setOpen(false)
    setActive(null)
  }

  const submit = async () => {
    if (!active) return

    try {
      setLoading(true)

      if ((active as any).id) {
        await onUpdate(active as T & { id: string })
      } else {
        await onCreate(active)
      }

      toast.success("Saved successfully")
      close()
    } catch (err: any) {
      toast.error(err?.data?.message?.[0] || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return {
    open,
    loading,
    active,
    setActive,
    openCreate,
    openEdit,
    close,
    submit,
  }
}
