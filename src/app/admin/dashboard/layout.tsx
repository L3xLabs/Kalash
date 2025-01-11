"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogOut, UserPlus, Book, Users, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminLayout({
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

      if (!role || role !== "ADMIN") {
        router.push("/");
      } else {
        setUsername(storedUsername || "");
      }
    }
  }, [router]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("username");
      localStorage.removeItem("role");
      router.push("/");
    }
  };

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin/dashboard",
    },
    {
      id: "credentials",
      label: "Add Credentials",
      icon: UserPlus,
      path: "/admin/dashboard/credentials",
    },
    {
      id: "modules",
      label: "Add Modules",
      icon: Book,
      path: "/admin/dashboard/modules",
    },
    {
      id: "teams",
      label: "Approve Teams",
      icon: Users,
      path: "/admin/dashboard/teams",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar */}
      <div className="w-64 bg-white border-r min-h-screen">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold">Admin Panel</h1>
          {username && (
            <p className="text-sm text-gray-500 mt-1">Welcome, {username}</p>
          )}
        </div>
        <nav className="p-4">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              href={item.path}
              className={cn(
                "w-full flex items-center gap-2 px-4 py-2 rounded-lg mb-1 text-left",
                pathname === item.path
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50"
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
