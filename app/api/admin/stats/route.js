import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import Roadmap from "@/models/Roadmap";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user.isAdmin) {
      return NextResponse.json(
        { success: false, message: "Not authorized" },
        { status: 403 }
      );
    }

    await connectToDatabase();

    // Get total users
    const totalUsers = await User.countDocuments();

    // Get total roadmaps
    const totalRoadmaps = await Roadmap.countDocuments();

    // Get new users in the last 7 days
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    const newUsers = await User.countDocuments({
      createdAt: { $gte: lastWeek },
    });

    // Get new roadmaps in the last 7 days
    const newRoadmaps = await Roadmap.countDocuments({
      createdAt: { $gte: lastWeek },
    });

    // Get roadmaps per user (average)
    const roadmapsPerUser =
      totalUsers > 0 ? (totalRoadmaps / totalUsers).toFixed(2) : 0;

    // Get monthly roadmap creation data for the chart
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyRoadmaps = await Roadmap.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // Format monthly data for chart
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const chartData = monthlyRoadmaps.map((item) => ({
      month: monthNames[item._id.month - 1],
      count: item.count,
    }));

    // Get user growth data
    const monthlyUsers = await User.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // Format user growth data for chart
    const userGrowthData = monthlyUsers.map((item) => ({
      month: monthNames[item._id.month - 1],
      count: item.count,
    }));

    return NextResponse.json(
      {
        success: true,
        stats: {
          totalUsers,
          totalRoadmaps,
          newUsers,
          newRoadmaps,
          roadmapsPerUser,
          chartData,
          userGrowthData,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Stats fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching statistics" },
      { status: 500 }
    );
  }
}
