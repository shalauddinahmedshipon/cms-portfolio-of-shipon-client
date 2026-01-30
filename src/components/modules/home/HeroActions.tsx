"use client";

import { Button } from "@/components/ui/button";
import { Download, Mail } from "lucide-react";

interface HeroActionsProps {
  resumeUrl?: string;
}

export default function HeroActions({ resumeUrl }: HeroActionsProps) {
  return (
    <div className="flex flex-wrap gap-3 justify-center md:justify-start">
    
      {resumeUrl && (
        <Button 
          size="lg" 
          asChild 
          variant="default"
          className="rounded-full px-6 py-6 text-base font-semibold min-w-[140px]"
        >
          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            download
          >
            <Download className="mr-2 h-5 w-5" />
            Resume
          </a>
        </Button>
      )}

        <Button 
        size="lg" 
        variant="outline"
        className="rounded-full px-6 py-6 text-base font-semibold min-w-[140px]"
      >
        <Mail className="mr-2 h-5 w-5" />
        Connect
      </Button>
     
    </div>
  );
}