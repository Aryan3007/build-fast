"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    LayoutTemplate,
    Type,
    Image as ImageIcon,
    Box,
    Search,
    ChevronRight,
    ArrowLeft,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useDraggable } from "@dnd-kit/core"

// Types
type Category = {
    id: string
    name: string
    icon: React.ReactNode
}

const CATEGORIES: Category[] = [
    { id: 'Hero', name: 'Hero', icon: <LayoutTemplate className="h-4 w-4" /> },
    { id: 'Features', name: 'Features', icon: <Box className="h-4 w-4" /> },
    { id: 'Pricing', name: 'Pricing', icon: <Type className="h-4 w-4" /> },
    { id: 'Navbar', name: 'Navbar', icon: <Box className="h-4 w-4" /> },
    { id: 'Footer', name: 'Footer', icon: <Box className="h-4 w-4" /> },
]

export function LeftSidebar() {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState("")

    // 2. VARIANT MODE: If a category is selected, show variants
    if (selectedCategory) {
        return (
            <div className="flex h-full w-full bg-white">
                <div className="flex-1 flex flex-col h-full overflow-hidden border-r">
                    <VariantGridView
                        category={selectedCategory}
                        onBack={() => setSelectedCategory(null)}
                    />
                </div>
            </div>
        )
    }

    // 3. CATEGORY MODE: Default view
    return (
        <div className="flex h-full w-full bg-white">
            <div className="flex-1 flex flex-col h-full overflow-hidden border-r">
                <CategoryView
                    onSelect={setSelectedCategory}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                />
            </div>
        </div>
    )
}



function CategoryView({ onSelect, searchQuery, setSearchQuery }: {
    onSelect: (id: string) => void,
    searchQuery: string,
    setSearchQuery: (q: string) => void
}) {
    const filteredCategories = CATEGORIES.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-sm">Add Section</h2>
                </div>
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
                    <Input
                        placeholder="Search..."
                        className="pl-9 bg-zinc-50 border-zinc-200"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <ScrollArea className="flex-1 p-2">
                <div className="space-y-1">
                    <div className="text-xs font-medium text-zinc-400 px-2 py-2">CATEGORIES</div>
                    {filteredCategories.map(category => (
                        <button
                            key={category.id}
                            onClick={() => onSelect(category.id)}
                            className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-zinc-50 border border-transparent hover:border-zinc-200 transition-all group text-left"
                        >
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-md bg-white border border-zinc-200 flex items-center justify-center text-zinc-500 group-hover:text-zinc-900 group-hover:border-zinc-300 transition-colors shadow-sm">
                                    {category.icon}
                                </div>
                                <span className="text-sm font-medium text-zinc-600 group-hover:text-zinc-900">
                                    {category.name}
                                </span>
                            </div>
                            <ChevronRight className="h-4 w-4 text-zinc-300 group-hover:text-zinc-500" />
                        </button>
                    ))}
                </div>
            </ScrollArea>
        </div>
    )
}

function VariantGridView({ category, onBack }: { category: string, onBack: () => void }) {
    // Generate variants based on category
    const variants = getVariantsForCategory(category);

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8 -ml-2">
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <span className="font-medium text-sm">{category} Blocks</span>
            </div>

            <ScrollArea className="flex-1 p-4 bg-zinc-50/50">
                <div className="grid grid-cols-1 gap-4">
                    {variants.map((variant) => (
                        <DraggableVariant key={variant.id} variant={variant} />
                    ))}
                </div>
            </ScrollArea>
        </div>
    )
}

// Helper to get variants
function getVariantsForCategory(categoryId: string) {
    switch (categoryId) {
        case 'Hero':
            return [
                {
                    id: 'HeroModern',
                    name: 'Modern Hero',
                    description: 'Large heading with image',
                    componentFile: 'HeroModern',
                    defaultProps: {
                        title: 'Build Faster with AI',
                        description: 'Create stunning landing pages in minutes using our AI-powered builder.',
                        ctaText: 'Get Started Free',
                        ctaLink: '#'
                    }
                },
                {
                    id: 'HeroMinimal',
                    name: 'Minimal Hero',
                    description: 'Centered text focus',
                    componentFile: 'HeroMinimal',
                    defaultProps: {
                        title: 'Simplicity is Key',
                        description: 'Focus on your message with this clean, distraction-free design.',
                        ctaText: 'Learn More',
                        ctaLink: '#'
                    }
                },
                {
                    id: 'HeroSocialLearning',
                    name: 'Social Proof Hero',
                    description: 'Trusted by thousands',
                    componentFile: 'HeroSocialLearning',
                    defaultProps: {
                        title: 'Join the Community',
                        description: 'Join 10,000+ developers building with our tools.',
                        ctaText: 'Join Now',
                        ctaLink: '#'
                    }
                }
            ];
        case 'Features':
            return [
                {
                    id: 'FeaturesGrid',
                    name: 'Feature Grid',
                    description: '3-column grid layout',
                    componentFile: 'FeaturesGrid',
                    defaultProps: {
                        title: 'Powerful Features',
                        description: 'Everything you need to succeed.',
                        features: [
                            { title: 'Fast Performance', description: 'Optimized for speed and efficiency.' },
                            { title: 'Secure', description: 'Enterprise-grade security built-in.' },
                            { title: 'Scalable', description: 'Grows with your business.' }
                        ]
                    }
                },
                {
                    id: 'FeaturesCards',
                    name: 'Feature Cards',
                    description: 'Highlighted feature cards',
                    componentFile: 'FeaturesCards',
                    defaultProps: {
                        title: 'Why Choose Us',
                        description: 'We deliver the best results.',
                        cards: [
                            { title: 'Benefit 1', description: 'Description of benefit 1.' },
                            { title: 'Benefit 2', description: 'Description of benefit 2.' },
                            { title: 'Benefit 3', description: 'Description of benefit 3.' }
                        ]
                    }
                }
            ];
        case 'Pricing':
            return [
                {
                    id: 'PricingSimple',
                    name: 'Simple Pricing',
                    description: '3 tiers comparison',
                    componentFile: 'PricingSimple',
                    defaultProps: {
                        title: 'Simple Pricing',
                        description: 'Choose the plan that fits your needs.',
                        tiers: [
                            { name: 'Starter', price: '$0', features: ['Feature A', 'Feature B'] },
                            { name: 'Pro', price: '$29', features: ['Everything in Starter', 'Feature C'] },
                            { name: 'Enterprise', price: '$99', features: ['Everything in Pro', 'Priority Support'] }
                        ]
                    }
                }
            ];
        case 'Navbar':
            return [
                {
                    id: 'NavbarModern',
                    name: 'Modern Navbar',
                    description: 'Logo and links',
                    componentFile: 'NavbarModern',
                    defaultProps: {
                        siteName: 'Brand',
                        links: [
                            { label: 'Features', href: '#' },
                            { label: 'Pricing', href: '#' },
                            { label: 'About', href: '#' }
                        ]
                    }
                },
                {
                    id: 'NavbarMinimal',
                    name: 'Minimal Navbar',
                    description: 'Clean and simple',
                    componentFile: 'NavbarMinimal',
                    defaultProps: {
                        siteName: 'Brand',
                        links: [
                            { label: 'Home', href: '#' },
                            { label: 'About', href: '#' },
                            { label: 'Contact', href: '#' }
                        ]
                    }
                },
                {
                    id: 'NavbarTransparent',
                    name: 'Transparent Navbar',
                    description: 'Overlay style',
                    componentFile: 'NavbarTransparent',
                    defaultProps: {
                        siteName: 'Brand',
                        links: [
                            { label: 'Features', href: '#' },
                            { label: 'Pricing', href: '#' },
                            { label: 'Contact', href: '#' }
                        ]
                    }
                }
            ];
        case 'Footer':
            return [
                {
                    id: 'FooterModern',
                    name: 'Modern Footer',
                    description: 'Multi-column footer',
                    componentFile: 'FooterModern',
                    defaultProps: {
                        companyName: 'Company Inc.',
                        description: 'Building the future.',
                        links: [
                            { label: 'About', href: '#' },
                            { label: 'Contact', href: '#' },
                            { label: 'Privacy', href: '#' }
                        ]
                    }
                },
                {
                    id: 'FooterMinimal',
                    name: 'Minimal Footer',
                    description: 'Simple and clean',
                    componentFile: 'FooterMinimal',
                    defaultProps: {
                        companyName: 'Company Inc.',
                        links: [
                            { label: 'Terms', href: '#' },
                            { label: 'Privacy', href: '#' }
                        ]
                    }
                },
                {
                    id: 'FooterSocial',
                    name: 'Social Footer',
                    description: 'With social links',
                    componentFile: 'FooterSocial',
                    defaultProps: {
                        companyName: 'Company Inc.',
                        description: 'Connect with us on social media.',
                        socialLinks: [
                            { platform: 'twitter', url: '#' },
                            { platform: 'facebook', url: '#' },
                            { platform: 'linkedin', url: '#' }
                        ]
                    }
                }
            ];
        default:
            return [];
    }
}

export function VariantCard({ variant }: { variant: any }) {
    return (
        <div className="bg-white border rounded-lg overflow-hidden hover:shadow-md hover:border-blue-400 transition-all duration-200">
            <div className="aspect-[16/9] bg-zinc-100 flex items-center justify-center border-b relative">
                <div className="flex flex-col items-center gap-2 text-zinc-400">
                    <LayoutTemplate className="h-8 w-8 opacity-20" />
                    <span className="text-[10px] uppercase tracking-wider font-semibold opacity-40">Preview</span>
                </div>
            </div>
            <div className="p-3">
                <div className="text-xs font-medium text-zinc-900">{variant.name}</div>
                <div className="text-[10px] text-zinc-500 mt-0.5">{variant.description}</div>
            </div>
        </div>
    )
}

function DraggableVariant({ variant }: { variant: any }) {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: `variant-${variant.id}`,
        data: {
            type: 'component-variant',
            variant: variant.componentFile,
            defaultProps: variant.defaultProps
        }
    })

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className={cn(
                "group cursor-grab active:cursor-grabbing",
                isDragging ? "opacity-50" : "opacity-100"
            )}
        >
            <VariantCard variant={variant} />
        </div>
    )
}
