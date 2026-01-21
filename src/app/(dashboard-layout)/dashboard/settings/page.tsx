"use client"
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import { useUpdateAccountMutation } from "@/store/api/user.api"
import { useAppSelector, useAppDispatch } from "@/store/hooks"
import { setUser } from "@/store/slices/auth.slice"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export default function SettingsPage() {
  const user = useAppSelector((state) => state.auth.user)
  const dispatch = useAppDispatch()

  const [updateAccount, { isLoading }] = useUpdateAccountMutation()

  const [fullName, setFullName] = useState("")
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // 🔹 Sync fullName with current user
  useEffect(() => {
    if (user?.fullName) {
      setFullName(user.fullName)
    }
  }, [user])

 const submit = async () => {
  if (!fullName && !newPassword) {
    toast.error("Nothing to update");
    return;
  }

  if (newPassword && newPassword !== confirmPassword) {
    toast.error("Passwords do not match");
    return;
  }

  try {
    // Call API
    await updateAccount({
      fullName: fullName !== user?.fullName ? fullName : undefined,
      oldPassword: newPassword ? oldPassword : undefined,
      newPassword: newPassword || undefined,
      confirmPassword: confirmPassword || undefined,
    }).unwrap();

    // Update Redux store (so the table shows the updated name immediately)
    if (fullName !== user?.fullName) {
      dispatch(setUser({ fullName }));
    }

    toast.success("Account updated successfully");

    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  } catch (err: any) {
    toast.error(err?.data?.message || "Update failed");
  }
};


  return (
    <div className="max-w-xl space-y-6">
      {/* PROFILE */}
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label>Full Name</Label>
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* SECURITY */}
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label>Current Password</Label>
            <Input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <Label>New Password</Label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <Label>Confirm New Password</Label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Button onClick={submit} disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Saving...
          </>
        ) : (
          "Save Changes"
        )}
      </Button>
    </div>
  )
}
