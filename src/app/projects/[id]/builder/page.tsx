"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { BuilderProvider } from "@/components/builder/builder-context"
import { BuilderLayout } from "@/components/builder/builder-layout"
import { Loader2 } from "lucide-react"

interface ProjectPage {
    id: string
    name: string
    slug: string
    order: number
    sections: any[]
}

interface Project {
    id: string
    name: string
    description: string | null
    sitemap: any
    pages: ProjectPage[]
}

export default function ProjectBuilderPage() {
    const params = useParams()
    const [project, setProject] = useState<Project | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (params.id) {
            fetchProject(params.id as string)
        }
    }, [params.id])

    useEffect(() => {
        // Prevent browser back/forward swipe gestures
        const originalOverscroll = document.body.style.overscrollBehaviorX
        document.body.style.overscrollBehaviorX = "none"

        return () => {
            document.body.style.overscrollBehaviorX = originalOverscroll
        }
    }, [])

    const fetchProject = async (projectId: string) => {
        try {
            const response = await fetch(`/api/projects/${projectId}`)
            const data = await response.json()

            if (!data.success) {
                throw new Error(data.error || "Failed to load project")
            }

            setProject(data.project)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load project")
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-zinc-400 mx-auto mb-4" />
                    <p className="text-zinc-600">Loading project...</p>
                </div>
            </div>
        )
    }

    if (error || !project) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-zinc-900 mb-2">Error</h2>
                    <p className="text-zinc-600 mb-4">{error || "Project not found"}</p>
                    <a href="/projects" className="text-blue-600 hover:underline">
                        Back to projects
                    </a>
                </div>
            </div>
        )
    }

    return (
        <BuilderProvider initialProject={project}>
            <BuilderLayout />
        </BuilderProvider>
    )
}
