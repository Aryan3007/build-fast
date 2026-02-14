
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { rewriteTextWithAI } from "@/lib/ai/gemini-service";

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        // Allow if no user ID (for demo/dev) or implement strict auth as needed

        const body = await req.json();
        const { text, rewriteType, projectContext } = body;

        if (!text || !rewriteType) {
            return NextResponse.json(
                { success: false, error: "Text and rewriteType are required" },
                { status: 400 }
            );
        }

        // Generate content using AI
        const result = await rewriteTextWithAI(
            text,
            rewriteType,
            projectContext || ""
        );

        if (!result.success) {
            return NextResponse.json(
                { success: false, error: result.error || "Failed to rewrite text" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            text: result.text
        });
    } catch (error) {
        console.error("Rewrite API error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}
