"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface ModuleData {
  moduleName: string;
  content: {
    name: string;
    videos: string[];
    tags: string[];
    access: string;
    accessor?: string[];
    summaryPdf?: string; // Optional PDF file path
  }[];
}

interface ApiResponse {
  message: string;
  addedModule: ModuleData;
}

export default function Modules() {
  const [moduleName, setModuleName] = useState<string>("");
  const [contentName, setContentName] = useState<string>("");
  const [videos, setVideos] = useState<string>("");
  const [tags, setTags] = useState<string>("");
  const [access, setAccess] = useState<string>("");
  const [accessor, setAccessor] = useState<string[]>([]);
  const [summaryPdf, setSummaryPdf] = useState<File | null>(null);
  const [responseMessage, setResponseMessage] = useState<ApiResponse | null>(
    null
  );

  const handleCheckboxChange = (company: string) => {
    setAccessor((prev) =>
      prev.includes(company)
        ? prev.filter((item) => item !== company)
        : [...prev, company]
    );
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("moduleName", moduleName);
    formData.append("contentName", contentName);
    formData.append("videos", videos);
    formData.append("tags", tags);
    formData.append("access", access);
    if (access === "PUBLIC") {
      formData.append("accessor", JSON.stringify(accessor));
    }
    if (summaryPdf) {
      formData.append("summaryPdf", summaryPdf);
    }

    try {
      const response = await fetch("/api/module", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data: ApiResponse = await response.json();
        setResponseMessage(data);

        // Reset fields
        setModuleName("");
        setContentName("");
        setVideos("");
        setTags("");
        setAccess("");
        setAccessor([]);
        setSummaryPdf(null);
      } else {
        throw new Error("Failed to add module.");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert("An error occurred: " + error.message);
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Module</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="moduleName">Module Name</Label>
            <Input
              id="moduleName"
              value={moduleName}
              onChange={(e) => setModuleName(e.target.value)}
              placeholder="Enter module name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contentName">Content Name</Label>
            <Input
              id="contentName"
              value={contentName}
              onChange={(e) => setContentName(e.target.value)}
              placeholder="Enter content name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="videos">Video Links</Label>
            <Textarea
              id="videos"
              value={videos}
              onChange={(e) => setVideos(e.target.value)}
              placeholder="Enter video links, one per line"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Textarea
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Enter tags separated by commas"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="access">Access</Label>
            <Select onValueChange={(value) => setAccess(value)}>
              <SelectTrigger id="access">
                <SelectValue placeholder="Select access level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PUBLIC">Public</SelectItem>
                <SelectItem value="PRIVATE">Private</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {access === "PUBLIC" && (
            <div className="space-y-2">
              <Label>Accessor</Label>
              <div className="space-y-1">
                {["Google", "Infosys", "Microsoft", "Amazon"].map((company) => (
                  <div key={company} className="flex items-center space-x-2">
                    <Checkbox
                      id={company}
                      checked={accessor.includes(company)}
                      onCheckedChange={() => handleCheckboxChange(company)}
                    />
                    <Label htmlFor={company}>{company}</Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="summaryPdf">Module Summary (Optional)</Label>
            <Input
              id="summaryPdf"
              type="file"
              accept=".pdf"
              onChange={(e) =>
                setSummaryPdf(e.target.files ? e.target.files[0] : null)
              }
            />
          </div>

          <Button className="w-full" onClick={handleSubmit}>
            Add Module
          </Button>
        </CardContent>
      </Card>

      {responseMessage && (
        <p className="text-green-500 text-center mt-4">
          {" "}
          Added {responseMessage.addedModule.moduleName} !
        </p>
      )}
    </div>
  );
}
