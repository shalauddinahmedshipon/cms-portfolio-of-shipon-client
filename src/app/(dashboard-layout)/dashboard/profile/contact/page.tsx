"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { motion } from "framer-motion"

import {
  useGetProfileQuery,
  useUpdateContactInfoMutation,
} from "@/store/api/profile.api"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

import { contactInfoSchema } from "@/lib/validations/profile.schema"

type FormValues = z.infer<typeof contactInfoSchema>

export default function ContactInfoPage() {
  /* -------------------------------- API -------------------------------- */
  const { data: profile, isLoading } = useGetProfileQuery()
  const [updateContactInfo] = useUpdateContactInfoMutation()

  /* -------------------------------- FORM ------------------------------- */
  const form = useForm<FormValues>({
    resolver: zodResolver(contactInfoSchema),
    defaultValues: {
      email: "",
      github: "",
      linkedin: "",
      facebook: "",
      twitter: "",
      whatsapp: "",
    },
  })

  /* ---------------------------- LOCAL STATE ---------------------------- */
  const [progress, setProgress] = useState(0)

  /* ----------------------- SYNC API → FORM ----------------------------- */
  useEffect(() => {
    if (!profile?.contactInfo) return

    form.reset({
      email: profile.contactInfo.email ?? "",
      github: profile.contactInfo.github ?? "",
      linkedin: profile.contactInfo.linkedin ?? "",
      facebook: profile.contactInfo.facebook ?? "",
      twitter: profile.contactInfo.twitter ?? "",
      whatsapp: profile.contactInfo.whatsapp ?? "",
    })
  }, [profile, form])

  /* ----------------------- DIRTY STATE WARNING -------------------------- */
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (form.formState.isDirty) {
        e.preventDefault()
        e.returnValue = ""
      }
    }

    window.addEventListener("beforeunload", handler)
    return () => window.removeEventListener("beforeunload", handler)
  }, [form.formState.isDirty])

  /* ------------------------------- SUBMIT ------------------------------ */
  const onSubmit = async (values: FormValues) => {
    try {
      // fake progress (UX polish)
      setProgress(10)
      const interval = setInterval(() => {
        setProgress((p) => (p < 90 ? p + 10 : p))
      }, 250)

      await updateContactInfo(values).unwrap()

      clearInterval(interval)
      setProgress(100)

      setTimeout(() => setProgress(0), 600)

      form.reset(values)
      toast.success("Contact info updated successfully")
    } catch (err: any) {
      setProgress(0)
      toast.error(err?.data?.message || "Failed to update contact info")
    }
  }

  /* ------------------------------ LOADING ------------------------------ */
  if (isLoading || !profile) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    )
  }

  /* -------------------------------- UI -------------------------------- */
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { name: "email", label: "Email" },
            { name: "whatsapp", label: "WhatsApp" },
            { name: "github", label: "GitHub URL" },
            { name: "linkedin", label: "LinkedIn URL" },
            { name: "facebook", label: "Facebook URL" },
            { name: "twitter", label: "Twitter / X URL" },
          ].map(({ name, label }) => (
            <FormField
              key={name}
              control={form.control}
              name={name as keyof FormValues}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{label}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      placeholder={label}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>

        {/* ================= Footer ================= */}
        <div className="flex justify-end items-center">
          {progress > 0 ? (
            <motion.div
              className="w-full"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Progress value={progress} />
            </motion.div>
          ) : (
            <>
              {form.formState.isDirty && (
                <span className="mr-auto text-sm text-yellow-600">
                  You have unsaved changes
                </span>
              )}

              <Button type="submit">
                Save Changes
              </Button>
            </>
          )}
        </div>
      </form>
    </Form>
  )
}
