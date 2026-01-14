"use client"

import * as React from "react"
import {
  SquareTerminal,
  LayoutDashboard,
  User,
  FolderKanban,
  Image,
  Users,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"
import { TeamSwitcher } from "./team-switcher"

import { useAppSelector } from "@/store/hooks"
import type { NavItem } from "@/types/navigation.types"

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
const { user, isAuthenticated } = useAppSelector((state) => state.auth)

  // If not yet authenticated → show minimal / loading sidebar
  if (!isAuthenticated) {
    return (
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <div className="h-10 bg-muted animate-pulse rounded-md" /> {/* placeholder */}
        </SidebarHeader>
        <SidebarContent>
          <div className="space-y-4 p-4">
            <div className="h-8 bg-muted animate-pulse rounded" />
            <div className="h-8 bg-muted animate-pulse rounded" />
          </div>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
    )
  }
  /* ---------------------------
     User & Team Data
  ---------------------------- */
  const data = React.useMemo(
    () => ({
      user: {
        name: user?.fullName ?? "MD.SHIPON",
        email: user?.email ?? "shalauddinahmedshipon2018@gmail.com",
        avatar: "/avatars/shadcn.jpg",
      },
      teams: [
        {
          name: "MD.SHIPON",
          logo: SquareTerminal,
          plan: "Software Engineer",
        },
      ],
    }),
    [user]
  )

  /* ---------------------------
     Navigation (IMMUTABLE)
  ---------------------------- */
  const navMain: NavItem[] = React.useMemo(() => {
    const baseNav: NavItem[] = [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Profile",
        icon: User,
        items: [
          { title: "Profile Info", url: "/dashboard/profile/general" },
          { title: "Contact Info", url: "/dashboard/profile/contact" },
          { title: "Coding Profiles", url: "/dashboard/profile/coding-profiles" },
          { title: "Education", url: "/dashboard/profile/education" },
          { title: "Experience", url: "/dashboard/profile/experience" },
          { title: "Skills", url: "/dashboard/profile/skills" },
        ],
      },
      {
        title: "Content",
        icon: FolderKanban,
        items: [
          { title: "Projects", url: "/dashboard/content/projects" },
          { title: "Blogs", url: "/dashboard/content/blogs" },
          { title: "Events", url: "/dashboard/content/events" },
          { title: "Achievements", url: "/dashboard/content/achievements" },
        ],
      },
      {
        title: "Media",
        icon: Image,
        items: [{ title: "Gallery", url: "/dashboard/media/gallery" }],
      },
    ]

    // ✅ Role-based nav (NO mutation)
    if (user?.role === "ADMIN") {
      baseNav.push({
        title: "Users",
        url: "/dashboard/users",
        icon: Users,
      })
    }

    return baseNav
  }, [user?.role])

  /* ---------------------------
     Render
  ---------------------------- */
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}


