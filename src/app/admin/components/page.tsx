import { PrismaClient } from "@prisma/client";
import { ComponentsManager } from "./components-manager";

const prisma = new PrismaClient();

export default async function ComponentsPage() {
    const components = await prisma.component.findMany({
        orderBy: { category: "asc" },
    });

    return <ComponentsManager components={components} />;
}
