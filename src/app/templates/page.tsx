import { PrismaClient } from "@prisma/client"
import { TemplateCard } from "@/components/templates/template-card"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"

const prisma = new PrismaClient()

async function getTemplates() {
    try {
        return await prisma.template.findMany({
            orderBy: { createdAt: 'desc' }
        })
    } catch (e) {
        console.error("Failed to fetch templates", e)
        return []
    }
}

export default async function TemplatesPage() {
    const templates = await getTemplates()

    return (
        <div className="flex min-h-screen flex-col bg-zinc-50">
            <Navbar />
            <main className="flex-1 container py-12 px-4 md:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">Templates</h1>
                    <p className="text-muted-foreground mt-2">Choose a template to start your site.</p>
                </div>

                {templates.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl border shadow-sm">
                        <p className="text-muted-foreground">No templates found. Please run the seed script.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {templates.map((template: any) => (
                            <TemplateCard
                                key={template.id}
                                id={template.id}
                                name={template.name}
                                description={template.description || ""}
                                thumbnail={template.thumbnail}
                            />
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    )
}
