import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, PlayCircle, Sparkles } from "lucide-react"
import Link from "next/link"

interface HeroProps {
    title?: string
    subtitle?: string
    ctaText?: string
    ctaLink?: string
    image?: string
    blockId?: string
}

export function Hero({
    title = "The New Era AI Command Center",
    subtitle = "Plan, launch and scale — in one glass-clear dashboard for modern founders.",
    ctaText = "Get Template",
    ctaLink = "/templates",
    image: _image,
    blockId
}: HeroProps) {
    const heroContent = (
        <>
            {/* Animated gradient background */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            {/* Badge with enhanced styling */}
            <div className="relative mb-6">
                <Badge
                    variant="secondary"
                    className="rounded-full px-5 py-1.5 text-sm font-medium bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200/50 shadow-sm hover:shadow-md transition-shadow"
                >
                    <Sparkles className="mr-2 h-3.5 w-3.5 text-purple-600 animate-pulse" />
                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-semibold">
                        New: AI Command Center
                    </span>
                </Badge>
            </div>

            {/* Enhanced title with gradient */}
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl max-w-5xl leading-tight">
                <span className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 bg-clip-text text-transparent">
                    {title}
                </span>
            </h1>

            {/* Enhanced subtitle */}
            <p className="max-w-2xl leading-relaxed text-zinc-600 sm:text-xl sm:leading-8 text-balance mt-6">
                {subtitle}
            </p>

            {/* Enhanced CTA buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
                <Link href={ctaLink || "/templates"}>
                    <Button
                        size="lg"
                        className="rounded-full h-14 px-10 text-base font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                        {ctaText}
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </Link>
                <Button
                    variant="outline"
                    size="lg"
                    className="rounded-full h-14 px-10 text-base font-semibold border-2 hover:bg-zinc-50 transition-all duration-300 hover:scale-105"
                >
                    <PlayCircle className="mr-2 h-5 w-5" />
                    Watch Demo
                </Button>
            </div>

            {/* Enhanced demo preview */}
            <div className="mt-20 relative w-full max-w-6xl">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-200/20 via-pink-200/20 to-purple-200/20 rounded-2xl blur-3xl"></div>
                <div className="relative aspect-[16/9] rounded-2xl border border-zinc-200/50 bg-gradient-to-br from-white to-zinc-50/50 p-3 shadow-2xl ring-1 ring-zinc-900/5 backdrop-blur-sm">
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10 rounded-2xl pointer-events-none" />
                    <div className="w-full h-full bg-white rounded-xl shadow-lg border border-zinc-100 overflow-hidden flex flex-col">
                        {/* Browser bar */}
                        <div className="h-14 border-b border-zinc-200 flex items-center px-5 gap-3 bg-gradient-to-r from-zinc-50 to-white">
                            <div className="flex gap-2">
                                <div className="w-3.5 h-3.5 rounded-full bg-red-400 shadow-sm" />
                                <div className="w-3.5 h-3.5 rounded-full bg-yellow-400 shadow-sm" />
                                <div className="w-3.5 h-3.5 rounded-full bg-green-400 shadow-sm" />
                            </div>
                            <div className="flex-1 mx-4 h-8 bg-zinc-100 rounded-lg border border-zinc-200 flex items-center px-3">
                                <div className="h-2 w-2 rounded-full bg-zinc-400"></div>
                            </div>
                        </div>
                        {/* Dashboard content */}
                        <div className="flex-1 bg-gradient-to-br from-zinc-50 to-white p-8 grid grid-cols-12 gap-6">
                            {/* Sidebar */}
                            <div className="col-span-3 bg-white rounded-xl border border-zinc-200 shadow-sm p-5 space-y-4">
                                <div className="h-10 w-32 bg-gradient-to-r from-zinc-100 to-zinc-50 rounded-lg"></div>
                                <div className="space-y-3">
                                    <div className="h-3 w-full bg-gradient-to-r from-zinc-50 to-transparent rounded"></div>
                                    <div className="h-3 w-4/5 bg-gradient-to-r from-zinc-50 to-transparent rounded"></div>
                                    <div className="h-3 w-3/4 bg-gradient-to-r from-zinc-50 to-transparent rounded"></div>
                                </div>
                            </div>
                            {/* Main content */}
                            <div className="col-span-6 space-y-6">
                                <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-8 h-56 flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
                                    <div className="text-center space-y-3">
                                        <div className="h-16 w-16 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-2xl mx-auto flex items-center justify-center shadow-lg">
                                            <PlayCircle className="h-8 w-8" />
                                        </div>
                                        <p className="font-semibold text-zinc-700">Watch Demo</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6 h-36 bg-gradient-to-br from-blue-50 to-cyan-50"></div>
                                    <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6 h-36 bg-gradient-to-br from-green-50 to-emerald-50"></div>
                                </div>
                            </div>
                            {/* Right sidebar */}
                            <div className="col-span-3 bg-white rounded-xl border border-zinc-200 shadow-sm p-5">
                                <div className="h-full w-full bg-gradient-to-br from-zinc-50 to-transparent rounded-lg"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced trust section */}
            <div className="mt-16 flex flex-col items-center gap-6">
                <p className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Trusted by industry leaders</p>
                <div className="flex flex-wrap justify-center items-center gap-12 opacity-60 grayscale hover:grayscale-0 transition-all">
                    <div className="flex items-center gap-3 font-semibold text-zinc-700">
                        <div className="h-6 w-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full"></div>
                        Acme Inc
                    </div>
                    <div className="flex items-center gap-3 font-semibold text-zinc-700">
                        <div className="h-6 w-6 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full"></div>
                        Globex
                    </div>
                    <div className="flex items-center gap-3 font-semibold text-zinc-700">
                        <div className="h-6 w-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full"></div>
                        Soylent
                    </div>
                    <div className="flex items-center gap-3 font-semibold text-zinc-700">
                        <div className="h-6 w-6 bg-gradient-to-br from-orange-500 to-red-500 rounded-full"></div>
                        Initech
                    </div>
                    <div className="flex items-center gap-3 font-semibold text-zinc-700">
                        <div className="h-6 w-6 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-full"></div>
                        Umbrella
                    </div>
                </div>
            </div>
        </>
    )

    if (blockId) {
        return (
            <section className="relative container flex flex-col items-center gap-8 pt-24 pb-20 md:pt-40 md:pb-32 text-center px-4 md:px-8 overflow-hidden">
                {heroContent}
            </section>
        )
    }

    return (
        <section className="relative container flex flex-col items-center gap-8 pt-24 pb-20 md:pt-40 md:pb-32 text-center px-4 md:px-8 overflow-hidden">
            {heroContent}
        </section>
    )
}

