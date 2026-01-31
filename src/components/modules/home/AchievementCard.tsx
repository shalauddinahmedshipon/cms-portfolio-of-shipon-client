"use client";

import Image from "next/image";
import { formatMonthYear } from "@/lib/utils";
import { Calendar, Award } from "lucide-react";
import ProofPreview from "../achievement/ProofPreview";

interface Achievement {
  id: string;
  title: string;
  description?: string;
  category?: string;
  iconUrl?: string;
  proofUrl?: string;
  achievedAt?: string;
}

export default function AchievementCard({ achievement }: { achievement: Achievement }) {
  return (
    <div className="rounded-xl border bg-card hover:shadow-lg transition-all duration-300 overflow-hidden h-full flex flex-col">
      {/* Header Section */}
      <div className="p-5 border-b bg-gradient-to-br from-primary/5 to-transparent">
        <div className="flex gap-4 items-start">
          {/* Icon */}
          <div className="flex-shrink-0">
            {achievement.iconUrl ? (
              <div className="w-14 h-14 rounded-lg overflow-hidden border-2 border-primary/20 bg-background shadow-sm">
                <Image
                  src={achievement.iconUrl}
                  alt={achievement.title}
                  width={56}
                  height={56}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center">
                <Award className="w-7 h-7 text-primary" />
              </div>
            )}
          </div>

          {/* Title & Category */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg mb-1 line-clamp-2">
              {achievement.title}
            </h3>
            {achievement.category && (
              <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                {achievement.category.replace(/_/g, " ")}
              </span>
            )}
          </div>
        </div>

        {/* Date */}
        {achievement.achievedAt && (
          <div className="flex items-center gap-1.5 mt-3 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{formatMonthYear(achievement.achievedAt)}</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Description */}
        {achievement.description && (
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            {achievement.description}
          </p>
        )}

        {/* Proof Preview - Takes remaining space */}
        <div className="mt-auto">
          <ProofPreview proofUrl={achievement.proofUrl} />
        </div>
      </div>
    </div>
  );
}
