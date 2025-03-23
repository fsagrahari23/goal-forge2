import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  BookOpen,
  CheckCircle,
  CalendarIcon,
} from "lucide-react";
import React from "react";

export function PhaseView({ phases }) {
  // Determine today's date
  const today = new Date();

  // Determine phase status based on its start and end dates
  const getPhaseStatus = (phase) => {
    const startDate = new Date(phase.startDate);
    const endDate = new Date(phase.endDate);

    if (today > endDate) return "completed";
    if (today >= startDate && today <= endDate) return "current";
    return "upcoming";
  };

  const [currentPhase, setCurrentPhase] = React.useState(null);

  // Calculate the progress percentage for a phase
  const getPhaseProgress = (phase) => {
    const status = getPhaseStatus(phase);
    if (status === "completed") return 100;
    if (status === "upcoming") return 0;

    const startDate = new Date(phase.startDate);
    const endDate = new Date(phase.endDate);
    const totalDays = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const daysElapsed = Math.ceil(
      (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    return Math.min(
      Math.max(Math.round((daysElapsed / totalDays) * 100), 0),
      100
    );
  };
 console.log(phases)
  // Determine the default tab: current phase if available, else the first phase
  const currentPhaseIndex = phases.findIndex(
    (phase) => getPhaseStatus(phase) === "current"
  );
  const defaultPhase = currentPhaseIndex >= 0 ? currentPhaseIndex : 0;

  React.useEffect(() => {
    setCurrentPhase(phases[currentPhaseIndex]);
  }, [currentPhaseIndex, phases]);

  return (
    <Tabs defaultValue={defaultPhase.toString()} className="w-full">
      <TabsList className="w-full h-auto flex flex-wrap mb-6">
        {phases.map((phase, index) => {
          const status = getPhaseStatus(phase);
          return (
            <TabsTrigger
              key={index}
              value={index.toString()}
              className={`${
                status === "current"
                  ? "border-primary text-primary"
                  : status === "completed"
                  ? "border-green-500 text-green-600"
                  : ""
              }`}
            >
              {status === "completed" && (
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
              )}
              {phase.phase.split(":")[0] || `Phase ${index + 1}`}
            </TabsTrigger>
          );
        })}
      </TabsList>

      {phases.map((phase, phaseIndex) => {
        const status = getPhaseStatus(phase);
        const progress = getPhaseProgress(phase);

        return (
          <TabsContent
            key={phaseIndex}
            value={phaseIndex.toString()}
            className="space-y-6"
          >
            {/* Phase Overview Card */}
            <Card
              className={
                status === "current"
                  ? "border-primary"
                  : status === "completed"
                  ? "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30"
                  : ""
              }
            >
              <CardHeader>
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <CardTitle className="text-xl md:text-2xl">
                      {phase.phase}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(phase.startDate).toLocaleDateString()} -{" "}
                      {new Date(phase.endDate).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <Badge
                    className={
                      status === "current"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                        : status === "completed"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
                    }
                  >
                    {status === "current"
                      ? "In Progress"
                      : status === "completed"
                      ? "Completed"
                      : "Upcoming"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Objective:</h4>
                    <p className="text-sm text-muted-foreground">
                      {phase.objective || phase.task || "No objective provided"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span>Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Daily Tasks Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <CalendarIcon className="mr-2 h-5 w-5" />
                Daily Tasks for{" "}
                {phase.phase.split(":")[0] || `Phase ${phaseIndex + 1}`}
              </h3>

              <div className="space-y-4">
                {phase.tasks && phase.tasks.length > 0 ? (
                  phase.tasks.map((task, taskIndex) => {
                    const taskDate = new Date(task.dateOfDayNo);
                    const isToday =
                      new Date().toDateString() === taskDate.toDateString();
                    const isPast = taskDate < new Date();

                    return (
                      <Card
                        key={taskIndex}
                        className={`${
                          isToday
                            ? "border-primary bg-primary/5"
                            : isPast
                            ? "border-green-200 bg-green-50/50 dark:bg-green-950/10"
                            : ""
                        }`}
                      >
                        <CardContent className="p-4">
                          <div className="flex flex-col gap-3">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant={isToday ? "default" : "outline"}
                                >
                                  Day {task.dayNo}
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                  {task.dateOfDayNo
                                    ? new Date(
                                        task.dateOfDayNo
                                      ).toLocaleDateString()
                                    : ""}
                                </span>
                                {isToday && (
                                  <Badge variant="secondary" className="ml-2">
                                    Today
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                <span>{task.estimated_hours || 2} hours</span>
                              </div>
                            </div>

                            <div className="bg-background dark:bg-gray-950 p-3 rounded-md">
                              <p className="text-sm">{task.task_description}</p>
                            </div>

                            {task.resources_needed &&
                              task.resources_needed.length > 0 && (
                                <div>
                                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                                    <BookOpen className="h-4 w-4" />
                                    <span>Resources:</span>
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    {task.resources_needed.map(
                                      (resource, i) => (
                                        <Badge
                                          key={i}
                                          variant="outline"
                                          className="text-xs"
                                        >
                                          {resource}
                                        </Badge>
                                      )
                                    )}
                                  </div>
                                </div>
                              )}

                            {task.is_review_assignment && (
                              <Badge variant="secondary" className="w-fit">
                                Review Assignment
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                ) : (
                  <Card>
                    <CardContent className="p-6 text-center text-muted-foreground">
                      <p>No daily tasks available for this phase</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
