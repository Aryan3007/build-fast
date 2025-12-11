import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        // Check authentication
        const user = await currentUser();
        if (!user) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Get or create user in database
        let dbUser = await prisma.user.findUnique({
            where: { clerkId: user.id },
        });

        if (!dbUser) {
            dbUser = await prisma.user.create({
                data: {
                    clerkId: user.id,
                    email: user.emailAddresses[0]?.emailAddress || "",
                    name: user.fullName || user.firstName || null,
                },
            });
        }

        // Parse request body
        const body = await req.json();
        const { name, description, blocks, thumbnail } = body;

        // Validate inputs
        if (!name || typeof name !== "string") {
            return NextResponse.json(
                { success: false, error: "Template name is required" },
                { status: 400 }
            );
        }

        if (!blocks || !Array.isArray(blocks)) {
            return NextResponse.json(
                { success: false, error: "Invalid blocks data" },
                { status: 400 }
            );
        }

        // Save template
        const template = await prisma.userTemplate.create({
            data: {
                name,
                description: description || null,
                userId: dbUser.id,
                content: JSON.stringify(blocks),
                thumbnail: thumbnail || null,
                isPublic: false,
            },
        });

        return NextResponse.json({
            success: true,
            template: {
                id: template.id,
                name: template.name,
                description: template.description,
                createdAt: template.createdAt,
            },
            message: "Template saved successfully",
        });
    } catch (error) {
        console.error("Save template API error:", error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : "Internal server error",
            },
            { status: 500 }
        );
    }
}
