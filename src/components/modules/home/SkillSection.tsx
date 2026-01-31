import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { SkillCategory } from "@/types/skill.types";
import { cn } from "@/lib/utils";

interface Props {
  categories: SkillCategory[];
}

export default function SkillSection({ categories }: Props) {
  if (!categories?.length) return null;

  return (
    <Card className="border-none shadow-lg">
      <CardContent className="py-6 md:pt-8">
        <h2 className="text-3xl font-semibold mb-8 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Skills
        </h2>

        <div className="space-y-10">
          {categories.map((category) => (
            <div key={category.id}>
              {/* Category title */}
              <h3 className="text-lg font-semibold mb-4 text-foreground">
                {category.name}
              </h3>

              {/* Skills */}
              <div className="flex flex-wrap gap-3">
                {category.skills.map((skill) => (
                  <div
                    key={skill.id}
                    className={cn(
                      "flex items-center gap-2.5 px-4 py-2.5 rounded-full",
                      "bg-muted/60 border border-border/50",
                      "hover:border-primary/50 hover:bg-primary/5",
                      "transition-all duration-200"
                    )}
                  >
                    {skill.icon ? (
                      <Image
                        src={skill.icon}
                        alt={skill.name}
                        width={20}
                        height={20}
                        className="object-contain"
                      />
                    ) : (
                      <span className="w-5 h-5 rounded-full bg-primary/20" />
                    )}

                    <span className="text-sm font-medium text-foreground">
                      {skill.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
