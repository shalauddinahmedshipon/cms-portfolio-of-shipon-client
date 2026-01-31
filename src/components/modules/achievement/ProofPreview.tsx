"use client";

import { useState } from "react";
import Image from "next/image";
import { ExternalLink, FileText, Image as ImageIcon, Link as LinkIcon, Eye } from "lucide-react";

interface ProofPreviewProps {
  proofUrl?: string | null;
}

const getEmbedUrl = (url: string) => {
  // Google Drive file
  if (url.includes("drive.google.com/file/d/")) {
    const fileId = url.split("/d/")[1]?.split("/")[0];
    return `https://drive.google.com/file/d/${fileId}/preview`;
  }
  return url;
};

const getUrlInfo = (url: string) => {
  const lower = url.toLowerCase();
  
  // PDF files
  if (lower.includes("drive.google.com") || lower.endsWith(".pdf")) {
    return { type: "pdf", label: "View Certificate", icon: FileText };
  }
  
  // Image files
  if (/\.(png|jpg|jpeg|webp|gif|jfif)$/i.test(lower)) {
    return { type: "image", label: "View Certificate", icon: ImageIcon };
  }
  
  // Generic link
  return { type: "link", label: "View Proof", icon: LinkIcon };
};

export default function ProofPreview({ proofUrl }: ProofPreviewProps) {
  const [imageError, setImageError] = useState(false);

  if (!proofUrl) return null;

  const { type, label, icon: Icon } = getUrlInfo(proofUrl);
  const embedUrl = getEmbedUrl(proofUrl);

  // Image Preview
  if (type === "image" && !imageError) {
    return (
      <div className="space-y-2">
        <div className="relative group rounded-lg overflow-hidden border border-border/50 bg-muted/30">
          <Image
            src={proofUrl}
            alt="Certificate"
            width={600}
            height={400}
            className="w-full h-auto object-contain max-h-[300px]"
            onError={() => setImageError(true)}
          />
          <a
            href={proofUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
          >
            <div className="text-white flex items-center gap-2 px-4 py-2 bg-black/40 rounded-lg backdrop-blur-sm">
              <Eye className="w-4 h-4" />
              <span className="text-sm font-medium">View Full Size</span>
            </div>
          </a>
        </div>
      </div>
    );
  }

  // PDF Preview (always visible)
  if (type === "pdf") {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between px-3 py-2 rounded-t-lg border-x border-t bg-muted/30">
          <div className="flex items-center gap-2">
            <Icon className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">{label}</span>
          </div>
          <a
            href={proofUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            <span>Open</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        
        <div className="border rounded-b-lg overflow-hidden bg-muted/30">
          <div className="relative w-full h-[400px]">
            <iframe
              src={embedUrl}
              className="w-full h-full"
              allow="autoplay"
              title="Certificate Preview"
            />
          </div>
        </div>
      </div>
    );
  }

  // Generic Link (for any other URLs)
  return (
    <a
      href={proofUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between px-4 py-2.5 rounded-lg border bg-card hover:bg-accent transition-all group"
    >
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">{label}</span>
      </div>
      <ExternalLink className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity" />
    </a>
  );
}
