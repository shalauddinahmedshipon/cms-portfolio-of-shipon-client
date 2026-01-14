"use client"

import { useEffect, useState } from "react"
import { useGetMeQuery } from "@/store/api/auth.api"
import { useAppDispatch } from "@/store/hooks"
import { setCredentials, logout } from "@/store/slices/auth.slice"

export default function AuthBootstrap() {
  const dispatch = useAppDispatch()
  const [isChecking, setIsChecking] = useState(true) // ← NEW: track initial check

  const { data, error, isLoading } = useGetMeQuery(undefined, {
    refetchOnMountOrArgChange: true,
  })

  useEffect(() => {
    if (isLoading) return // wait for query

    if (data) {
      dispatch(setCredentials({ user: data }))
    }

    if (error && "status" in error && error.status === 401) {
      dispatch(logout())
    }

    // Once query settles (success or error) → done checking
    setIsChecking(false)
  }, [data, error, isLoading, dispatch])

  // Return null during initial check (prevents flash of wrong UI)
  if (isChecking || isLoading) {
    return null // or a small spinner if you want
  }

  return null
}