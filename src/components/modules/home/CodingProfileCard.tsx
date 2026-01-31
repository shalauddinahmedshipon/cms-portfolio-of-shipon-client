import Image from "next/image";
import { ExternalLink, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { CodingProfile } from "@/types/profile.types";

interface Props {
  profile: CodingProfile;
}

export default function CodingProfileCard({ profile }: Props) {
  return (
    <a
      href={profile.profileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group relative block rounded-xl border p-4 transition-all",
        "hover:shadow-md hover:-translate-y-0.5",
        profile.highlight
          ? "border-primary/60 bg-primary/5"
          : "border-border bg-background"
      )}
    >
      {/* Highlight badge */}
      {profile.highlight && (
        <span className="absolute top-3 right-3 flex items-center gap-1 text-xs font-semibold text-primary">
          <Star className="h-3.5 w-3.5 fill-primary" />
          Featured
        </span>
      )}

      <div className="flex items-start gap-3">
        {/* Platform Icon */}
        <div className="h-11 w-11 rounded-lg border bg-white flex items-center justify-center overflow-hidden">
          {profile.iconUrl ? (
            <Image
              src={profile.iconUrl}
              alt={profile.platform}
              width={32}
              height={32}
              className="object-contain"
            />
          ) : (
            <span className="text-sm font-bold text-primary">
              {profile.platform.charAt(0)}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold leading-tight text-foreground">
            {profile.platform}
          </h3>

          <p className="text-sm text-muted-foreground truncate">
            @{profile.username}
          </p>
        </div>

        <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
      </div>

      {/* Rating & badge */}
      {(profile.rating || profile.badge) && (
        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          {profile.rating && (
            <span className="px-2.5 py-1 rounded-full bg-muted/60 font-medium">
              Rating: {profile.rating}
            </span>
          )}

          {profile.badge && (
            <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium">
              {profile.badge}
            </span>
          )}
        </div>
      )}
    </a>
  );
}
