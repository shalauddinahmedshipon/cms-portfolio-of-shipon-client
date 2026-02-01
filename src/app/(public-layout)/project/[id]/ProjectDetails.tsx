"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Github, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Project } from "@/types/project.types";

interface Props {
  project: Project;
}

export default function ProjectDetailClient({ project }: Props) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = project.images || [];
  const techStack = project.technology?.split(",").map(t => t.trim()).filter(Boolean) || [];

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  const prevSlide = () => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  const nextSlide = () => setCurrentImageIndex((prev) => (prev + 1) % images.length);
  const goTo = (index: number) => setCurrentImageIndex(index);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto max-w-6xl px-5 py-20">
        {/* Back */}
        <Link
          href="/projects"
          className="group mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Projects
        </Link>

        {/* Carousel */}
        <div className="mb-12 md:mb-16">
          {images.length > 0 ? (
            <div className="relative">
              <div className="relative aspect-[5/3] md:aspect-[2/1] lg:aspect-[2/1] rounded-2xl overflow-hidden shadow-lg border bg-muted">
                <Image
                  src={images[currentImageIndex]}
                  alt={`${project.name} screenshot ${currentImageIndex + 1}`}
                  fill
                  priority={currentImageIndex < 2}
                  className="object-cover transition-transform duration-700 hover:scale-[1.02]"
                />

                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1.5 text-xs font-medium rounded-full bg-background/80 backdrop-blur-md border shadow-sm">
                    {project.category}
                  </span>
                </div>

                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevSlide}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-background/70 backdrop-blur-md border hover:bg-background/90 transition-all shadow-sm hover:shadow-md"
                      aria-label="Previous"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextSlide}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-background/70 backdrop-blur-md border hover:bg-background/90 transition-all shadow-sm hover:shadow-md"
                      aria-label="Next"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-medium rounded-full bg-background/80 backdrop-blur-md border shadow-sm">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                )}
              </div>

              {images.length > 1 && (
                <div className="mt-5 flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => goTo(idx)}
                      className={`snap-start relative flex-shrink-0 w-20 h-14 sm:w-28 sm:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        idx === currentImageIndex
                          ? "border-primary scale-105 shadow-md"
                          : "border-transparent opacity-70 hover:opacity-100 hover:border-muted-foreground/50"
                      }`}
                    >
                      <Image src={img} alt={`Thumb ${idx + 1}`} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="aspect-[2/1] rounded-2xl bg-muted flex items-center justify-center border">
              <p className="text-muted-foreground">No images available</p>
            </div>
          )}
        </div>

        {/* Main content */}
        <div className="grid lg:grid-cols-12 gap-10">
          {/* Tech Stack – comes first on mobile, stays right column on desktop */}
          <div className="lg:col-span-4 order-1 lg:order-2">
            <Card
              className="border bg-card/50 backdrop-blur-sm shadow-sm sticky lg:sticky"
              style={{ top: "100px" }}
            >
              <CardHeader className="pb-4">
                <h3 className="text-xl font-semibold">Tech Stack</h3>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {techStack.map((tech, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 text-xs font-medium rounded-md bg-muted text-muted-foreground border"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main content – comes after tech stack on mobile */}
          <div className="lg:col-span-8 order-2 lg:order-1 space-y-10">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
                {project.name}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {project.title}
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              {project.liveSiteUrl && (
                <a
                  href={project.liveSiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors shadow-sm hover:shadow"
                >
                  <ExternalLink className="w-4 h-4" />
                  Live Demo
                </a>
              )}

              {project.githubFrontendUrl && (
                <a
                  href={project.githubFrontendUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border font-medium text-sm hover:bg-accent hover:border-accent transition-colors"
                >
                  <Github className="w-4 h-4" />
                  Frontend
                </a>
              )}

              {project.githubBackendUrl && (
                <a
                  href={project.githubBackendUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border font-medium text-sm hover:bg-accent hover:border-accent transition-colors"
                >
                  <Github className="w-4 h-4" />
                  Backend
                </a>
              )}
            </div>

            <div className="prose prose-neutral max-w-none dark:prose-invert">
              <h2 className="text-2xl font-semibold mb-4">Project Overview</h2>
              <div
                dangerouslySetInnerHTML={{
                  __html: project.description || "<p>No detailed description available.</p>",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}