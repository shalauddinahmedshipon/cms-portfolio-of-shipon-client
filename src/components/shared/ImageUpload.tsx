"use client"

import { motion } from "framer-motion"
import { Upload, Image as ImageIcon } from "lucide-react"

export function ImageUpload({
  file,
  preview,
  onChange,
}: {
  file: File | null
  preview?: string
  onChange: (file: File | null) => void
}) {
  const src = file
    ? URL.createObjectURL(file)
    : preview

  return (
    <motion.label
      whileHover={{ scale: 1.02 }}
      className="flex items-center gap-4 p-4 border-2 border-dashed rounded-xl cursor-pointer hover:border-primary transition"
    >
      {src ? (
        <img
          src={src}
          className="size-14 rounded-lg object-cover border"
        />
      ) : (
        <div className="size-14 rounded-lg bg-muted flex items-center justify-center">
          <ImageIcon className="size-6 text-muted-foreground" />
        </div>
      )}

      <div className="flex-1 text-sm">
        <p className="font-medium">
          Upload image
        </p>
        <p className="text-muted-foreground">
          PNG, JPG up to 2MB
        </p>
      </div>

      <Upload className="size-5 text-muted-foreground" />

      <input
        type="file"
        accept="image/*"
        hidden
        onChange={(e) =>
          onChange(e.target.files?.[0] ?? null)
        }
      />
    </motion.label>
  )
}
