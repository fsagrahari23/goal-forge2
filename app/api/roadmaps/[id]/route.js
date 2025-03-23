import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { connectToDatabase } from "@/lib/mongodb";
import Roadmap from "@/models/Roadmap";
import { authOptions } from "../../../../config/authOptions";


export async function GET( req,{ params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const roadmap = await Roadmap.findOne({
      _id: (await params).id,
      userId: session.user.id,
    });

    if (!roadmap) {
      return NextResponse.json(
        { success: false, message: "Roadmap not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        roadmap,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Roadmap fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching roadmap" },
      { status: 500 }
    );
  }
}
