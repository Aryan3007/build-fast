import dynamic from "next/dynamic";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";

// Legacy components (will be migrated)
import { Hero } from "@/components/landing/hero";
Pricing,
    FAQ,
    Footer,
    Problem,
    Comparison,
    Navbar,
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
                        return <VariationComponent key={index} props={block.props || {}} />;
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
