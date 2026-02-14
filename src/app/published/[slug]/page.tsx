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

interface ComponentMapping {
    [key: string]: string
}

// Pre-define all dynamic component imports to avoid React errors
const DynamicComponents: Record<string, any> = {
    // Hero variations
    HeroSocialLearning: dynamic(() => import("@/components/variations/HeroSocialLearning").then(m => m.HeroSocialLearning)),
    HeroModern: dynamic(() => import("@/components/variations/HeroModern").then(m => m.HeroModern)),
    HeroMinimal: dynamic(() => import("@/components/variations/HeroMinimal").then(m => m.HeroMinimal)),
    // Base Hero fallback & Aliases
    Hero: dynamic(() => import("@/components/variations/HeroSocialLearning").then(m => m.HeroSocialLearning)),
    HeroLearning: dynamic(() => import("@/components/variations/HeroSocialLearning").then(m => m.HeroSocialLearning)),

    // Navbar variations
    NavbarModern: dynamic(() => import("@/components/variations/NavbarModern").then(m => m.NavbarModern)),
    NavbarMinimal: dynamic(() => import("@/components/variations/NavbarMinimal").then(m => m.NavbarMinimal)),
    NavbarTransparent: dynamic(() => import("@/components/variations/NavbarTransparent").then(m => m.NavbarTransparent)),
    // Base Navbar fallback
    Navbar: dynamic(() => import("@/components/variations/NavbarModern").then(m => m.NavbarModern)),

    // Features variations
    FeaturesGrid: dynamic(() => import("@/components/variations/FeaturesGrid").then(m => m.FeaturesGrid)),
    FeaturesCards: dynamic(() => import("@/components/variations/FeaturesCards").then(m => m.FeaturesCards)),
    // Base Features fallback
    Features: dynamic(() => import("@/components/variations/FeaturesGrid").then(m => m.FeaturesGrid)),

    // Pricing variations
    PricingSimple: dynamic(() => import("@/components/variations/PricingSimple").then(m => m.PricingSimple)),
    // Base Pricing fallback
    Pricing: dynamic(() => import("@/components/variations/PricingSimple").then(m => m.PricingSimple)),

    // Footer variations
    FooterModern: dynamic(() => import("@/components/variations/FooterModern").then(m => m.FooterModern)),
    FooterMinimal: dynamic(() => import("@/components/variations/FooterMinimal").then(m => m.FooterMinimal)),
    FooterSocial: dynamic(() => import("@/components/variations/FooterSocial").then(m => m.FooterSocial)),
    // Base Footer fallback
    Footer: dynamic(() => import("@/components/variations/FooterModern").then(m => m.FooterModern)),

    // CTA Fallbacks (since CTASimple doesn't exist yet, we use HeroMinimal as a fallback)
    CTASimple: dynamic(() => import("@/components/variations/HeroMinimal").then(m => m.HeroMinimal)),
    CTA: dynamic(() => import("@/components/variations/HeroMinimal").then(m => m.HeroMinimal)),
}

export default function PublishedProjectPage() {
    const params = useParams()
    const projectSlug = params.slug as string

    const [project, setProject] = useState<Project | null>(null)
    const [componentMap, setComponentMap] = useState<ComponentMapping>({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Fetch component mappings from database
    useEffect(() => {
        const fetchComponentMappings = async () => {
            try {
                const response = await fetch('/api/components')
                const data = await response.json()

                // Create a map of type -> componentFile
                const map: ComponentMapping = {}

                // Handle both array response and {success, components} response
                const components = Array.isArray(data) ? data : (data.components || [])

                components.forEach((comp: any) => {
                    if (comp.type && comp.componentFile) {
                        map[comp.type] = comp.componentFile
                    }
                })

                // Add fallback mappings for common types
                // We use these as defaults if the database doesn't provide a mapping
                const defaults: ComponentMapping = {
                    'Navbar': 'NavbarModern',
                    'Hero': 'HeroSocialLearning',
                    'Features': 'FeaturesGrid',
                    'Pricing': 'PricingSimple',
                    'Footer': 'FooterModern',
                    'CTA': 'CTASimple',
                }

                // Merge defaults with loaded map (loaded map takes precedence)
                setComponentMap({ ...defaults, ...map })
                console.log('📦 Component mappings loaded:', { ...defaults, ...map })
            } catch (err) {
                console.error('Failed to load component mappings:', err)
                // Set fallback mappings on error
                setComponentMap({
                    'Navbar': 'NavbarModern',
                    'Hero': 'HeroSocialLearning',
                    'Features': 'FeaturesGrid',
                    'Pricing': 'PricingSimple',
                    'Footer': 'FooterModern',
                    'CTA': 'CTASimple',
                })
            }
        }

        fetchComponentMappings()
    }, [])

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await fetch(`/api/public/${projectSlug}`)
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

        if (projectSlug) {
            fetchProject()
        }
    }, [projectSlug])

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
                // Priority: 1) componentFile from block, 2) lookup from database, 3) use type as fallback
                const componentFile = block.componentFile || componentMap[block.type] || block.type

                // Get the pre-defined dynamic component
                const Component = DynamicComponents[componentFile]

                if (!Component) {
                    console.error(`Component not found: ${componentFile}`)
                    return (
                        <div key={block.id || `block-${index}`} className="p-8 bg-red-50 border border-red-200">
                            <p className="text-red-600">Component not found: {componentFile}</p>
                            <p className="text-xs text-red-500 mt-2">Type: {block.type}</p>
                        </div>
                    )
                }

                return (
                    <div key={block.id || `block-${index}`}>
                        <Component props={block.props || {}} />
                    </div>
                )
            })}
        </div>
    )
}
