import { PrismaClient } from "@prisma/client"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Eye, Check } from "lucide-react"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"

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

export default async function TemplateDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const template = await getTemplate(id)

    if (!template) {
        notFound()
    }

    return (
        <div className="flex min-h-screen flex-col bg-zinc-50">
            <Navbar />
            <main className="flex-1 mx-auto max-w-7xl container py-12 px-4 md:px-8">
                <Link href="/templates" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Templates
                </Link>

                <div className="grid lg:grid-cols-2 gap-12">
                    <div className="space-y-6">
                        <div className="aspect-video bg-zinc-200 rounded-xl overflow-hidden border shadow-sm">
                            {template.thumbnail ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={template.thumbnail} alt={template.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-zinc-400">No Preview</div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight mb-2">{template.name}</h1>
                            <p className="text-lg text-muted-foreground">{template.description}</p>
                        </div>

                        <div className="flex flex-col gap-4 sm:flex-row">
                            <Button size="lg" className="w-full sm:w-auto" asChild>
                                <Link href={`/builder/${template.id}`}>
                                    Edit Template
                                </Link>
                            </Button>
                            <Button variant="outline" size="lg" className="w-full sm:w-auto" asChild>
                                <Link href={`/preview/${template.id}`} target="_blank">
                                    <Eye className="w-4 h-4 mr-2" /> Live Preview
                                </Link>
                            </Button>
                        </div>

                        <div className="bg-white rounded-xl border p-6 shadow-sm">
                            <h3 className="font-semibold mb-4">Includes</h3>
                            <ul className="space-y-3">
                                {["Responsive Design", "SEO Optimized", "Fast Loading", "Customizable Sections"].map((item, i) => (
                                    <li key={i} className="flex items-center gap-2 text-sm">
                                        <div className="h-5 w-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                                            <Check className="w-3 h-3" />
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
