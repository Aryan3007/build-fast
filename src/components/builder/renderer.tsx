import dynamic from "next/dynamic";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";

// Legacy components (will be migrated)
import { Hero } from "@/components/landing/hero";
import { Pricing } from "@/components/landing/pricing";
import { FAQ } from "@/components/landing/faq";
import { Problem } from "@/components/landing/problem";
import { Comparison } from "@/components/landing/comparison";

// Import all component variations dynamically
const componentVariations: Record<string, any> = {
    // Hero variations
    HeroSocialLearning: dynamic(() => import("@/components/variations/HeroSocialLearning").then(m => m.HeroSocialLearning)),
    HeroModern: dynamic(() => import("@/components/variations/HeroModern").then(m => m.HeroModern)),
    HeroMinimal: dynamic(() => import("@/components/variations/HeroMinimal").then(m => m.HeroMinimal)),

    // Features variations
    FeaturesCards: dynamic(() => import("@/components/variations/FeaturesCards").then(m => m.FeaturesCards)),
    FeaturesGrid: dynamic(() => import("@/components/variations/FeaturesGrid").then(m => m.FeaturesGrid)),

    // Pricing variations
    PricingSimple: dynamic(() => import("@/components/variations/PricingSimple").then(m => m.PricingSimple)),

    // Navbar variations
    NavbarModern: dynamic(() => import("@/components/variations/NavbarModern").then(m => m.NavbarModern)),
    NavbarMinimal: dynamic(() => import("@/components/variations/NavbarMinimal").then(m => m.NavbarMinimal)),
    NavbarTransparent: dynamic(() => import("@/components/variations/NavbarTransparent").then(m => m.NavbarTransparent)),

    // Footer variations
    FooterModern: dynamic(() => import("@/components/variations/FooterModern").then(m => m.FooterModern)),
    FooterMinimal: dynamic(() => import("@/components/variations/FooterMinimal").then(m => m.FooterMinimal)),
    FooterSocial: dynamic(() => import("@/components/variations/FooterSocial").then(m => m.FooterSocial)),
};

// Legacy component map
const LEGACY_COMPONENT_MAP: Record<string, any> = {
    Hero,
    Pricing,
    FAQ,
    Problem,
    Comparison,
    Navbar,
    Footer,
};

interface RendererProps {
    content: string; // JSON string
}

interface Block {
    type: string;
    componentFile?: string;
    props?: Record<string, any>;
}

export function Renderer({ content }: RendererProps) {
    let blocks: Block[] = [];

    try {
        blocks = JSON.parse(content);
    } catch (e) {
        console.error("Failed to parse content JSON", e);
        return <div className="p-8 text-center text-red-500">Error loading content</div>;
    }

    if (!Array.isArray(blocks)) {
        return <div className="p-8 text-center text-zinc-500">Invalid content format</div>;
    }

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Navbar />
            <main className="flex-1 w-full">
                {blocks.map((block, index) => {
                    // New system: Use componentFile if available
                    if (block.componentFile && componentVariations[block.componentFile]) {
                        const VariationComponent = componentVariations[block.componentFile];
                        return <VariationComponent key={index} {...(block.props || {})} />;
                    }

                    // Legacy system: Fall back to type-based lookup
                    const LegacyComponent = LEGACY_COMPONENT_MAP[block.type];
                    if (LegacyComponent) {
                        return <LegacyComponent key={index} {...(block.props || {})} />;
                    }

                    // Unknown component
                    return (
                        <div
                            key={index}
                            className="p-8 text-center border-2 border-dashed border-red-200 m-4 rounded-lg"
                        >
                            <p className="text-red-600 font-semibold">Unknown component</p>
                            <p className="text-sm text-gray-500 mt-2">
                                Type: {block.type}
                                {block.componentFile && ` | File: ${block.componentFile}`}
                            </p>
                        </div>
                    );
                })}
            </main>
        </div>
    );
}
