"use client";

import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Calendar } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Education } from "@/types/education.types";

interface Props {
  education: Education[];
}

export default function EducationTimeline({ education }: Props) {
  if (!education?.length) return null;

  return (
    <Card className="border-none shadow-lg">
      <CardContent className="pt-6 md:pt-8">
        <h2 className="text-3xl font-semibold mb-8 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Education
        </h2>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-5 md:left-7 top-7 bottom-4 w-0.5 bg-gradient-to-b from-border via-border/50 to-transparent pointer-events-none" />

          <div>
            {education.map((edu, index) => {
              const hasIcon = !!edu.icon;

              return (
                <div key={edu.id} className="relative flex gap-4 md:gap-6 group">
                  {/* Timeline node */}
                  <div className="flex-shrink-0 w-12 md:w-14 flex justify-center pt-1 relative z-10">
                    <div
                      className={cn(
                        "h-10 w-10 md:h-12 md:w-12 rounded-full overflow-hidden border-2 border-primary/30 shadow-sm flex items-center justify-center transition-all duration-200",
                        "group-hover:border-primary/70 group-hover:shadow-md group-hover:scale-105",
                        hasIcon ? "bg-white" : "bg-background"
                      )}
                    >
                      {hasIcon ? (
                        <Image
                          src={edu.icon!}
                          alt={edu.institution}
                          width={48}
                          height={48}
                          className="object-contain w-full h-full"
                        />
                      ) : (
                        <GraduationCap className="h-5 w-5 md:h-6 md:w-6 text-primary/80" />
                      )}
                    </div>
                  </div>

                  {/* Main content */}
                  <div className="flex-1 min-w-0 pb-6 md:pb-10">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-6">
                      {/* Institution + Degree */}
                      <div>
                        <h3 className="text-xl font-semibold leading-tight text-foreground">
                          {edu.institution}
                        </h3>

                        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm">
                          <span className="font-semibold text-foreground/95">
                            {edu.level}
                          </span>

                          {edu.field && (
                            <span className="px-2.5 py-0.5 text-xs font-medium bg-muted/70 rounded-full">
                              {edu.field}
                            </span>
                          )}

                          {edu.status && (
                            <span className="italic text-muted-foreground/80">
                              {edu.status}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Year + GPA */}
                      <div className="flex items-center gap-3 text-sm text-muted-foreground whitespace-nowrap mt-1 sm:mt-0">
                        {edu.year && (
                          <span className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            {edu.year}
                          </span>
                        )}

                        {edu.gpa && (
                          <span className="px-2.5 py-1 bg-muted/50 rounded-full text-xs font-medium">
                            GPA {edu.gpa}
                          </span>
                        )}
                      </div>
                    </div>

                    {index < education.length - 1 && (
                      <div className="mt-8 md:mt-10 border-b-2 border-border/40" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
