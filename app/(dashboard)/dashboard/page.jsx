"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Calendar, Loader2, PlusCircle, Map, Clock } from "lucide-react";

export default function DashboardPage() {
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        const res = await fetch("/api/roadmaps");
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

  // Prepare data for the chart
  const prepareChartData = () => {
    if (!roadmaps.length) return [];

    // Group roadmaps by month
    const groupedByMonth = roadmaps.reduce((acc, roadmap) => {
      const date = new Date(roadmap.createdAt);
      const monthYear = `${date.toLocaleString("default", {
        month: "short",
      })} ${date.getFullYear()}`;

      if (!acc[monthYear]) {
        acc[monthYear] = 0;
      }

      acc[monthYear]++;
      return acc;
    }, {});

    // Convert to array for chart
    return Object.entries(groupedByMonth).map(([month, count]) => ({
      month,
      count,
    }));
  };

  const chartData = prepareChartData();

  // Calculate statistics
  const totalRoadmaps = roadmaps.length;
  const totalDays = roadmaps.reduce(
    (sum, roadmap) => sum + roadmap.numberOfDays,
    0
  );
  const averageDuration = totalRoadmaps
    ? (totalDays / totalRoadmaps).toFixed(1)
    : 0;

  // Get recent roadmaps
  const recentRoadmaps = [...roadmaps]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Link href="/dashboard/create">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Roadmap
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-600 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
          {error}
        </div>
      ) : roadmaps.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Calendar className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-xl font-semibold">No roadmaps yet</h3>
            <p className="mb-4 text-center text-muted-foreground">
              Create your first roadmap to get started
            </p>
            <Link href="/dashboard/create">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Roadmap
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Roadmaps
                </CardTitle>
                <Map className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalRoadmaps}</div>
                <p className="text-xs text-muted-foreground">
                  Roadmaps created
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Average Duration
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{averageDuration} days</div>
                <p className="text-xs text-muted-foreground">
                  Average roadmap duration
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Days Planned
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalDays}</div>
                <p className="text-xs text-muted-foreground">
                  Days of work planned
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1 md:col-span-1">
              <CardHeader>
                <CardTitle>Recent Roadmaps</CardTitle>
                <CardDescription>
                  Your most recently created roadmaps
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentRoadmaps.map((roadmap) => (
                    <div key={roadmap._id} className="flex items-center">
                      <div className="mr-4 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                        <Map className="h-5 w-5 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <Link
                          href={`/dashboard/roadmaps/${roadmap._id}`}
                          className="font-medium hover:underline"
                        >
                          {roadmap.title}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          {new Date(roadmap.createdAt).toLocaleDateString()} •{" "}
                          {roadmap["Number of Days"]} days
                        </p>
                      </div>
                    </div>
                  ))}

                  <div className="mt-4 text-center">
                    <Link href="/dashboard/roadmaps">
                      <Button variant="outline" size="sm">
                        View All Roadmaps
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-1 md:col-span-1">
              <CardHeader>
                <CardTitle>Roadmap Creation</CardTitle>
                <CardDescription>
                  Number of roadmaps created over time
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="count"
                        name="Roadmaps Created"
                        fill="#8884d8"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-muted-foreground">
                      Not enough data to display chart
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <h2 className="mb-4 text-2xl font-semibold">
              Explore Your Roadmaps
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {roadmaps.slice(0, 6).map((roadmap) => (
                <Link
                  key={roadmap._id}
                  href={`/dashboard/roadmaps/${roadmap._id}`}
                >
                  <Card className="h-full cursor-pointer transition-shadow hover:shadow-md">
                    <CardHeader>
                      <CardTitle>{roadmap.title}</CardTitle>
                      <CardDescription>
                        {new Date(roadmap["Start Date"]).toLocaleDateString()} •{" "}
                        {roadmap["Number of Days"]} days
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="line-clamp-3 text-sm text-muted-foreground">
                        {roadmap.description || "No description provided"}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {roadmaps.length > 6 && (
              <div className="mt-6 text-center">
                <Link href="/dashboard/roadmaps">
                  <Button variant="outline">View All Roadmaps</Button>
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
