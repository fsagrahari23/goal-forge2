"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Home,
  PlusCircle,
  Map,
  BarChart3,
  Users,
  Settings,
  BookOpen,
} from "lucide-react";

export function DashboardNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Home,
    },
    {
      title: "Roadmaps",
      href: "/dashboard/roadmaps",
      icon: Map,
    },
    {
      title: "Create New",
      href: "/dashboard/create",
      icon: PlusCircle,
    },
    {
      title: "Blog",
      href: "/blog",
      icon: BookOpen,
    },
  ];

  // Admin-only navigation items
  const adminNavItems = [
    {
      title: "Admin Dashboard",
      href: "/admin",
      icon: BarChart3,
    },
    {
      title: "Manage Users",
      href: "/admin/users",
      icon: Users,
    },
    {
      title: "Manage Roadmaps",
      href: "/admin/roadmaps",
      icon: Calendar,
    },
    {
      title: "Manage Blog",
      href: "/admin/blogs",
      icon: BookOpen,
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: Settings,
    },
  ];

  return (
    <nav className="grid gap-1 p-4">
      <div className="mb-4">
        <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
          Main Navigation
        </h2>
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-2",
                pathname === item.href && "bg-muted"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Button>
          </Link>
        ))}
      </div>

      {user?.isAdmin && (
        <div className="mb-4">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
            Admin
          </h2>
          {adminNavItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-2",
                  pathname === item.href && "bg-muted"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Button>
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
