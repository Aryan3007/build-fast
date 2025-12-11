import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { generateSubdomain, isValidSubdomain, buildPublishedUrl, generateUniqueSubdomain } from "@/lib/subdomain-utils";

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
            include: {
                user: true,
                pages: true
            }
        });

        if (!project || project.user.clerkId !== userId) {
            return NextResponse.json(
                { success: false, error: "Project not found or unauthorized" },
                { status: 404 }
            );
        }

        // Check if project has at least one page with content
        const hasContent = project.pages.some(page => {
            try {
                const sections = JSON.parse(page.sections as string);
                return sections && sections.length > 0;
            } catch {
                return false;
            }
        });

        if (!hasContent) {
            return NextResponse.json(
                { success: false, error: "Project must have at least one page with content before publishing" },
                { status: 400 }
            );
        }

        // Generate subdomain from project name
        let subdomain = generateSubdomain(project.name);

        // Validate subdomain format
        if (!isValidSubdomain(subdomain)) {
            return NextResponse.json(
                { success: false, error: "Invalid project name for subdomain generation" },
                { status: 400 }
            );
        }

        // Check if subdomain is already taken (by another project)
        const existingProject = await prisma.project.findFirst({
            where: {
                subdomain,
                id: { not: projectId } // Exclude current project
            }
        });

        // If subdomain is taken, generate a unique one
        if (existingProject) {
            const allSubdomains = await prisma.project.findMany({
                where: {
                    subdomain: { not: null },
                    id: { not: projectId }
                },
                select: { subdomain: true }
            });

            const existingSubdomainList = allSubdomains
                .map(p => p.subdomain)
                .filter((s): s is string => s !== null);

            subdomain = generateUniqueSubdomain(subdomain, existingSubdomainList);
        }

        // Build published URL
        const publishedUrl = buildPublishedUrl(subdomain);

        // Update project with publishing info
        const updatedProject = await prisma.project.update({
            where: { id: projectId },
            data: {
                subdomain,
                publishedUrl,
                publishedAt: new Date(),
                isPublished: true
            }
        });

        console.log(`✅ Project "${project.name}" published to ${publishedUrl}`);

        return NextResponse.json({
            success: true,
            project: {
                id: updatedProject.id,
                name: updatedProject.name,
                subdomain: updatedProject.subdomain,
                publishedUrl: updatedProject.publishedUrl,
                publishedAt: updatedProject.publishedAt,
                isPublished: updatedProject.isPublished
            }
        });
    } catch (error) {
        console.error("Publish project error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}

// Unpublish endpoint
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

        // Unpublish project
        const updatedProject = await prisma.project.update({
            where: { id: projectId },
            data: {
                isPublished: false
            }
        });

        console.log(`🔒 Project "${project.name}" unpublished`);

        return NextResponse.json({
            success: true,
            project: {
                id: updatedProject.id,
                isPublished: updatedProject.isPublished
            }
        });
    } catch (error) {
        console.error("Unpublish project error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}
