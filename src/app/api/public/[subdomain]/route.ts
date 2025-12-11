import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ subdomain: string }> }
) {
    try {
        const { subdomain } = await params;

        // Find published project by subdomain
        const project = await prisma.project.findFirst({
            where: {
                subdomain,
                isPublished: true
            },
            include: {
                pages: {
                    orderBy: {
                        order: 'asc'
                    }
                }
            }
        });

        if (!project) {
            return NextResponse.json(
                { success: false, error: "Project not found or not published" },
                { status: 404 }
            );
        }

        // Parse sections for each page
        const pagesWithSections = project.pages.map(page => ({
            id: page.id,
            name: page.name,
            slug: page.slug,
            order: page.order,
            sections: JSON.parse(page.sections as string)
        }));

        return NextResponse.json({
            success: true,
            project: {
                id: project.id,
                name: project.name,
                description: project.description,
                language: project.language,
                publishedAt: project.publishedAt,
                pages: pagesWithSections
            }
        });
    } catch (error) {
        console.error("Fetch published project error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}
