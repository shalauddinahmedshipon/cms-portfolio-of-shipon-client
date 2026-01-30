// components/modules/home/HeroSection.tsx
import Image from "next/image";
import { MapPin } from "lucide-react";
import HeroActions from "./HeroActions";
import HeroSkeleton from "./HeroSkeleton";
import { Profile } from "@/types/profile.types";

interface HeroSectionProps {
  profile?: Profile| null;
}

export default function HeroSection({ profile }: HeroSectionProps) {
  if (!profile) {
    return <HeroSkeleton />;
  }

  return (
  
     <div>
       {/* Banner */}
      <div className="relative h-[220px] sm:h-[280px] md:h-[320px]  overflow-hidden bg-muted">
        {profile.bannerType === "VIDEO" ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
            poster={profile.bannerUrl ? undefined : "/cover.jpg"}
          >
            <source src={profile.bannerUrl ?? ""} type="video/mp4" />
          </video>
        ) : (
          <Image
            src={profile.bannerUrl ?? "/cover.jpg"}
            alt="Profile banner"
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 80vw"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
      </div>

      {/* Content and Avatar Layout */}
      <div className="relative px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          {/* Content Section - Left Side */}
          <div className="mt-6 text-center md:text-left max-w-4xl mx-auto md:mx-0 md:flex-1 order-2 md:order-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight">
              {profile.name || "Your Name"}
            </h1>

            {profile.designation && (
              <p className="mt-2 text-xl md:text-xl text-muted-foreground font-medium">
                {profile.designation}
              </p>
            )}

            {profile.headline && (
              <p className="mt-3 text-base md:text-md text-muted-foreground max-w-3xl">
                {profile.headline}
              </p>
            )}

            {profile.location && (
              <div className="mt-3 flex items-center justify-center md:justify-start gap-2 text-muted-foreground">
                <MapPin className="h-5 w-5" />
                <span>{profile.location}</span>
              </div>
            )}

            <div className="mt-6">
              <HeroActions resumeUrl={profile.resumeUrl} />
            </div>
          </div>

          {/* Avatar - Right Side */}
          <div className="relative mx-auto md:mx-0 h-32 w-32 md:h-40 md:w-40 lg:w-52 lg:h-52 rounded-full border-4 border-background bg-background shadow-xl overflow-hidden flex-shrink-0 -mt-20 md:-mt-24 order-1 md:order-2">
            <Image
              src={profile.avatarUrl ?? "/avatar.jpg"}
              alt={`${profile.name || "User"} profile picture`}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 128px, 160px"
            />
          </div>
        </div>
      </div>
     </div>

  );
}