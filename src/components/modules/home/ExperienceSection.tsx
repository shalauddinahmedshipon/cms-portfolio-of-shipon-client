"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, ChevronDown, ChevronUp, MapPin, Calendar } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Experience } from "@/types/experience.types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  experiences: Experience[];
}

export default function ExperienceSection({ experiences }: Props) {
  if (!experiences?.length) return null;

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });

  const calculateDuration = (start: string, end?: string) => {
    const s = new Date(start);
    const e = end ? new Date(end) : new Date();
    const months =
      (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth());
    const y = Math.floor(months / 12);
    const m = months % 12;
    if (y && m) return `${y} yr ${m} mo`;
    if (y) return `${y} yr`;
    return `${m} mo`;
  };

  return (
    <Card className="border-none shadow-lg">
      <CardContent className="pt-6 md:pt-8">
        <h2 className="text-3xl font-semibold mb-8 md:mb-10 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Experience
        </h2>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-5 md:left-7 top-7 bottom-4 w-0.5 bg-gradient-to-b from-border via-border/50 to-transparent pointer-events-none" />

          <div className="">
            {experiences.map((exp, index) => {
              const [isExpanded, setIsExpanded] = useState(false);
              const desc = exp.description || "";
              const isLong = desc.length > 280;
              const displayDesc = isExpanded || !isLong ? desc : desc.slice(0, 280) + "...";

              const hasLogo = !!exp.companyLogo;

              return (
                <div key={exp.id} className="relative flex gap-4 md:gap-6 group">
                  {/* Timeline node – company logo or fallback icon */}
                  <div className="flex-shrink-0 w-12 md:w-14 flex justify-center pt-1 relative z-10">
                    <div
                      className={cn(
                        "h-10 w-10 md:h-12 md:w-12 rounded-full overflow-hidden border-2 border-primary/30 shadow-sm flex items-center justify-center transition-all duration-200",
                        "group-hover:border-primary/70 group-hover:shadow-md group-hover:scale-105",
                        hasLogo ? "bg-white" : "bg-background"
                      )}
                    >
                      {hasLogo ? (
                        <Image
                          src={exp.companyLogo!}
                          alt={`${exp.companyName} logo`}
                          width={48}
                          height={48}
                          className="object-contain w-full h-full"
                          priority={index < 3}
                        />
                      ) : (
                        <Briefcase className="h-5 w-5 md:h-6 md:w-6 text-primary/80" />
                      )}
                    </div>
                  </div>

                  {/* Main content */}
                  <div className="flex-1 min-w-0 pb-6 md:pb-10">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-6">
                      {/* Role + company info */}
                      <div>
                        <h3 className="text-xl font-semibold leading-tight text-foreground">
                          {exp.role}
                        </h3>

                        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm">
                          <span className="font-semibold text-foreground/95">
                            {exp.companyName}
                          </span>

                          {exp.employmentType && (
                            <span className="px-2.5 py-0.5 text-xs font-medium bg-muted/70 rounded-full">
                              {exp.employmentType}
                            </span>
                          )}

                          {exp.location && (
                            <span className="flex items-center gap-1 text-muted-foreground/85 italic">
                              <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                              {exp.location}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Dates + duration – aligned right on larger screens */}
                      <div className="flex items-center gap-3 text-sm text-muted-foreground whitespace-nowrap mt-1 sm:mt-0">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                          {formatDate(exp.startDate!)}{" "}
                          {exp.isCurrent ? "– Present" : `– ${formatDate(exp.endDate!)}`}
                        </span>
                        <span className="px-2.5 py-1 bg-muted/50 rounded-full text-xs font-medium">
                          {calculateDuration(exp.startDate!, exp.endDate)}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    {desc && (
                      <div className="mt-4 md:mt-5">
                        <p
                          className={cn(
                            "text-base leading-relaxed text-muted-foreground",
                            !isExpanded && isLong && "line-clamp-4 overflow-hidden"
                          )}
                        >
                          {displayDesc}
                        </p>

                        {isLong && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="mt-2.5 px-0.5 py-0.5 h-auto text-primary hover:text-primary/80 font-medium flex items-center gap-1.5 hover:underline"
                          >
                            {isExpanded ? "Show less" : "Read more"}
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                      </div>
                    )}

                    {index < experiences.length - 1 && (
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