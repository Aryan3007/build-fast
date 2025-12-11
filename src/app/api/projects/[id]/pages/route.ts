import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(
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

        const { id: projectId } = await params;

        // Verify project ownership
        const project = await prisma.project.findUnique({
            where: { id: projectId },
            include: { user: true }
        });

        if (!project || project.user.clerkId !== userId) {
            return NextResponse.json(
                { success: false, error: "Project not found or unauthorized" },
                { status: 404 }
            );
        }

        // Parse request body
        const body = await req.json();
        const { name, slug, order } = body;

        if (!name || !slug) {
            return NextResponse.json(
                { success: false, error: "Name and slug are required" },
                { status: 400 }
            );
        }

        // Create new page
        const newPage = await prisma.projectPage.create({
            data: {
                projectId,
                name,
                slug,
                order: order || 0,
                sections: JSON.stringify([])
            }
        });

        return NextResponse.json({
            success: true,
            page: {
                id: newPage.id,
                name: newPage.name,
                slug: newPage.slug,
                order: newPage.order,
                sections: []
            }
        });
    } catch (error) {
        console.error("Create page error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}
