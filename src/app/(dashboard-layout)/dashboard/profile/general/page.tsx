"use client"

import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Image from "next/image"
import { toast } from "sonner"
import { User, ImageIcon, Camera, VideoIcon, Play } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "@/store/api/profile.api"

import { profileSchema } from "@/lib/validations/profile.schema"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

type FormValues = z.infer<typeof profileSchema>

const DEFAULT_VALUES: FormValues = {
  name: "",
  designation: "",
  headline: "",
  bio: "",
  location: "",
  resumeUrl: "",
}

export default function GeneralProfilePage() {
  const { data: profile, isLoading } = useGetProfileQuery(undefined, {
    refetchOnMountOrArgChange: true,
  })

  const [updateProfile] = useUpdateProfileMutation()

  const form = useForm<FormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: DEFAULT_VALUES,
    shouldUnregister: false,
  })

  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [bannerFile, setBannerFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)

  // Determine if current banner is video (from backend or preview)
  const isVideoBanner = useMemo(() => {
    if (bannerFile) {
      return bannerFile.type.startsWith("video/")
    }
    return profile?.bannerType === "VIDEO"
  }, [bannerFile, profile?.bannerType])

  const bannerPreviewUrl = useMemo(() => {
    if (bannerFile) return URL.createObjectURL(bannerFile)
    return profile?.bannerUrl ?? null
  }, [bannerFile, profile?.bannerUrl])

  useEffect(() => {
    if (!profile) return

    form.reset({
      name: profile.name ?? "",
      designation: profile.designation ?? "",
      headline: profile.headline ?? "",
      bio: profile.bio ?? "",
      location: profile.location ?? "",
      resumeUrl: profile.resumeUrl ?? "",
    })
  }, [profile, form])

  // Warn on unsaved changes
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (form.formState.isDirty || avatarFile || bannerFile) {
        e.preventDefault()
        e.returnValue = ""
      }
    }
    window.addEventListener("beforeunload", handler)
    return () => window.removeEventListener("beforeunload", handler)
  }, [form.formState.isDirty, avatarFile, bannerFile])

  const optimisticProfile = useMemo(() => {
    if (!profile) return null
    return {
      ...profile,
      avatarUrl: avatarFile ? URL.createObjectURL(avatarFile) : profile.avatarUrl,
      bannerUrl: bannerPreviewUrl,
      bannerType: isVideoBanner ? "VIDEO" : "IMAGE",
    }
  }, [profile, avatarFile, bannerPreviewUrl, isVideoBanner])

  const onSubmit = async (values: FormValues) => {
    const formData = new FormData()

    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value ?? "")
    })

    if (avatarFile) formData.append("avatar", avatarFile)
    if (bannerFile) formData.append("banner", bannerFile)

    try {
      setUploadProgress(10)
      const interval = setInterval(() => {
        setUploadProgress((p) => (p < 90 ? p + 10 : p))
      }, 300)

      await updateProfile(formData).unwrap()

      clearInterval(interval)
      setUploadProgress(100)
      setTimeout(() => setUploadProgress(0), 800)

      setAvatarFile(null)
      setBannerFile(null)
      form.reset(values)

      toast.success("Profile updated successfully")
    } catch (err: any) {
      setUploadProgress(0)
      toast.error(err?.data?.message || "Failed to update profile")
    }
  }

  if (isLoading || !profile) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-48 w-full rounded-xl" />
        <div className="flex gap-4">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-5 w-1/3" />
          </div>
        </div>
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
        {/* Banner + Avatar Section */}
        <div className="relative">
          <div
            className={cn(
              "relative h-48 md:h-64 w-full rounded-xl overflow-hidden bg-muted flex items-center justify-center",
              isVideoBanner && "bg-black",
            )}
          >
            {bannerPreviewUrl ? (
              isVideoBanner ? (
                <video
                  src={bannerPreviewUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <Image
                  src={bannerPreviewUrl}
                  alt="Banner"
                  fill
                  className="object-cover"
                  unoptimized={bannerPreviewUrl.includes("cloudinary")} // optional optimization
                />
              )
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <ImageIcon size={40} />
                <span className="text-sm">No banner set</span>
              </div>
            )}

            {/* Upload button */}
            <label className="absolute top-4 right-4 cursor-pointer rounded-full bg-background/80 backdrop-blur-sm p-3 shadow-lg hover:bg-background transition-colors">
              <div className="flex items-center gap-1.5 text-sm font-medium">
                {isVideoBanner ? <VideoIcon size={16} /> : <Camera size={16} />}
              </div>
              <input
                type="file"
                hidden
                accept="image/*,video/mp4,video/webm,video/ogg"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (!file) return

                  if (file.type.startsWith("video/") && file.size > 30 * 1024 * 1024) {
                    toast.error("Video file is too large (max 30MB recommended)")
                    return
                  }

                  setBannerFile(file)
                }}
              />
            </label>

            {isVideoBanner && (
              <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                <Play size={12} /> Video Banner
              </div>
            )}
          </div>

          {/* Avatar */}
          <div className="absolute -bottom-10 left-6">
            <div className="relative size-24 rounded-full border-4 border-background overflow-hidden bg-muted flex items-center justify-center shadow-lg">
              {optimisticProfile?.avatarUrl ? (
                <Image
                  src={optimisticProfile.avatarUrl}
                  alt="Avatar"
                  fill
                  className="object-cover"
                />
              ) : (
                <User className="size-10 text-muted-foreground" />
              )}

              <label className="absolute bottom-1 right-1 cursor-pointer rounded-full bg-background p-1.5 shadow">
                <Camera className="size-4" />
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => setAvatarFile(e.target.files?.[0] ?? null)}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="pt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          {(["name", "designation", "headline", "location", "resumeUrl"] as const).map(
            (fieldName) => (
              <FormField
                key={fieldName}
                control={form.control}
                name={fieldName}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="capitalize">{fieldName}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ),
          )}

          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea rows={5} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Submit + Progress */}
        <div className="space-y-4">
          <AnimatePresence>
            {uploadProgress > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                <Progress value={uploadProgress} />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-between items-center">
            {(form.formState.isDirty || avatarFile || bannerFile) && (
              <span className="text-sm text-yellow-600 dark:text-yellow-500">
                You have unsaved changes
              </span>
            )}

            <Button type="submit" disabled={uploadProgress > 0}>
              Save Changes
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}