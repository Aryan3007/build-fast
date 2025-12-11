"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Plus, Loader2, FolderOpen } from "lucide-react"
import Link from "next/link"

interface Project {
    id: string
    name: string
    description: string | null
    pageCount: number
    createdAt: string
    updatedAt: string
    pages: Array<{
        id: string
        name: string
        slug: string
    }>
}

export default function ProjectsPage() {
    const router = useRouter()
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchProjects()
    }, [])

    const fetchProjects = async () => {
        try {
            const response = await fetch("/api/projects")
            const data = await response.json()

            if (data.success) {
                setProjects(data.projects)
            }
        } catch (error) {
            console.error("Failed to fetch projects:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteProject = async (projectId: string) => {
        if (!confirm("Are you sure you want to delete this project?")) return

        try {
            const response = await fetch(`/api/projects/${projectId}`, {
                method: "DELETE",
            })

            if (response.ok) {
                setProjects(projects.filter(p => p.id !== projectId))
            }
        } catch (error) {
            console.error("Failed to delete project:", error)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-zinc-900">My Projects</h1>
                        <p className="text-zinc-600 mt-2">Create and manage your website projects</p>
                    </div>
                    <Link href="/projects/new">
                        <Button size="lg" className="gap-2">
                            <Plus className="h-5 w-5" />
                            New Project
                        </Button>
                    </Link>
                </div>

                {/* Projects Grid */}
                {projects.length === 0 ? (
                    <div className="text-center py-20">
                        <FolderOpen className="h-16 w-16 text-zinc-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-zinc-700 mb-2">No projects yet</h3>
                        <p className="text-zinc-500 mb-6">Get started by creating your first project</p>
                        <Link href="/projects/new">
                            <Button size="lg" className="gap-2">
                                <Plus className="h-5 w-5" />
                                Create Project
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <div
                                key={project.id}
                                className="bg-white rounded-xl border border-zinc-200 p-6 hover:shadow-lg transition-shadow cursor-pointer group"
                                onClick={() => router.push(`/projects/${project.id}/builder`)}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-zinc-900 group-hover:text-blue-600 transition-colors">
                                        {project.name}
                                    </h3>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleDeleteProject(project.id)
                                        }}
                                    >
                                        Delete
                                    </Button>
                                </div>

                                {project.description && (
                                    <p className="text-sm text-zinc-600 mb-4 line-clamp-2">
                                        {project.description}
                                    </p>
                                )}

                                <div className="flex items-center gap-4 text-sm text-zinc-500">
                                    <span>{project.pages.length} pages</span>
                                    <span>•</span>
                                    <span>Updated {new Date(project.updatedAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
