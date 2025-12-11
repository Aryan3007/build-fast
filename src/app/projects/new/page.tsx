"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Loader2, Sparkles } from "lucide-react"

export default function NewProjectPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        pageCount: 3,
        language: "en",
    })

    const handleGenerateSitemap = async () => {
        if (!formData.description.trim()) {
            alert("Please provide a project description")
            return
        }

        setLoading(true)

        try {
            // Generate sitemap with AI
            const sitemapResponse = await fetch("/api/ai/generate-sitemap", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    description: formData.description,
                    pageCount: formData.pageCount,
                    language: formData.language,
                }),
            })

            const sitemapData = await sitemapResponse.json()

            if (!sitemapData.success) {
                throw new Error(sitemapData.error || "Failed to generate sitemap")
            }

            // Create project with generated sitemap
            const projectResponse = await fetch("/api/projects", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name || "Untitled Project",
                    description: formData.description,
                    language: formData.language,
                    pageCount: formData.pageCount,
                    sitemap: sitemapData.sitemap,
                    pages: sitemapData.sitemap.pages,
                }),
            })

            const projectData = await projectResponse.json()

            if (!projectData.success) {
                throw new Error(projectData.error || "Failed to create project")
            }

            // Redirect to builder
            router.push(`/projects/${projectData.project.id}/builder`)
        } catch (error) {
            console.error("Error creating project:", error)
            alert(error instanceof Error ? error.message : "Failed to create project")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                <div className="bg-white rounded-2xl shadow-xl border border-zinc-200 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
                        <h1 className="text-3xl font-bold mb-2">Create New Project</h1>
                        <p className="text-blue-100">Tell us about your website and we'll generate a sitemap</p>
                    </div>

                    {/* Form */}
                    <div className="p-8 space-y-6">
                        {/* Project Name */}
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-2">
                                Project Name (Optional)
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="My Awesome Website"
                                className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-2">
                                Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Describe your company or project in a sentence or two to generate a sitemap..."
                                rows={4}
                                className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                            />
                            <p className="text-xs text-zinc-500 mt-1">
                                Example: "A freelancing agency website" or "An e-commerce store for handmade jewelry"
                            </p>
                        </div>

                        {/* Number of Pages */}
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-2">
                                Number of pages
                            </label>
                            <select
                                value={formData.pageCount}
                                onChange={(e) => setFormData({ ...formData, pageCount: parseInt(e.target.value) })}
                                className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            >
                                <option value={2}>2-5</option>
                                <option value={3}>3 pages</option>
                                <option value={4}>4 pages</option>
                                <option value={5}>5 pages</option>
                            </select>
                        </div>

                        {/* Language */}
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-2">
                                Language
                            </label>
                            <select
                                value={formData.language}
                                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                                className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            >
                                <option value="en">English (US)</option>
                                <option value="es">Spanish</option>
                                <option value="fr">French</option>
                                <option value="de">German</option>
                            </select>
                        </div>

                        {/* Generate Button */}
                        <Button
                            onClick={handleGenerateSitemap}
                            disabled={loading || !formData.description.trim()}
                            className="w-full py-6 text-lg gap-2"
                            size="lg"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Generating sitemap...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="h-5 w-5" />
                                    Generate sitemap
                                </>
                            )}
                        </Button>

                        <p className="text-xs text-center text-zinc-500">
                            This will override all page sections and copy existing sitemap to the new project.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
