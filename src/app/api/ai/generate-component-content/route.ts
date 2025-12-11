import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { generateComponentContent } from "@/lib/ai/gemini-service";

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await req.json();
        const { variant, projectDescription, existingComponents } = body;

        if (!variant) {
            return NextResponse.json(
                { success: false, error: "Variant is required" },
                { status: 400 }
            );
        }

        // Generate content using AI
        const result = await generateComponentContent(
            variant,
            projectDescription || "",
            existingComponents || []
        );

        if (!result.success) {
            return NextResponse.json(
                { success: false, error: result.error || "Failed to generate content" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            props: result.props
        });
    } catch (error) {
        console.error("Generate component content error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}
