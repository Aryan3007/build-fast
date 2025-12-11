import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireAdmin } from "@/lib/admin-check";

const prisma = new PrismaClient();

// PATCH: Update component
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await requireAdmin();

        const { id } = await params;
        const body = await request.json();
        const { name, category, type, description, thumbnail, props } = body;

        // Validate props if provided
        if (props) {
            try {
                JSON.parse(props);
            } catch {
                return NextResponse.json({ error: "Props must be valid JSON" }, { status: 400 });
            }
        }

        const component = await prisma.component.update({
            where: { id },
            data: {
                ...(name && { name }),
                ...(category && { category }),
                ...(type && { type }),
                ...(description !== undefined && { description }),
                ...(thumbnail !== undefined && { thumbnail }),
                ...(props && { props }),
            },
        });

        return NextResponse.json(component);
    } catch (error) {
        console.error("Error updating component:", error);
        return NextResponse.json({ error: "Unauthorized or error updating component" }, { status: 403 });
    }
}

// DELETE: Delete component
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await requireAdmin();

        const { id } = await params;

        await prisma.component.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting component:", error);
        return NextResponse.json({ error: "Unauthorized or error deleting component" }, { status: 403 });
    }
}
