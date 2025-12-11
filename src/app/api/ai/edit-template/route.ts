import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { editTemplateWithAI, EditType } from "@/lib/ai/gemini-service";
import { Block } from "@/components/builder/builder-context";

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

        // Parse request body
        const body = await req.json();
        const { blocks, prompt, editType, targetBlockId, editSelectedOnly } = body;

        // Validate inputs
        if (!blocks || !Array.isArray(blocks)) {
            return NextResponse.json(
                { success: false, error: "Invalid blocks data" },
                { status: 400 }
            );
        }

        if (!prompt || typeof prompt !== "string") {
            return NextResponse.json(
                { success: false, error: "Prompt is required" },
                { status: 400 }
            );
        }

        if (!["structure", "content", "rewrite", "theme"].includes(editType)) {
            return NextResponse.json(
                { success: false, error: "Invalid edit type" },
                { status: 400 }
            );
        }

        // Call AI service
        const result = await editTemplateWithAI(
            blocks as Block[],
            prompt,
            editType as EditType,
            targetBlockId,
            editSelectedOnly
        );

        if (!result.success) {
            return NextResponse.json(
                { success: false, error: result.error || "AI editing failed" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            blocks: result.blocks,
            message: "Template edited successfully",
        });
    } catch (error) {
        console.error("AI edit API error:", error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : "Internal server error",
            },
            { status: 500 }
        );
    }
}
