import { Card, CardContent } from "@/components/ui/card";
import CodingProfileCard from "./CodingProfileCard";
import { CodingProfile } from "@/types/profile.types";

interface Props {
  profiles: CodingProfile[];
}

export default function CodingProfileSection({ profiles }: Props) {
  if (!profiles?.length) return null;

  return (
    <Card className="border-none shadow-lg">
      <CardContent className="pt-6 md:pt-8">
        <h2 className="text-3xl mb-8 font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Coding Profiles
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {profiles.map((profile) => (
            <CodingProfileCard
              key={profile.id}
              profile={profile}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
