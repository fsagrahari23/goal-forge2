// pages/api/roadmap.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { connectToDatabase } from "@/lib/mongodb";
import Roadmap from "@/models/Roadmap";

import { getTasksPhasesWithDailyTasksShedule } from "../../../lib/generative-ai";
import { authOptions } from "../../../config/authOptions";

export async function POST(request) {
  try {
    // Verify user session
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    // Parse the request body
    const { title, description, prompt } = await request.json();
    console.log(title ,description, prompt )
    const tasksPhasesWithDailyTasksSchedule =
      await getTasksPhasesWithDailyTasksShedule(prompt);

    if (
      !tasksPhasesWithDailyTasksSchedule ||
      tasksPhasesWithDailyTasksSchedule.status !== "success"
    ) {
      return NextResponse.json(
        { success: false, message: "Error generating roadmap" },
        { status: 500 }
      );
    }

    // console.log(tasksPhasesWithDailyTasksSchedule);

    // Connect to MongoDB
    await connectToDatabase();

    // Extract start date and number of days
    const startDate = new Date(tasksPhasesWithDailyTasksSchedule["Start Date"]);
    const numberOfDays = tasksPhasesWithDailyTasksSchedule["Number of Days"];

    // Transform phases and tasks into correct schema format
    const formattedPhases = tasksPhasesWithDailyTasksSchedule.Phases.map(
      (phase) => ({
        phase: phase.Phase,
        objective: phase.objective || "",
        durationInDays: phase["Duration (Days)"],
        startDate: new Date(phase["Start Date"]),
        endDate: new Date(phase["End Date"]),
        task: phase.Task || "",
        tasks: phase.tasks.map((task) => ({
          dayNo: task["Day No"], // Auto-increment day number
          dateOfDayNo: new Date(task["Date of Day No"]), // Ensure Date format
          task_description: task.task_description || "",
          is_review_assignment: task.is_review_assignment || false,
          estimated_hours: task.estimated_hours || 0,
          resources_needed: task.resources_needed || [],
        })),
      })
    );

    // Assemble the full roadmap data
    const roadmapData = {
      userId: session.user.id,
      title,
      description,
      startDate,
      numberOfDays,
      phases: formattedPhases,
    };

    // Save the roadmap document
    const roadmap = await Roadmap.create(roadmapData);

    return NextResponse.json(
      {
        success: true,
        message: "Roadmap created successfully",
        roadmap,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Roadmap creation error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error creating roadmap",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const roadmaps = await Roadmap.find({ userId: session.user.id }).sort({
      createdAt: -1,
    });

    return NextResponse.json({ success: true, roadmaps }, { status: 200 });
  } catch (error) {
    console.error("Roadmap fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching roadmaps" },
      { status: 500 }
    );
  }
}
