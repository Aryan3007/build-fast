import { PrismaClient } from "@prisma/client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const prisma = new PrismaClient()

export default async function ComponentsPage({
    searchParams,
}: {
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    // searchParams is typed as Promise for Next.js 16 compatibility
    const components = await prisma.component.findMany({
        orderBy: [
            { category: 'asc' },
            { name: 'asc' }
        ]
    })

    // Group components by category
    const groupedComponents = components.reduce((acc, component) => {
        if (!acc[component.category]) {
            acc[component.category] = []
        }
        acc[component.category].push(component)
        return acc
    }, {} as Record<string, typeof components>)

    return (
        <div className="min-h-screen bg-zinc-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-zinc-900">Component Library</h1>
                    <p className="text-zinc-600 mt-2">
                        Browse and use pre-built components for your templates
                    </p>
                </div>

                {Object.entries(groupedComponents).map(([category, categoryComponents]) => (
                    <div key={category} className="mb-12">
                        <h2 className="text-2xl font-semibold text-zinc-800 mb-4 capitalize flex items-center gap-2">
                            {category}
                            <Badge variant="secondary">{categoryComponents.length}</Badge>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {categoryComponents.map((component) => (
                                <Card key={component.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                    <div className="aspect-video bg-gradient-to-br from-zinc-100 to-zinc-200 flex items-center justify-center">
                                        <div className="text-zinc-400 text-sm">{component.name}</div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold text-zinc-900">{component.name}</h3>
                                        {component.description && (
                                            <p className="text-sm text-zinc-600 mt-1">{component.description}</p>
                                        )}
                                        <div className="mt-4 flex gap-2">
                                            <Button size="sm" variant="outline" className="flex-1">
                                                Preview
                                            </Button>
                                            <Button size="sm" className="flex-1">
                                                Use Component
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                ))}

                {components.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-zinc-500">No components found. Run the seed script to populate the library.</p>
                        <code className="mt-2 block text-sm bg-zinc-100 p-2 rounded">npx prisma db seed</code>
                    </div>
                )}
            </div>
        </div>
    )
}
