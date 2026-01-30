// components/layout/Navbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/project", label: "Projects" },
  { href: "/event", label: "Events" },
  { href: "/blog", label: "Blogs" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const isHomePage = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      // Show navbar after scrolling past hero section (adjust threshold as needed)
      const heroHeight = 600; // Adjust based on your actual hero section height
      setIsVisible(window.scrollY > heroHeight);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial state

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Show navbar logic:
  // - On home page: show after scrolling past hero
  // - On other pages: always show
  const shouldShow = !isHomePage || isVisible;

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-transform duration-300 bg-background/80 backdrop-blur-md border-b",
        shouldShow ? "translate-y-0" : "-translate-y-full"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center h-16">
          <ul className="flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-primary relative",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-primary" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
}