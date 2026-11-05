import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const setting = await prisma.systemSetting.findUnique({
      where: { key: "setup_completed" },
    });

    const userCount = await prisma.user.count();

    return NextResponse.json({
      setupCompleted: setting?.value === "true" || userCount > 0,
    });
  } catch {
    // DB not ready yet
    return NextResponse.json({ setupCompleted: false });
  }
}
