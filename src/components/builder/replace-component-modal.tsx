"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useBuilder } from "./builder-context"
import { useState } from "react"
import { Loader2 } from "lucide-react"

// Component variations grouped by type
const COMPONENT_LIBRARY = {
    Hero: [
        { name: "HeroSocialLearning", file: "HeroSocialLearning", label: "Social Learning" },
        { name: "HeroModern", file: "HeroModern", label: "Modern Gradient" },
        { name: "HeroMinimal", file: "HeroMinimal", label: "Minimal Clean" },
    ],
    Features: [
        { name: "FeaturesCards", file: "FeaturesCards", label: "Feature Cards" },
        { name: "FeaturesGrid", file: "FeaturesGrid", label: "Feature Grid" },
    ],
    Pricing: [
        { name: "PricingSimple", file: "PricingSimple", label: "Simple Pricing" },
    ],
    Navbar: [
        { name: "NavbarModern", file: "NavbarModern", label: "Modern Gradient" },
        { name: "NavbarMinimal", file: "NavbarMinimal", label: "Minimal" },
        { name: "NavbarTransparent", file: "NavbarTransparent", label: "Transparent" },
    ],
    Footer: [
        { name: "FooterModern", file: "FooterModern", label: "Modern" },
        { name: "FooterMinimal", file: "FooterMinimal", label: "Minimal" },
        { name: "FooterSocial", file: "FooterSocial", label: "Social" },
    ],
}

interface ReplaceComponentModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    blockId: string | null
}

export function ReplaceComponentModal({ open, onOpenChange, blockId }: ReplaceComponentModalProps) {
    const { blocks, replaceBlock } = useBuilder()
    const [isReplacing, setIsReplacing] = useState(false)

    const currentBlock = blocks.find(b => b.id === blockId)
    if (!currentBlock) return null

    const handleReplace = async (newType: string, newFile: string) => {
        setIsReplacing(true)

        try {
            // For now, just do basic replacement without AI
            // TODO: Add AI content generation for expanded components
            replaceBlock(blockId!, newType, newFile)
            onOpenChange(false)
        } catch (error) {
            console.error("Error replacing component:", error)
        } finally {
            setIsReplacing(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Replace Component</DialogTitle>
                    <DialogDescription>
                        Current: <strong>{currentBlock.type}</strong> - Choose a replacement component. Your theme and content will be preserved.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 mt-4">
                    {Object.entries(COMPONENT_LIBRARY).map(([category, components]) => (
                        <div key={category}>
                            <h3 className="text-sm font-semibold text-zinc-700 mb-3">{category}</h3>
                            <div className="grid grid-cols-3 gap-3">
                                {components.map((component) => (
                                    <Button
                                        key={component.name}
                                        variant={currentBlock.type === component.name ? "default" : "outline"}
                                        className="h-auto py-4 px-4 flex flex-col items-center gap-2"
                                        onClick={() => handleReplace(component.name, component.file)}
                                        disabled={isReplacing || currentBlock.type === component.name}
                                    >
                                        {isReplacing ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <>
                                                <span className="text-xs font-medium">{component.label}</span>
                                                {currentBlock.type === component.name && (
                                                    <span className="text-[10px] text-muted-foreground">(Current)</span>
                                                )}
                                            </>
                                        )}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    )
}
