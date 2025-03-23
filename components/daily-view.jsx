import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle2, Circle } from "lucide-react";

export function DailyView({ tasks }) {
  // Determine if a task is for today, past, or future
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getTaskStatus = (task) => {
    const taskDate = new Date(task.Date);
    taskDate.setHours(0, 0, 0, 0);

    if (taskDate.getTime() === today.getTime()) return "today";
    if (taskDate < today) return "past";
    return "future";
  };

  return (
    <div className="space-y-4">
      {tasks.map((task, index) => {
        const status = getTaskStatus(task);

        return (
          <Card
            key={index}
            className={
              status === "today"
                ? "border-primary"
                : status === "past"
                ? "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30"
                : ""
            }
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base">Day {task.Day}</CardTitle>
                  {status === "today" && (
                    <Badge
                      variant="outline"
                      className="bg-primary text-primary-foreground"
                    >
                      Today
                    </Badge>
                  )}
                </div>
                <CardDescription className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(task.Date).toLocaleDateString()}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                {status === "past" ? (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                ) : (
                  <Circle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                )}
                <p className="text-sm">{task.Task}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
