import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { generateSitemap } from "@/lib/ai/gemini-service";

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
        const { description, pageCount, language } = body;

        // Validate inputs
        if (!description || typeof description !== "string") {
            return NextResponse.json(
                { success: false, error: "Description is required" },
                { status: 400 }
            );
        }

        if (!pageCount || typeof pageCount !== "number" || pageCount < 2 || pageCount > 5) {
            return NextResponse.json(
                { success: false, error: "Page count must be between 2 and 5" },
                { status: 400 }
            );
        }

        // Generate sitemap using AI
        const result = await generateSitemap(description, pageCount, language || "en");

        if (!result.success) {
            return NextResponse.json(
                { success: false, error: result.error || "Failed to generate sitemap" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            sitemap: result.sitemap,
        });
    } catch (error) {
        console.error("Sitemap generation API error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}
