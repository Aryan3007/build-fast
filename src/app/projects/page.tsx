"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Plus, Loader2, FolderOpen, FileText, Calendar, Trash2, ArrowRight } from "lucide-react"
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
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-zinc-900 to-zinc-700 bg-clip-text text-transparent">
                            My Projects
                        </h1>
                        <p className="text-zinc-600 mt-2 text-lg">Create and manage your website projects</p>
                    </div>
                    <Link href="/projects/new">
                        <Button size="lg" className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all">
                            <Plus className="h-5 w-5" />
                            New Project
                        </Button>
                    </Link>
                </div>

                {/* Projects Grid */}
                {projects.length === 0 ? (
                    <div className="text-center py-24">
                        <div className="inline-flex p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 mb-6">
                            <FolderOpen className="h-16 w-16 text-purple-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-zinc-900 mb-2">No projects yet</h3>
                        <p className="text-zinc-600 mb-8 text-lg max-w-md mx-auto">Get started by creating your first project and bring your ideas to life</p>
                        <Link href="/projects/new">
                            <Button size="lg" className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all">
                                <Plus className="h-5 w-5" />
                                Create Project
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project, index) => {
                            const gradientColors = [
                                "from-purple-500 to-pink-500",
                                "from-blue-500 to-cyan-500",
                                "from-green-500 to-emerald-500",
                                "from-orange-500 to-red-500",
                                "from-yellow-500 to-amber-500",
                                "from-indigo-500 to-purple-500"
                            ]
                            const gradient = gradientColors[index % gradientColors.length]

                            return (
                                <div
                                    key={project.id}
                                    className="group relative bg-white rounded-2xl border border-zinc-200/60 overflow-hidden hover:shadow-2xl hover:shadow-zinc-200/50 transition-all duration-300 cursor-pointer hover:-translate-y-1"
                                    onClick={() => router.push(`/projects/${project.id}/builder`)}
                                >
                                    {/* Gradient accent bar */}
                                    <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${gradient}`}></div>

                                    {/* Content */}
                                    <div className="p-6">
                                        {/* Header with icon and actions */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-start gap-3 flex-1 min-w-0">
                                                <div className={`mt-1 p-2.5 rounded-xl bg-gradient-to-br ${gradient} shadow-lg flex-shrink-0`}>
                                                    <FolderOpen className="h-5 w-5 text-white" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-lg font-bold text-zinc-900 group-hover:text-zinc-700 transition-colors line-clamp-1">
                                                        {project.name}
                                                    </h3>
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-600 flex-shrink-0 ml-2"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleDeleteProject(project.id)
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        {/* Description */}
                                        {project.description && (
                                            <p className="text-sm text-zinc-600 mb-5 line-clamp-2 leading-relaxed">
                                                {project.description}
                                            </p>
                                        )}

                                        {/* Metadata */}
                                        <div className="flex items-center gap-4 text-xs text-zinc-500 mb-4">
                                            <div className="flex items-center gap-1.5">
                                                <FileText className="h-3.5 w-3.5" />
                                                <span className="font-medium">{project.pages.length} {project.pages.length === 1 ? 'page' : 'pages'}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="h-3.5 w-3.5" />
                                                <span>{new Date(project.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                            </div>
                                        </div>

                                        {/* Footer with CTA */}
                                        <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
                                            <span className="text-xs font-medium text-zinc-400 group-hover:text-zinc-600 transition-colors">
                                                Open project
                                            </span>
                                            <ArrowRight className="h-4 w-4 text-zinc-400 group-hover:text-zinc-600 group-hover:translate-x-1 transition-all" />
                                        </div>
                                    </div>

                                    {/* Hover gradient overlay */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`}></div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
