import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }

        const clerkUser = await currentUser();
        if (!clerkUser) {
            return NextResponse.json(
                { success: false, error: "User not found in Clerk" },
                { status: 404 }
            );
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { clerkId: userId }
        });

        if (existingUser) {
            return NextResponse.json({
                success: true,
                message: "User already exists",
                user: existingUser
            });
        }

        // Create user in database
        const newUser = await prisma.user.create({
            data: {
                clerkId: userId,
                email: clerkUser.emailAddresses[0].emailAddress,
                name: clerkUser.firstName && clerkUser.lastName
                    ? `${clerkUser.firstName} ${clerkUser.lastName}`
                    : null,
            }
        });

        return NextResponse.json({
            success: true,
            message: "User created successfully",
            user: newUser
        });
    } catch (error) {
        console.error("Sync user error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}
