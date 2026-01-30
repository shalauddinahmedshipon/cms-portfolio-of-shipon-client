// components/modules/home/AboutSection.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface AboutSectionProps {
  bio?: string;
}

export default function AboutSection({ bio }: AboutSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!bio) return null;

  const PREVIEW_LENGTH = 200; // Adjust character limit as needed
  const previewText = bio.slice(0, PREVIEW_LENGTH);
  const shouldShowButton = bio.length > PREVIEW_LENGTH;

  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-3xl font-semibold mb-6">About Me</h2>
        <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
          {isExpanded ? bio : previewText}
          {!isExpanded && shouldShowButton && '...'}
        </p>
        
        {shouldShowButton && (
          <Button
            variant="link"
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-3 px-0 text-primary font-semibold"
          >
            {isExpanded ? 'See less' : 'See more'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}