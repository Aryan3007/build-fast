import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

// GET /api/projects - List user's projects
export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Get user from database
        const user = await prisma.user.findUnique({
            where: { clerkId: userId },
        });

        if (!user) {
            return NextResponse.json(
                { success: false, error: "User not found" },
                { status: 404 }
            );
        }

        // Fetch user's projects
        const projects = await prisma.project.findMany({
            where: { userId: user.id },
            include: {
                pages: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        order: true,
                    },
                    orderBy: { order: 'asc' },
                },
            },
            orderBy: { updatedAt: 'desc' },
        });

        return NextResponse.json({
            success: true,
            projects,
        });
    } catch (error) {
        console.error("Get projects error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}

// POST /api/projects - Create new project
export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Get user from database
        const user = await prisma.user.findUnique({
            where: { clerkId: userId },
        });

        if (!user) {
            return NextResponse.json(
                { success: false, error: "User not found" },
                { status: 404 }
            );
        }

        const body = await req.json();
        const { name, description, language, pageCount, sitemap, pages } = body;

        // Validate inputs
        if (!name || typeof name !== "string") {
            return NextResponse.json(
                { success: false, error: "Project name is required" },
                { status: 400 }
            );
        }

        // Create project with pages
        const project = await prisma.project.create({
            data: {
                name,
                description,
                language: language || "en",
                pageCount: pageCount || 3,
                sitemap: sitemap ? JSON.stringify(sitemap) : null,
                userId: user.id,
                pages: pages ? {
                    create: pages.map((page: any, index: number) => ({
                        name: page.name,
                        slug: page.slug,
                        order: index,
                        sections: JSON.stringify(page.sections || []),
                    })),
                } : undefined,
            },
            include: {
                pages: true,
            },
        });

        return NextResponse.json({
            success: true,
            project,
        });
    } catch (error) {
        console.error("Create project error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}
