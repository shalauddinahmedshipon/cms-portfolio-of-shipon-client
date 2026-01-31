"use client"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { ExternalLink, Award } from "lucide-react"
import { Achievement } from "@/types/achievement"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import AchievementCard from "../home/AchievementCard"

interface Props {
  achievements: Achievement[]
}

export default function AchievementsCarousel({ achievements }: Props) {
  if (!achievements?.length) return null

  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-2">
        <Award className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-semibold">Achievements</h2>
      </div>

      {/* Carousel */}
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {achievements.map((item) => (
            <CarouselItem
              key={item.id}
              className="md:basis-1/2 lg:basis-1/3"
            >
              <AchievementCard achievement={item} />
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  )
}
