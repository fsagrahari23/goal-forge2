"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ChevronLeft, Loader2 } from "lucide-react";
import { PhaseView } from "@/components/phase-view";
import { DailyView } from "@/components/daily-view";

export default function RoadmapDetailPage({ params }) {
  const router = useRouter();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const res = await fetch(`/api/roadmaps/${params.id}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch roadmap");
        }

        setRoadmap(data.roadmap);
      } catch (err) {
        setError("Failed to load roadmap");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmap();
  }, [params.id]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">
          {loading ? "Loading..." : roadmap?.title}
        </h1>
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : roadmap ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Overview</CardTitle>
              <CardDescription>
                {new Date(roadmap["Start Date"]).toLocaleDateString()} •{" "}
                {roadmap["Number of Days"]} days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {roadmap.description || "No description provided"}
              </p>
            </CardContent>
          </Card>

          <Tabs defaultValue="phases">
            <TabsList>
              <TabsTrigger value="phases">Phases</TabsTrigger>
            </TabsList>
            <TabsContent value="phases" className="mt-4">
              <PhaseView phases={roadmap.phases} />
            </TabsContent>
            <TabsContent value="daily" className="mt-4">
              <DailyView tasks={roadmap.Tasks} />
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <div className="rounded-lg border p-4 text-center">
          Roadmap not found
        </div>
      )}
    </div>
  );
}
