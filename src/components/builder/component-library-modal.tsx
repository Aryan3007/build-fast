"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

interface Component {
    id: string
    name: string
    category: string
    type: string
    componentFile: string | null
    description: string | null
    props: string
}

interface ComponentLibraryModalProps {
    onClose: () => void
    onSelectComponent: (componentProps: any, componentType: string, componentFile?: string | null) => void
}

export function ComponentLibraryModal({ onClose, onSelectComponent }: ComponentLibraryModalProps) {
    const [components, setComponents] = useState<Component[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/components')
            .then(res => res.json())
            .then(data => {
                setComponents(data)
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [])

    const groupedComponents = components.reduce((acc, component) => {
        if (!acc[component.category]) {
            acc[component.category] = []
        }
        acc[component.category].push(component)
        return acc
    }, {} as Record<string, Component[]>)

    const handleUseComponent = (component: Component) => {
        const props = JSON.parse(component.props)
        onSelectComponent(props, component.type, component.componentFile)
        onClose()
    }

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[80vh] flex flex-col">
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-semibold">Component Library</h2>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <div className="text-center py-12 text-zinc-500">Loading components...</div>
                    ) : (
                        Object.entries(groupedComponents).map(([category, categoryComponents]) => (
                            <div key={category} className="mb-8">
                                <h3 className="text-lg font-semibold text-zinc-800 mb-4 capitalize flex items-center gap-2">
                                    {category}
                                    <Badge variant="secondary">{categoryComponents.length}</Badge>
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {categoryComponents.map((component) => (
                                        <Card key={component.id} className="overflow-hidden hover:shadow-md transition-shadow">
                                            <div className="aspect-video bg-gradient-to-br from-zinc-100 to-zinc-200 flex items-center justify-center">
                                                <div className="text-zinc-400 text-sm">{component.name}</div>
                                            </div>
                                            <div className="p-3">
                                                <h4 className="font-medium text-sm text-zinc-900">{component.name}</h4>
                                                {component.description && (
                                                    <p className="text-xs text-zinc-600 mt-1 line-clamp-2">{component.description}</p>
                                                )}
                                                <Button
                                                    size="sm"
                                                    className="w-full mt-3"
                                                    onClick={() => handleUseComponent(component)}
                                                >
                                                    Add to Template
                                                </Button>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
