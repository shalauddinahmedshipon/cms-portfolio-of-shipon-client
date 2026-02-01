"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Github, Code2 } from "lucide-react";
import { Project } from "@/types/project.types";

interface Props {
  project: Project;
}

export default function ProjectCard({ project }: Props) {
  const firstImage = project.images?.[0];
  const techStack = project.technology?.split(",").map(t => t.trim()).filter(Boolean) || [];

  return (
    <div className="rounded-xl border bg-card hover:shadow-lg transition-all duration-300 overflow-hidden h-full flex flex-col">
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

      {/* Content Section */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Project Name & Title */}
        <div className="mb-3">
          <h3 className="font-semibold text-lg mb-1 line-clamp-1">
            {project.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {project.title}
          </p>
        </div>

        {/* Technology Stack */}
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
          <div className="flex items-center gap-2">
            {/* View Details Button */}
            <Link
              href={`/project/${project.id}`}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Code2 className="w-4 h-4" />
              View Details
            </Link>

            {/* Live Site Link */}
            {project.liveSiteUrl && (
              <a
                href={project.liveSiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg border hover:bg-accent transition-colors"
                title="Live Site"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}

            {/* GitHub Link */}
            {(project.githubFrontendUrl || project.githubBackendUrl) && (
              <a
                href={project.githubFrontendUrl || project.githubBackendUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg border hover:bg-accent transition-colors"
                title="GitHub Repository"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
