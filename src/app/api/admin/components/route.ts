import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireAdmin } from "@/lib/admin-check";

const prisma = new PrismaClient();

// GET: List all components
export async function GET() {
    try {
        await requireAdmin();

        const components = await prisma.component.findMany({
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(components);
    } catch (error) {
        console.error("Error fetching components:", error);
        return NextResponse.json({ error: "Unauthorized or error fetching components" }, { status: 403 });
    }
}

// POST: Create new component
export async function POST(request: NextRequest) {
    try {
        await requireAdmin();

        const body = await request.json();
        const { name, category, type, description, thumbnail, props } = body;

        // Validate required fields
        if (!name || !category || !type || !props) {
            return NextResponse.json(
                { error: "Missing required fields: name, category, type, props" },
                { status: 400 }
            );
        }

        // Validate props is valid JSON
        try {
            JSON.parse(props);
        } catch {
            return NextResponse.json({ error: "Props must be valid JSON" }, { status: 400 });
        }

        const component = await prisma.component.create({
            data: {
                name,
                category,
                type,
                description: description || null,
                thumbnail: thumbnail || null,
                props,
            },
        });

        return NextResponse.json(component, { status: 201 });
    } catch (error) {
        console.error("Error creating component:", error);
        return NextResponse.json({ error: "Unauthorized or error creating component" }, { status: 403 });
    }
}
