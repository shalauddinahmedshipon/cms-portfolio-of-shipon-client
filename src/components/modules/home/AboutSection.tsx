// components/modules/home/AboutSection.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Github, Linkedin, Twitter, Facebook } from "lucide-react";
import { useState } from "react";
import { ContactInfo } from "@/types/profile.types"; // adjust path if needed

interface AboutSectionProps {
  bio?: string;
  contactInfo?: ContactInfo | null; // ← we'll pass contactInfo from parent
}

export default function AboutSection({ bio, contactInfo }: AboutSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Decide if we should show contact block at all
  const hasContact =
    contactInfo &&
    (contactInfo.email ||
      contactInfo.whatsapp ||
      contactInfo.github ||
      contactInfo.linkedin ||
      contactInfo.twitter ||
      contactInfo.facebook);

  const shouldShowBio = !!bio;
  const PREVIEW_LENGTH = 330;

  if (!shouldShowBio && !hasContact) return null;

  const previewText = bio ? bio.slice(0, PREVIEW_LENGTH) : "";
  const shouldShowButton = bio ? bio.length > PREVIEW_LENGTH : false;

  return (
    <Card className="border-none shadow-sm">
      <CardContent className="pt-6 ">
        <h2 className="text-3xl font-semibold mb-6">About Me</h2>

        {/* Bio */}
        {shouldShowBio && (
          <>
            <p className="text-base leading-relaxed text-muted-foreground whitespace-pre-line">
              {isExpanded ? bio : previewText}
              {!isExpanded && shouldShowButton && "..."}
            </p>

            {shouldShowButton && (
              <Button
                variant="link"
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-3 px-0 text-primary hover:text-primary/80 font-medium"
              >
                {isExpanded ? "Show less" : "Read more"}
              </Button>
            )}
          </>
        )}

        {/* Contact Info - appears below bio (or alone if no bio) */}
        {hasContact && (
          <div className={shouldShowBio ? "mt-10 pt-6 border-t" : "mt-2"}>
            

            <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center justify-between">
             

              {/* WhatsApp / Phone - shows real number */}
              {contactInfo?.whatsapp && (
                <div className="flex items-center gap-3">
                  <div className=" p-2 rounded-full">
                    <Phone className="h-4 w-4" />
                  </div>
                  <a
                    href={`https://wa.me/${contactInfo.whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {contactInfo.whatsapp}
                  </a>
                </div>
              )}

               {/* Email - shows real address */}
              {contactInfo?.email && (
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Mail className="h-4 w-4 text-primary" />
                  </div>
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {contactInfo.email}
                  </a>
                </div>
              )}

              {/* Social Icons - icon only, clean & simple */}
              <div className="flex items-center gap-5 mt-2 sm:mt-0">
                {contactInfo?.github && (
                  <a
                    href={contactInfo.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                    className="text-muted-foreground hover:text-foreground transition-all hover:scale-110 duration-200"
                  >
                    <Github className="h-4 w-4" />
                  </a>
                )}

                {contactInfo?.linkedin && (
                  <a
                    href={contactInfo.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="text-muted-foreground hover:text-foreground transition-all hover:scale-110 duration-200"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                )}

                {contactInfo?.twitter && (
                  <a
                    href={contactInfo.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Twitter / X"
                    className="text-muted-foreground hover:text-foreground transition-all hover:scale-110 duration-200"
                  >
                    <Twitter className="h-4 w-4" />
                  </a>
                )}

                {contactInfo?.facebook && (
                  <a
                    href={contactInfo.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="text-muted-foreground hover:text-foreground transition-all hover:scale-110 duration-200"
                  >
                    <Facebook className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}