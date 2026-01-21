"use client"

import * as React from "react"
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar"
import Link from "next/link"

export function TeamSwitcher({
  teams,
}: {
  teams: {
    name: string
    logo: React.ElementType | string
    plan: string
  }[]
}) {
  const [activeTeam, setActiveTeam] = React.useState(teams[0])

  if (!activeTeam) return null

  return (
    <SidebarMenu>
      <SidebarMenuItem>
      
         <Link href="/"> 
           <div className="flex items-center gap-2 p-2 cursor-pointer rounded-lg hover:bg-sidebar-accent transition-colors">
              
              {/* Force Square Container */}
              <div className="size-6 shrink-0 bg-sidebar-primary flex items-center justify-center overflow-hidden aspect-square">
                {typeof activeTeam.logo === "string" ? (
                  <img
                    src={activeTeam.logo}
                    alt={activeTeam.name}
                    className="w-full h-full object-cover"
                    style={{ borderRadius: '0px' }} // Double insurance
                  />
                ) : (
                  /* If it's a Lucide Icon */
                  <activeTeam.logo className="size-5" />
                )}
              </div>

              {/* Name + Plan */}
              <div className="flex flex-col flex-1 truncate leading-tight">
                <span className="text-sm font-medium truncate">{activeTeam.name}</span>
                <span className="text-xs text-muted-foreground truncate">{activeTeam.plan}</span>
              </div>

            
            </div>
          </Link>
      
      </SidebarMenuItem>
    </SidebarMenu>
  )
}