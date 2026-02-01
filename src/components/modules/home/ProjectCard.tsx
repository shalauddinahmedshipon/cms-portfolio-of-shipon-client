

"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Github, Code2, Star } from "lucide-react";
import { Project } from "@/types/project.types";

interface Props {
  project: Project;
}

export default function ProjectCard({ project }: Props) {
  const firstImage = project.images?.[0];
  const techStack = project.technology?.split(",").map(t => t.trim()).filter(Boolean) || [];

  const hasFrontend = !!project.githubFrontendUrl;
  const hasBackend = !!project.githubBackendUrl;

  return (
    <div className="rounded-xl border bg-card hover:shadow-lg transition-all duration-300 overflow-hidden h-full flex flex-col relative">
      {/* Favorite Star */}
      {project.isFavorite && (
        <div className="absolute top-3 left-3 z-10">
          <Star className="w-5 h-5 fill-yellow-400 text-yellow-500 drop-shadow-md" />
        </div>
      )}

      {/* Project Image */}
      {firstImage && (
        <div className="relative w-full h-48 bg-muted overflow-hidden">
          <Image
            src={firstImage}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
          />
          {/* Category Badge */}
          <div className="absolute top-3 right-3">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-background/90 backdrop-blur-sm text-foreground shadow-sm">
              {project.category}
            </span>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="mb-3">
          <h3 className="font-semibold text-lg mb-1 line-clamp-1">{project.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{project.title}</p>
        </div>

        {techStack.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {techStack.slice(0, 10).map((tech, index) => (
              <span
                key={index}
                className="inline-block px-2 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary"
              >
                {tech}
              </span>
            ))}
            {techStack.length > 4 && (
              <span className="inline-block px-2 py-1 rounded-md text-xs font-medium bg-muted text-muted-foreground">
                +{techStack.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-auto pt-4 border-t">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/project/${project.id}`}
              className="flex-1 min-w-[140px] flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Code2 className="w-4 h-4" />
              View Details
            </Link>

            {project.liveSiteUrl && (
              <a
                href={project.liveSiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg border hover:bg-accent transition-colors flex items-center gap-1.5 text-sm font-medium"
                title="Live Site"
              >
                <ExternalLink className="w-4 h-4" />
                <span className="hidden sm:inline">Live</span>
              </a>
            )}

            {hasFrontend && (
              <a
                href={project.githubFrontendUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg border hover:bg-accent transition-colors flex items-center gap-1.5 text-sm font-medium"
                title="Frontend Repository"
              >
                <Github className="w-4 h-4" />
                <span className="hidden sm:inline">Frontend</span>
              </a>
            )}

            {hasBackend && (
              <a
                href={project.githubBackendUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg border hover:bg-accent transition-colors flex items-center gap-1.5 text-sm font-medium"
                title="Backend Repository"
              >
                <Github className="w-4 h-4" />
                <span className="hidden sm:inline">Backend</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}