"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { useSearchParams } from "next/navigation"

// Dynamic imports for ALL component variations
const componentVariations: Record<string, any> = {
    // Hero variations
    HeroSocialLearning: dynamic(() =>
        import("@/components/variations/HeroSocialLearning").then((mod) => mod.HeroSocialLearning)
    ),
    HeroModern: dynamic(() =>
        import("@/components/variations/HeroModern").then((mod) => mod.HeroModern)
    ),
    HeroMinimal: dynamic(() =>
        import("@/components/variations/HeroMinimal").then((mod) => mod.HeroMinimal)
    ),
    // Features variations
    FeaturesGrid: dynamic(() =>
        import("@/components/variations/FeaturesGrid").then((mod) => mod.FeaturesGrid)
    ),
    FeaturesCards: dynamic(() =>
        import("@/components/variations/FeaturesCards").then((mod) => mod.FeaturesCards)
    ),
    // Pricing variations
    PricingSimple: dynamic(() =>
        import("@/components/variations/PricingSimple").then((mod) => mod.PricingSimple)
    ),
    // Navbar variations
    NavbarModern: dynamic(() =>
        import("@/components/variations/NavbarModern").then((mod) => mod.NavbarModern)
    ),
    NavbarMinimal: dynamic(() =>
        import("@/components/variations/NavbarMinimal").then((mod) => mod.NavbarMinimal)
    ),
    NavbarTransparent: dynamic(() =>
        import("@/components/variations/NavbarTransparent").then((mod) => mod.NavbarTransparent)
    ),
    // Footer variations
    FooterModern: dynamic(() =>
        import("@/components/variations/FooterModern").then((mod) => mod.FooterModern)
    ),
    FooterMinimal: dynamic(() =>
        import("@/components/variations/FooterMinimal").then((mod) => mod.FooterMinimal)
    ),
    FooterSocial: dynamic(() =>
        import("@/components/variations/FooterSocial").then((mod) => mod.FooterSocial)
    ),
}

interface Block {
    id: string
    type: string
    componentFile?: string | null
    props: Record<string, any>
    styles?: Record<string, React.CSSProperties>
}

export default function PreviewPage() {
    const searchParams = useSearchParams()
    const [blocks, setBlocks] = useState<Block[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        try {
            // Get blocks data from sessionStorage (set when preview is opened)
            const blocksData = sessionStorage.getItem("preview-blocks")
            if (blocksData) {
                const parsedBlocks = JSON.parse(blocksData)
                setBlocks(parsedBlocks)
            }
        } catch (error) {
            console.error("Error loading preview data:", error)
        } finally {
            setLoading(false)
        }
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-zinc-600">Loading preview...</p>
                </div>
            </div>
        )
    }

    if (blocks.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="text-center text-zinc-500">
                    <p className="text-lg">No content to preview</p>
                    <p className="text-sm mt-2">Add some components in the builder first</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white container-support">
            {blocks.map((block) => {
                // Only render if component has a componentFile reference
                if (!block.componentFile || !componentVariations[block.componentFile]) {
                    return null
                }

                const VariationComponent = componentVariations[block.componentFile]

                return (
                    <div key={block.id}>
                        <VariationComponent props={block.props} blockId={block.id} />
                    </div>
                )
            })}
        </div>
    )
}
