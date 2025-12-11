import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { editSingleComponent } from "@/lib/ai/gemini-service";

export async function POST(req: NextRequest) {
    try {
        // Check authentication
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Parse request body
        const body = await req.json();
        const { component, prompt, context } = body;

        // Validate inputs
        if (!component || typeof component !== "object") {
            return NextResponse.json(
                { success: false, error: "Component is required" },
                { status: 400 }
            );
        }

        if (!prompt || typeof prompt !== "string") {
            return NextResponse.json(
                { success: false, error: "Prompt is required" },
                { status: 400 }
            );
        }

        // Edit component using AI
        const result = await editSingleComponent(component, prompt, context || []);

        if (!result.success) {
            return NextResponse.json(
                { success: false, error: result.error || "Failed to edit component" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            component: result.component,
        });
    } catch (error) {
        console.error("Edit component API error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}
