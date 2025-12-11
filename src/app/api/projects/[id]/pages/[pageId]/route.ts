import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string; pageId: string }> }
) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { id: projectId, pageId } = await params;

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
        const { sections, blocks } = body;

        // Accept either sections or blocks
        const dataToSave = sections || blocks;

        if (!dataToSave || !Array.isArray(dataToSave)) {
            return NextResponse.json(
                { success: false, error: "Invalid sections/blocks data" },
                { status: 400 }
            );
        }

        console.log(`💾 Saving ${dataToSave.length} blocks/sections to page ${pageId}`);
        console.log('📦 First block:', JSON.stringify(dataToSave[0], null, 2));

        // Update page sections/blocks
        const updatedPage = await prisma.projectPage.update({
            where: { id: pageId },
            data: {
                sections: JSON.stringify(dataToSave)
            }
        });

        return NextResponse.json({
            success: true,
            page: {
                id: updatedPage.id,
                sections: JSON.parse(updatedPage.sections as string)
            }
        });
    } catch (error) {
        console.error("Update page sections error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}
