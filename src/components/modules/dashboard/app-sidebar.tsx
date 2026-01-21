"use client"

import * as React from "react"
import {
  LayoutDashboard,
  User,
  FolderKanban,
  Image,
  Users,
  User as DefaultUserIcon,
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
import { useGetProfileQuery } from "@/store/api/profile.api"
import { Skeleton } from "@/components/ui/skeleton"


export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth)
  const { data: profile, isLoading } = useGetProfileQuery(undefined, {
    refetchOnMountOrArgChange: true,
  })

  // Minimal sidebar for unauthenticated users
  if (!isAuthenticated) {
    return (
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <div className="h-10 bg-muted animate-pulse rounded-md" />
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
  const data = React.useMemo(() => {
    const userData = {
      name: user?.fullName ?? "MD.SHIPON",
      email: user?.email ?? "shalauddinahmedshipon2018@gmail.com",
      avatar:"https://www.nicepng.com/png/detail/128-1280406_view-user-icon-png-user-circle-icon-png.png", // icon for NavUser
    }

    // const teams = [
    //   {
    //     name: profile?.name ?? "MD.SHIPON",
    //     logo: profile?.avatarUrl
    //       ? () => (
    //           <img
    //             src={profile.avatarUrl}
    //             alt={profile?.name ?? "Team"}
    //             className="w-5 h-5 rounded-full"
    //           />
    //         )
    //       : DefaultUserIcon,
    //     plan: profile?.designation ?? "N/A",
    //   },
    // ]

    const teams = [
    {
      name: profile?.name ?? "MD.SHIPON",
      // FIX: Pass the URL directly. Do not create an <img> tag here.
      logo: profile?.avatarUrl ?? DefaultUserIcon, 
      plan: profile?.designation ?? "N/A",
    },
  ]

    return { user: userData, teams }
  }, [user, profile])

  /* ---------------------------
     Navigation (IMMUTABLE)
  ---------------------------- */
  const navMain: NavItem[] = React.useMemo(() => {
    const baseNav: NavItem[] = [
      { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
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

    if (user?.role === "ADMIN") {
      baseNav.push({ title: "Users", url: "/dashboard/users", icon: Users })
    }

    return baseNav
  }, [user?.role])

  /* ---------------------------
     Render
  ---------------------------- */
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {isLoading ? (
          <div className="flex flex-col gap-2 p-2">
            <Skeleton className="w-24 h-6 rounded" />
            <Skeleton className="w-16 h-6 rounded" />
          </div>
        ) : (
          <TeamSwitcher teams={data.teams} />
       
        )}
      </SidebarHeader>

      <SidebarContent>
        {isLoading ? (
          <div className="space-y-2 p-4">
            <Skeleton className="h-8 rounded" />
            <Skeleton className="h-8 rounded" />
            <Skeleton className="h-8 rounded" />
          </div>
        ) : (
          <NavMain items={navMain} />
        )}
      </SidebarContent>

      <SidebarFooter>
        {isLoading ? (
          <div className="flex items-center gap-2 p-2">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="flex flex-col gap-1">
              <Skeleton className="w-20 h-3 rounded" />
              <Skeleton className="w-16 h-3 rounded" />
            </div>
          </div>
        ) : (
          <NavUser user={data.user} />
        )}
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
