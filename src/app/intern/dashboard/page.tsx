// app/intern/dashboard/page.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BrainCircuit, BookOpen, Users, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function DashboardPage() {
  const quickActions = [
    {
      title: "Take Team Match Quiz",
      icon: BrainCircuit,
      description: "Find your ideal team members",
      link: "/intern/dashboard/quiz",
      color: "text-purple-600",
    },
    {
      title: "View Courses",
      icon: BookOpen,
      description: "Access your learning materials",
      link: "/intern/dashboard/courses",
      color: "text-blue-600",
    },
    {
      title: "Team Overview",
      icon: Users,
      description: "Check your team status",
      link: "/intern/teams",
      color: "text-green-600",
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Intern Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.link}>
                <Card className="hover:bg-gray-50 transition-colors cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "p-2 rounded-lg bg-white shadow-sm",
                          action.color
                        )}
                      >
                        <action.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-medium">{action.title}</h3>
                        <p className="text-sm text-gray-500">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <div>
                  <p className="text-sm font-medium">Completed Module 1</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <div>
                  <p className="text-sm font-medium">Team Meeting Scheduled</p>
                  <p className="text-xs text-gray-500">Yesterday</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-purple-500" />
                <div>
                  <p className="text-sm font-medium">Quiz Completion</p>
                  <p className="text-xs text-gray-500">2 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Project Submission</p>
                  <p className="text-xs text-gray-500">Module 2</p>
                </div>
                <p className="text-sm text-red-500">2 days left</p>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Team Presentation</p>
                  <p className="text-xs text-gray-500">Sprint Review</p>
                </div>
                <p className="text-sm text-orange-500">5 days left</p>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Course Completion</p>
                  <p className="text-xs text-gray-500">Web Development</p>
                </div>
                <p className="text-sm text-green-500">2 weeks left</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
