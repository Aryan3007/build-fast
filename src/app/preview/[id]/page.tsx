import { PrismaClient } from "@prisma/client"
import { notFound } from "next/navigation"
import { Renderer } from "@/components/builder/renderer"

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

export default async function TemplatePreviewPage({ 
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

    return <Renderer content={template.content} />
}
