import { PrismaClient } from "@prisma/client";
import { ComponentsManager } from "./components-manager";

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export default async function ComponentsPage({
    searchParams,
}: {
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    // searchParams is typed as Promise for Next.js 16 compatibility
    const components = await prisma.component.findMany({
        orderBy: { category: "asc" },
    });

    return <ComponentsManager components={components} />;
}
