import { PrismaClient } from "@prisma/client"
import { notFound } from "next/navigation"
import { BuilderProvider } from "@/components/builder/builder-context"
import { BuilderLayout } from "@/components/builder/builder-layout"

const prisma = new PrismaClient()

async function getTemplate(id: string) {
    try {
        return await prisma.template.findUnique({
            where: { id }
        })
    } catch (e) {
        return null
    }
}

export default async function BuilderPage({ 
    params,
    searchParams,
}: { 
    params: Promise<{ id: string }>
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    // searchParams is typed as Promise for Next.js 16 compatibility
    const { id } = await params
    const template = await getTemplate(id)

    if (!template) {
        notFound()
    }

    let initialBlocks = []
    try {
        initialBlocks = JSON.parse(template.content)
    } catch (e) {
        console.error("Failed to parse template content", e)
    }

    return (
        <BuilderProvider initialBlocks={initialBlocks}>
            <BuilderLayout />
        </BuilderProvider>
    )
}
