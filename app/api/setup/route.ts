import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { execSync } from "child_process";

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

export async function POST(req: NextRequest) {
  try {
    // Check if already set up
    const existingUsers = await prisma.user.count().catch(() => 0);
    if (existingUsers > 0) {
      return NextResponse.json(
        { error: "Setup has already been completed." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;

    // Push schema to database (works without migrate CLI in many cases)
    try {
      // Prisma db push is ideal here; we rely on postinstall + generate
      // The schema is already generated via postinstall
      await prisma.$executeRawUnsafe(`SELECT 1`); // connectivity check
    } catch (e) {
      console.error("DB connection error during setup:", e);
      return NextResponse.json(
        {
          error:
            "Cannot connect to database. Please check DATABASE_URL in Vercel environment variables.",
        },
        { status: 500 }
      );
    }

    // Ensure roles exist (seed may not have run)
    let superAdminRole = await prisma.role.findUnique({
      where: { name: "Super Admin" },
    });

    if (!superAdminRole) {
      // Minimal bootstrap: create Super Admin role
      superAdminRole = await prisma.role.create({
        data: {
          name: "Super Admin",
          description: "Full access",
          isSystem: true,
        },
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        passwordHash,
        isActive: true,
        roles: {
          create: {
            roleId: superAdminRole.id,
          },
        },
      },
    });

    // Mark setup complete
    await prisma.systemSetting.upsert({
      where: { key: "setup_completed" },
      update: { value: "true" },
      create: { key: "setup_completed", value: "true" },
    });

    // Attempt to seed event data if not present
    try {
      const eventCount = await prisma.event.count();
      if (eventCount === 0) {
        // Minimal event so site works
        await prisma.event.create({
          data: {
            id: "ceo-conclave-2027-main",
            name: "THE CEO CONCLAVE 2027",
            tagline: "One Platform. Powerful Perspectives.",
            vision:
              "To connect India's business leaders, encourage powerful discussions and inspire the next generation of entrepreneurs.",
            aboutText:
              "The CEO Conclave 2027 is an exclusive two-day business leadership event that brings together prominent CEOs, entrepreneurs, founders and industry experts from across India.",
            disclaimer:
              "Dates, venue booking, speaker participation, sponsorships and attendance are proposed and subject to confirmation. All six speakers are proposed invitees, not confirmed speakers.",
            startDate: new Date("2027-01-22"),
            endDate: new Date("2027-01-23"),
          },
        });
      }
    } catch (seedErr) {
      console.warn("Optional seed during setup failed:", seedErr);
    }

    return NextResponse.json({
      success: true,
      message: "Super Admin created successfully",
      userId: user.id,
    });
  } catch (error: any) {
    console.error("Setup error:", error);
    return NextResponse.json(
      {
        error:
          error?.message?.includes("Unique constraint")
            ? "A user with this email already exists."
            : "Setup failed. Please check logs and environment variables.",
      },
      { status: 500 }
    );
  }
}
