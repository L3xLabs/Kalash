// app/intern/layout.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  LogOut,
  LayoutDashboard,
  BookOpen,
  Users,
  Calendar,
  Settings,
  BrainCircuit,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function InternLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const role = localStorage.getItem("role");
      const storedUsername = localStorage.getItem("username");

      if (!role || role !== "INTERN") {
        router.push("/");
      } else {
        setUsername(storedUsername || "");
      }
    }
  }, [router]);

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/intern/dashboard",
    },
    {
      id: "quiz",
      label: "Team Match Quiz",
      icon: BrainCircuit,
      path: "/intern/dashboard/quiz",
    },
    {
      id: "courses",
      label: "My Courses",
      icon: BookOpen,
      path: "/intern/dashboard/courses",
    },
    {
      id: "teams",
      label: "My Teams",
      icon: Users,
      path: "/intern/teams",
    },
    {
      id: "schedule",
      label: "Schedule",
      icon: Calendar,
      path: "/intern/schedule",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      path: "/intern/settings",
    },
  ];

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("username");
      localStorage.removeItem("role");
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar */}
      <div className="w-64 bg-white border-r min-h-screen">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold">Intern Dashboard</h1>
          {username && (
            <div className="mt-2">
              <p className="text-sm text-gray-500">Welcome,</p>
              <p className="text-sm font-medium">{username}</p>
            </div>
          )}
        </div>
        <nav className="p-4">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              href={item.path}
              className={cn(
                "w-full flex items-center gap-2 px-4 py-2 rounded-lg mb-1 text-left transition-colors",
                pathname === item.path
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 mt-4 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </Button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">{children}</div>
    </div>
  );
}
