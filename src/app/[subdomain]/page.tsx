"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import dynamic from "next/dynamic"
import { Loader2 } from "lucide-react"

interface Block {
    id: string
    type: string
    componentFile?: string | null
    props: Record<string, any>
    styles?: Record<string, React.CSSProperties>
}

interface Page {
    id: string
    name: string
    slug: string
    order: number
    sections: Block[]
}

interface Project {
    id: string
    name: string
    description: string | null
    language: string
    publishedAt: Date | null
    pages: Page[]
}

export default function SubdomainPage() {
    const params = useParams()
    const subdomain = params.subdomain as string

    const [project, setProject] = useState<Project | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await fetch(`/api/public/${subdomain}`)
                const data = await response.json()

                if (data.success) {
                    setProject(data.project)
                } else {
                    setError(data.error || 'Project not found')
                }
            } catch (err) {
                setError('Failed to load project')
                console.error('Fetch error:', err)
            } finally {
                setLoading(false)
            }
        }

        if (subdomain) {
            fetchProject()
        }
    }, [subdomain])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-zinc-600 mx-auto mb-4" />
                    <p className="text-zinc-600">Loading...</p>
                </div>
            </div>
        )
    }

    if (error || !project) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50">
                <div className="text-center max-w-md">
                    <h1 className="text-4xl font-bold text-zinc-900 mb-4">404</h1>
                    <p className="text-xl text-zinc-600 mb-2">Project Not Found</p>
                    <p className="text-sm text-zinc-500">
                        {error || 'The project you are looking for does not exist or has not been published.'}
                    </p>
                </div>
            </div>
        )
    }

    // Render all blocks from all pages
    const allBlocks = project.pages.flatMap(page => page.sections)

    return (
        <div className="min-h-screen bg-white">
            {allBlocks.map((block, index) => {
                const componentFile = block.componentFile || block.type

                // Dynamically import the component
                const Component = dynamic(
                    () => import(`@/components/variations/${componentFile}`).catch(() => {
                        console.error(`Failed to load component: ${componentFile}`)
                        return () => (
                            <div className="p-8 bg-red-50 border border-red-200">
                                <p className="text-red-600">Component not found: {componentFile}</p>
                            </div>
                        )
                    }),
                    {
                        loading: () => (
                            <div className="p-8 flex items-center justify-center">
                                <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
                            </div>
                        ),
                        ssr: false
                    }
                )

                return (
                    <div key={block.id || `block-${index}`}>
                        <Component {...block.props} />
                    </div>
                )
            })}
        </div>
    )
}
