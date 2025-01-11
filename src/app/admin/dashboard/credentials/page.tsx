"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RefreshCw } from "lucide-react";

export default function Credentials() {
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const generatePassword = () => {
    const length = 12;
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setGeneratedPassword(password);
    setPassword(password); // Set the generated password to input
  };

  const handleSubmit = async () => {
    if (!username || !password || !role) {
      alert("All fields are required!");
      return;
    }

    try {
      let company = localStorage.getItem("company");
      const response = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, role, company }),
      });

      if (response.ok) {
        const responseData = await response.json();
        setSuccessMessage(
          `Credential added successfully! User: ${responseData.addedRole.username} Password: ${responseData.addedRole.password} `
        );
        // Clear fields
        setUsername("");
        setPassword("");
        setGeneratedPassword("");
        setRole("");
      } else {
        throw new Error("Failed to add credential.");
      }
    } catch (error: any) {
      alert("An error occurred: " + error.message);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Credential</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="newUsername">Username</Label>
          <Input
            id="newUsername"
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="newPassword">Password</Label>
          <div className="flex gap-2">
            <Input
              id="newPassword"
              type="text"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              variant="outline"
              onClick={generatePassword}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Generate
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select onValueChange={(value) => setRole(value)} value={role}>
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="INTERN">Intern</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button className="w-full" onClick={handleSubmit}>
          Add Credential
        </Button>

        {successMessage && (
          <p className="text-green-500 text-center mt-4">{successMessage}</p>
        )}
      </CardContent>
    </Card>
  );
}
