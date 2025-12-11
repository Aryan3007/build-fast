import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        // Check authentication
        const user = await currentUser();
        if (!user) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Get user from database
        const dbUser = await prisma.user.findUnique({
            where: { clerkId: user.id },
        });

        if (!dbUser) {
            return NextResponse.json({
                success: true,
                templates: [],
            });
        }

        // Fetch user templates
        const templates = await prisma.userTemplate.findMany({
            where: { userId: dbUser.id },
            orderBy: { updatedAt: "desc" },
            select: {
                id: true,
                name: true,
                description: true,
                thumbnail: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return NextResponse.json({
            success: true,
            templates,
        });
    } catch (error) {
        console.error("Get user templates API error:", error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : "Internal server error",
            },
            { status: 500 }
        );
    }
}

// Get a specific template by ID
export async function POST(req: NextRequest) {
    try {
        const user = await currentUser();
        if (!user) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await req.json();
        const { templateId } = body;

        if (!templateId) {
            return NextResponse.json(
                { success: false, error: "Template ID is required" },
                { status: 400 }
            );
        }

        const template = await prisma.userTemplate.findUnique({
            where: { id: templateId },
        });

        if (!template) {
            return NextResponse.json(
                { success: false, error: "Template not found" },
                { status: 404 }
            );
        }

        // Parse blocks from JSON
        const blocks = JSON.parse(template.content);

        return NextResponse.json({
            success: true,
            template: {
                id: template.id,
                name: template.name,
                description: template.description,
                blocks,
                thumbnail: template.thumbnail,
                createdAt: template.createdAt,
                updatedAt: template.updatedAt,
            },
        });
    } catch (error) {
        console.error("Get template by ID API error:", error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : "Internal server error",
            },
            { status: 500 }
        );
    }
}
