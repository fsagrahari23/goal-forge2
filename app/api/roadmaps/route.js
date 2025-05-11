import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { connectToDatabase } from "@/lib/mongodb";
import Roadmap from "@/models/Roadmap";
import User from "@/models/User";
import { google } from "googleapis";
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

    // Generate roadmap tasks and phases
    const tasksPhasesWithDailyTasksSchedule =
      await getTasksPhasesWithDailyTasksShedule(prompt);

    if (
      !tasksPhasesWithDailyTasksSchedule ||
      tasksPhasesWithDailyTasksSchedule.status !== "success"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Error generating roadmap or timeout occurred",
        },
        { status: 500 }
      );
    }

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
          dayNo: task["Day No"],
          dateOfDayNo: new Date(task["Date of Day No"]),
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

    // Save roadmap to MongoDB
    const roadmap = await Roadmap.create(roadmapData);

    // Fetch user's Google tokens
    const user = await User.findById(session.user.id);
    if (!user.googleTokens || !user.googleTokens.accessToken) {
      return NextResponse.json(
        {
          success: true,
          message: "Roadmap created, but Google Calendar not linked",
          roadmap,
        },
        { status: 201 }
      );
    }

    // Set up Google Calendar API
    const auth = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
    auth.setCredentials({
      access_token: user.googleTokens.accessToken,
      refresh_token: user.googleTokens.refreshToken,
    });

    // Refresh token if expired
    if (Date.now() > user.googleTokens.expiryDate) {
      const { credentials } = await auth.refreshAccessToken();
      await User.findByIdAndUpdate(user._id, {
        googleTokens: {
          accessToken: credentials.access_token,
          refreshToken:
            credentials.refresh_token || user.googleTokens.refreshToken,
          expiryDate: credentials.expiry_date,
        },
      });
      auth.setCredentials({
        access_token: credentials.access_token,
        refresh_token: credentials.refresh_token,
      });
    }

    const calendar = google.calendar({ version: "v3", auth });

    // Create Google Calendar events for each task
    for (const phase of formattedPhases) {
      for (const task of phase.tasks) {
        const event = {
          summary: `${title} - ${phase.phase}: ${task.task_description}`,
          description: `Part of roadmap: ${description}`,
          start: {
            dateTime: task.dateOfDayNo.toISOString(),
            timeZone: "Asia/Kolkata", // Adjust as needed
          },
          end: {
            dateTime: new Date(
              task.dateOfDayNo.getTime() + task.estimated_hours * 60 * 60 * 1000
            ).toISOString(),
            timeZone: "Asia/Kolkata",
          },
        };

        await calendar.events.insert({
          calendarId: "primary",
          resource: event,
        });
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Roadmap created and synced with Google Calendar",
        roadmap,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Roadmap creation error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error creating roadmap or syncing with Google Calendar",
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
