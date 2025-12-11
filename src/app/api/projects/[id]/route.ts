import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

// GET /api/projects/[id] - Get single project
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { clerkId: userId },
        });

        if (!user) {
            return NextResponse.json(
                { success: false, error: "User not found" },
                { status: 404 }
            );
        }

        const { id } = await params;

        const project = await prisma.project.findFirst({
            where: {
                id,
                userId: user.id,
            },
            include: {
                pages: {
                    orderBy: { order: 'asc' },
                },
            },
        });

        if (!project) {
            return NextResponse.json(
                { success: false, error: "Project not found" },
                { status: 404 }
            );
        }

        // Parse JSON fields
        const projectData = {
            ...project,
            sitemap: project.sitemap ? JSON.parse(project.sitemap) : null,
            pages: project.pages.map(page => ({
                ...page,
                sections: JSON.parse(page.sections),
            })),
        };

        return NextResponse.json({
            success: true,
            project: projectData,
        });
    } catch (error) {
        console.error("Get project error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}

// PUT /api/projects/[id] - Update project
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }

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
        const { name, description, sitemap } = body;

        const { id } = await params;

        const project = await prisma.project.updateMany({
            where: {
                id,
                userId: user.id,
            },
            data: {
                ...(name && { name }),
                ...(description !== undefined && { description }),
                ...(sitemap && { sitemap: JSON.stringify(sitemap) }),
                updatedAt: new Date(),
            },
        });

        if (project.count === 0) {
            return NextResponse.json(
                { success: false, error: "Project not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
        });
    } catch (error) {
        console.error("Update project error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}

// DELETE /api/projects/[id] - Delete project
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { clerkId: userId },
        });

        if (!user) {
            return NextResponse.json(
                { success: false, error: "User not found" },
                { status: 404 }
            );
        }

        const { id } = await params;

        const project = await prisma.project.deleteMany({
            where: {
                id,
                userId: user.id,
            },
        });

        if (project.count === 0) {
            return NextResponse.json(
                { success: false, error: "Project not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
        });
    } catch (error) {
        console.error("Delete project error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}
