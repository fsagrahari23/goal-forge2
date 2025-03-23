"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, MoreHorizontal, Search } from "lucide-react";

export default function AdminRoadmapsPage() {
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        const res = await fetch("/api/admin/roadmaps");
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch roadmaps");
        }

        setRoadmaps(data.roadmaps);
      } catch (err) {
        setError("Failed to load roadmaps");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmaps();
  }, []);

  // Filter roadmaps based on search term
  const filteredRoadmaps = roadmaps.filter(
    (roadmap) =>
      roadmap.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (roadmap.description &&
        roadmap.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      roadmap.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      roadmap.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold">Manage Roadmaps</h1>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search roadmaps..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Roadmaps</CardTitle>
            <CardDescription>
              Manage all roadmaps in the system. Total:{" "}
              {filteredRoadmaps.length} roadmaps
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRoadmaps.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No roadmaps found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRoadmaps.map((roadmap) => (
                      <TableRow key={roadmap._id}>
                        <TableCell className="font-medium">
                          {roadmap.title}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{roadmap.userName}</span>
                            <span className="text-xs text-muted-foreground">
                              {roadmap.userEmail}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(roadmap["Start Date"]).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{roadmap["Number of Days"]} days</TableCell>
                        <TableCell>
                          {new Date(roadmap.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                Delete Roadmap
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
