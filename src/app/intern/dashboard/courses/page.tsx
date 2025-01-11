"use client";
import React from "react";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, Globe } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Define TypeScript interfaces
interface Course {
  name: string;
  videos: string[];
  tags: string[];
  access: "PUBLIC" | "PRIVATE";
  accessor?: string[];
}

interface Module {
  moduleName: string;
  content: Course[];
}

const CoursesPage = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("/api/courses");
        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }
        const data = await response.json();
        console.log(data);
        setModules(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch courses"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading courses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!modules || modules.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">No courses available</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Available Courses</h1>

      <div className="grid gap-6">
        {modules.map((module, index) => (
          <Card key={index} className="w-full">
            <CardHeader>
              <CardTitle>{module.moduleName}</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible>
                {module.content.map((course, courseIndex) => (
                  <AccordionItem
                    key={courseIndex}
                    value={`item-${courseIndex}`}
                  >
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-2">
                        {course.name}
                        {course.access === "PRIVATE" ? (
                          <Lock className="h-4 w-4" />
                        ) : (
                          <Globe className="h-4 w-4" />
                        )}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                          {course.tags.map((tag, tagIndex) => (
                            <Badge key={tagIndex} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        {course.access === "PUBLIC" && course.accessor && (
                          <div className="text-sm text-muted-foreground">
                            Available for: {course.accessor.join(", ")}
                          </div>
                        )}

                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">
                            Course Videos:
                          </h4>
                          <ul className="list-disc pl-4 space-y-1">
                            {course.videos.map((video, videoIndex) => (
                              <li
                                key={videoIndex}
                                className="text-sm text-blue-500 hover:underline"
                              >
                                Video {videoIndex + 1}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CoursesPage;
