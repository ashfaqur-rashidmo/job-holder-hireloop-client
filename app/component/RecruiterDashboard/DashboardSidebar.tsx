"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Bookmark,
  Briefcase,
  Building2,
  CreditCard,
  FileText,
  Home,
  LayoutDashboard,
  LogOut,
  PlusCircle,
  Search,
  Settings,
  Tags,
  Users,
  type LucideIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { signOut, useSession } from "@/lib/auth-client"

export type Role = "seeker" | "recruiter" | "admin"

export type MenuItem = {
  id: string
  name: string
  url: string
  icon: LucideIcon
}

const ROLE_LABEL: Record<Role, string> = {
  seeker: "Job Seeker",
  recruiter: "Recruiter",
  admin: "Admin",
}

const menuItemByRole: Record<Role, MenuItem[]> = {
  seeker: [
    {
      id: "seeker-dashboard",
      name: "Dashboard",
      url: "/dashboard/seeker",
      icon: LayoutDashboard,
    },
    {
      id: "seeker-browse",
      name: "jobs",
      url: "/dashboard/seeker/jobs",
      icon: Search,
    },
    {
      id: "seeker-saved",
      name: "Saved Jobs",
      url: "/dashboard/seeker/saved",
      icon: Bookmark,
    },
    {
      id: "seeker-applications",
      name: "My Applications",
      url: "/dashboard/seeker/applications",
      icon: FileText,
    },
   
    {
      id: "seeker-billing",
      name: "Billing",
      url: "/dashboard/seeker/billing",
      icon: CreditCard,
    },
    {
      id: "seeker-settings",
      name: "Settings",
      url: "/dashboard/seeker/settings",
      icon: Settings,
    },
  ],

  recruiter: [
    {
      id: "recruiter-dashboard",
      name: "Dashboard",
      url: "/dashboard/recruiter",
      icon: LayoutDashboard,
    },
    {
      id: "recruiter-jobs",
      name: "Manage-jobs",
      url: "/dashboard/recruiter/jobs",
      icon: Building2,
    },
    
    {
      id: "recruiter-applications",
      name: "Applications",
      url: "/dashboard/recruiter/applications",
      icon: FileText,
    },
    {
      id: "add-jobs",
      name: "Add Jobs",
      url: "/dashboard/recruiter/jobs/new",
      icon: PlusCircle,
    },
    // {
    //   id: "recruiter-billing",
    //   name: "Subscription & Billing",
    //   url: "/dashboard/recruiter/billing",
    //   icon: CreditCard,
    // },
    {
      id: "recruiter-settings",
      name: "Settings",
      url: "/dashboard/recruiter/settings",
      icon: Settings,
    },
  ],

  admin: [
    {
      id: "admin-dashboard",
      name: "Dashboard",
      url: "/dashboard/admin",
      icon: LayoutDashboard,
    },
    {
      id: "admin-users",
      name: "Manage Users",
      url: "/dashboard/admin/users",
      icon: Users,
    },
    {
      id: "admin-companies",
      name: "Manage Companies",
      url: "/dashboard/admin/companies",
      icon: Building2,
    },
    {
      id: "admin-jobs",
      name: "Manage Jobs",
      url: "/dashboard/admin/jobs",
      icon: Briefcase,
    },
    {
      id: "admin-payments",
      name: "Payments & Subscriptions",
      url: "/dashboard/admin/payments",
      icon: CreditCard,
    },
    {
      id: "admin-settings",
      name: "Settings",
      url: "/dashboard/admin/settings",
      icon: Settings,
    },
  ],
}

// Public pages every role can reach from the dashboard (per requirements).
const publicLinks: MenuItem[] = [
  { id: "public-home", name: "Home", url: "/", icon: Home },
  { id: "public-jobs", name: "Browse Jobs", url: "/jobs", icon: Search },
  {
    id: "public-companies",
    name: "Companies",
    url: "/companies",
    icon: Building2,
  },
  { id: "public-pricing", name: "Pricing", url: "/pricing", icon: Tags },
]

export function DashboardSidebar() {
  const { data: session, isPending } = useSession()
  const pathname = usePathname()
  const router = useRouter()

  const role = (session?.user?.role as Role) || "seeker"
  const items = menuItemByRole[role]

  const userName = session?.user?.name?.trim() || "Guest"
  const userEmail = session?.user?.email || ""
  const initials = userName
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase()

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/" className="px-2 py-1">
          <Image
            src="/images/logo.png"
            alt="HireLoop"
            width={132}
            height={38}
            priority
          />
        </Link>

        <div className="flex items-center gap-3 rounded-lg bg-sidebar-accent/60 p-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-indigo-500/15 text-sm font-semibold text-indigo-400">
            {initials || "U"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-sidebar-foreground">
              {isPending ? "Loading…" : userName}
            </p>
            <p className="truncate text-xs text-sidebar-foreground/60">
              {isPending ? "" : userEmail}
            </p>
          </div>
        </div>

        {!isPending && (
          <span className="mx-2 inline-flex w-fit items-center rounded-full bg-indigo-500/15 px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-indigo-400 uppercase">
            {ROLE_LABEL[role]}
          </span>
        )}
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{ROLE_LABEL[role]} Menu</SidebarGroupLabel>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  render={<Link href={item.url} />}
                  isActive={pathname === item.url}
                >
                  <item.icon />
                  <span>{item.name}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Explore</SidebarGroupLabel>
          <SidebarMenu>
            {publicLinks.map((item) => (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  render={<Link href={item.url} />}
                  isActive={pathname === item.url}
                >
                  <item.icon />
                  <span>{item.name}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <Button
          variant="ghost"
          onClick={handleSignOut}
          className="w-full justify-start gap-2 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-red-400"
        >
          <LogOut className="size-4" />
          Log out
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
