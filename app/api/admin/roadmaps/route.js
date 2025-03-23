import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { connectToDatabase } from "@/lib/mongodb";
import Roadmap from "@/models/Roadmap";
import User from "@/models/User";
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

    // Get all roadmaps with user information
    const roadmaps = await Roadmap.find().sort({ createdAt: -1 });

    // Get user information for each roadmap
    const roadmapsWithUserInfo = await Promise.all(
      roadmaps.map(async (roadmap) => {
        const user = await User.findById(roadmap.userId).select("name email");
        return {
          ...roadmap.toObject(),
          userName: user ? user.name : "Unknown",
          userEmail: user ? user.email : "Unknown",
        };
      })
    );

    return NextResponse.json(
      {
        success: true,
        roadmaps: roadmapsWithUserInfo,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Roadmaps fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching roadmaps" },
      { status: 500 }
    );
  }
}
