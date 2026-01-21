"use client"

import { useEffect, useState } from "react"
import { Plus, Trash2, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { motion } from "framer-motion"

import {
  useGetUsersQuery,
  useCreateUserMutation,
  useDeleteUserMutation,
  useToggleUserActiveMutation,
} from "@/store/api/user.api"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import type { User, CreateUserPayload } from "@/types/auth.types"

const EMPTY_USER: CreateUserPayload = {
  fullName: "",
  email: "",
  password: "",
}

export default function UsersPage() {
  const { data, isLoading } = useGetUsersQuery()
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation()
  const [deleteUser] = useDeleteUserMutation()
  const [toggleActive] = useToggleUserActiveMutation()

  const [users, setUsers] = useState<User[]>([])
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState<CreateUserPayload>(EMPTY_USER)

  useEffect(() => {
    if (data?.data) {
      setUsers(data.data)
    }
  }, [data])

  const save = async () => {
    if (!active.fullName || !active.email || !active.password) {
      toast.error("All fields are required")
      return
    }

    try {
      const res = await createUser(active).unwrap()
      setUsers((prev) => [res.data, ...prev])
      toast.success("User created successfully")
      setOpen(false)
      setActive(EMPTY_USER)
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create user")
    }
  }

  const remove = async (id: string) => {
    try {
      await deleteUser(id).unwrap()
      setUsers((prev) => prev.filter((u) => u.id !== id))
      toast.success("User deleted")
    } catch {
      toast.error("Delete failed")
    }
  }

  const toggleStatus = async (user: User) => {
    try {
      const res = await toggleActive(user.id).unwrap()
      setUsers((prev) =>
        prev.map((u) => (u.id === res.data.id ? res.data : u))
      )
      toast.success(
        `User ${res.data.isActive ? "activated" : "blocked"}`
      )
    } catch {
      toast.error("Failed to update status")
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-full rounded-md" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Users</h2>
        <Button size="sm" onClick={() => setOpen(true)}>
          <Plus className="size-4 mr-1" />
          Add User
        </Button>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-center">Active</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  {user.fullName}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <span className="text-xs px-2 py-1 rounded bg-muted">
                    {user.role}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <Switch
                    checked={user.isActive}
                    onCheckedChange={() => toggleStatus(user)}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <Trash2
                    className="inline-block cursor-pointer text-muted-foreground hover:text-red-500"
                    onClick={() => remove(user.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Add User Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Content Manager</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <Input
              placeholder="Full Name"
              value={active.fullName}
              onChange={(e) =>
                setActive({ ...active, fullName: e.target.value })
              }
            />
            <Input
              placeholder="Email"
              type="email"
              value={active.email}
              onChange={(e) =>
                setActive({ ...active, email: e.target.value })
              }
            />
            <Input
              placeholder="Password"
              type="password"
              value={active.password}
              onChange={(e) =>
                setActive({ ...active, password: e.target.value })
              }
            />

            <Button onClick={save} className="w-full" disabled={isCreating}>
              {isCreating ? (
                <motion.div
                  className="flex items-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Loader2 className="size-4 animate-spin" />
                  Saving...
                </motion.div>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
