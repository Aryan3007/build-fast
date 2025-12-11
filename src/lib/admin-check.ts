import { currentUser } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function isUserAdmin(): Promise<boolean> {
    try {
        console.log("🔍 [ADMIN CHECK] Starting admin check...");

        const user = await currentUser();
        console.log("👤 [ADMIN CHECK] Current user:", user ? {
            id: user.id,
            email: user.emailAddresses?.[0]?.emailAddress
        } : "No user");

        if (!user || !user.emailAddresses?.[0]?.emailAddress) {
            console.log("❌ [ADMIN CHECK] No user or email address found");
            return false;
        }

        const email = user.emailAddresses[0].emailAddress;
        console.log("📧 [ADMIN CHECK] User email:", email);

        // First, check environment variable for admin emails
        const adminEmailsRaw = process.env.ADMIN_EMAILS;
        console.log("🔧 [ADMIN CHECK] ADMIN_EMAILS env var:", adminEmailsRaw || "NOT SET");

        const adminEmails = adminEmailsRaw?.split(',').map(e => e.trim()) || [];
        console.log("📋 [ADMIN CHECK] Parsed admin emails:", adminEmails);

        const isInEnvList = adminEmails.includes(email);
        console.log("✅ [ADMIN CHECK] Email in env list?", isInEnvList);

        if (isInEnvList) {
            console.log("🎉 [ADMIN CHECK] User is admin via environment variable!");
            return true;
        }

        // Second, check database
        console.log("🗄️ [ADMIN CHECK] Checking database for user...");
        const dbUser = await prisma.user.findUnique({
            where: { clerkId: user.id },
            select: { isAdmin: true }
        });
        console.log("📊 [ADMIN CHECK] Database user:", dbUser);

        const isAdmin = dbUser?.isAdmin ?? false;
        console.log(isAdmin ? "✅ [ADMIN CHECK] User is admin in database!" : "❌ [ADMIN CHECK] User is NOT admin");

        return isAdmin;
    } catch (error) {
        console.error("💥 [ADMIN CHECK] Error checking admin status:", error);
        return false;
    }
}

export async function requireAdmin() {
    const isAdmin = await isUserAdmin();

    if (!isAdmin) {
        throw new Error("Unauthorized: Admin access required");
    }

    return isAdmin;
}
