import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, PlayCircle } from "lucide-react"
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
    image,
    blockId
}: HeroProps) {
    if (blockId) {
        return (
            <section className="container flex flex-col items-center gap-8 pt-20 pb-16 md:pt-32 md:pb-24 text-center px-4 md:px-8">
                <Badge variant="secondary" className="rounded-full px-4 py-1 text-sm font-normal">
                    <span className="mr-2 text-primary">✨</span> New: AI Command Center
                </Badge>

                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl max-w-4xl">
                    {title}
                </h1>

                <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
                    {subtitle}
                </p>

                <div className="flex flex-wrap items-center justify-center gap-4">
                    <Link href="/templates">
                        <Button size="lg" className="rounded-full h-12 px-8">
                            {ctaText} <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>

                    <Button variant="outline" size="lg" className="rounded-full h-12 px-8">
                        See Features
                    </Button>
                </div>

                <div className="mt-16 relative w-full max-w-5xl aspect-[16/9] rounded-xl border bg-zinc-50/50 p-2 shadow-2xl ring-1 ring-zinc-900/10">
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10" />
                    <div className="w-full h-full bg-white rounded-lg shadow-sm border overflow-hidden flex flex-col">
                        <div className="h-12 border-b flex items-center px-4 gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-400" />
                            <div className="w-3 h-3 rounded-full bg-yellow-400" />
                            <div className="w-3 h-3 rounded-full bg-green-400" />
                        </div>
                        <div className="flex-1 bg-zinc-50 p-6 grid grid-cols-12 gap-6">
                            <div className="col-span-3 bg-white rounded-xl border shadow-sm p-4 space-y-4">
                                <div className="h-8 w-24 bg-zinc-100 rounded" />
                                <div className="space-y-2">
                                    <div className="h-4 w-full bg-zinc-50 rounded" />
                                    <div className="h-4 w-3/4 bg-zinc-50 rounded" />
                                </div>
                            </div>
                            <div className="col-span-6 space-y-6">
                                <div className="bg-white rounded-xl border shadow-sm p-6 h-48 flex items-center justify-center">
                                    <div className="text-center space-y-2">
                                        <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-full mx-auto flex items-center justify-center">
                                            <PlayCircle className="h-6 w-6" />
                                        </div>
                                        <p className="font-medium">Watch Demo</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="bg-white rounded-xl border shadow-sm p-4 h-32" />
                                    <div className="bg-white rounded-xl border shadow-sm p-4 h-32" />
                                </div>
                            </div>
                            <div className="col-span-3 bg-white rounded-xl border shadow-sm p-4">
                                <div className="h-full w-full bg-zinc-50 rounded" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-12 flex flex-col items-center gap-4">
                    <p className="text-sm text-muted-foreground">Trusted by the world leaders</p>
                    <div className="flex flex-wrap justify-center gap-8 opacity-50 grayscale">
                        <div className="flex items-center gap-2 font-semibold"><div className="h-5 w-5 bg-current rounded-full" /> Acme Inc</div>
                        <div className="flex items-center gap-2 font-semibold"><div className="h-5 w-5 bg-current rounded-full" /> Globex</div>
                        <div className="flex items-center gap-2 font-semibold"><div className="h-5 w-5 bg-current rounded-full" /> Soylent</div>
                        <div className="flex items-center gap-2 font-semibold"><div className="h-5 w-5 bg-current rounded-full" /> Initech</div>
                        <div className="flex items-center gap-2 font-semibold"><div className="h-5 w-5 bg-current rounded-full" /> Umbrella</div>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="container flex flex-col items-center gap-8 pt-20 pb-16 md:pt-32 md:pb-24 text-center px-4 md:px-8">
            <Badge variant="secondary" className="rounded-full px-4 py-1 text-sm font-normal">
                <span className="mr-2 text-primary">✨</span> New: AI Command Center
            </Badge>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl max-w-4xl">
                {title}
            </h1>

            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
                {subtitle}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
                <Button size="lg" className="rounded-full h-12 px-8" asChild>
                    <a href={ctaLink}>
                        {ctaText} <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                </Button>
                <Button variant="outline" size="lg" className="rounded-full h-12 px-8">
                    See Features
                </Button>
            </div>

            <div className="mt-16 relative w-full max-w-5xl aspect-[16/9] rounded-xl border bg-zinc-50/50 p-2 shadow-2xl ring-1 ring-zinc-900/10">
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10" />
                <div className="w-full h-full bg-white rounded-lg shadow-sm border overflow-hidden flex flex-col">
                    <div className="h-12 border-b flex items-center px-4 gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-400" />
                        <div className="w-3 h-3 rounded-full bg-yellow-400" />
                        <div className="w-3 h-3 rounded-full bg-green-400" />
                    </div>
                    <div className="flex-1 bg-zinc-50 p-6 grid grid-cols-12 gap-6">
                        <div className="col-span-3 bg-white rounded-xl border shadow-sm p-4 space-y-4">
                            <div className="h-8 w-24 bg-zinc-100 rounded" />
                            <div className="space-y-2">
                                <div className="h-4 w-full bg-zinc-50 rounded" />
                                <div className="h-4 w-3/4 bg-zinc-50 rounded" />
                            </div>
                        </div>
                        <div className="col-span-6 space-y-6">
                            <div className="bg-white rounded-xl border shadow-sm p-6 h-48 flex items-center justify-center">
                                <div className="text-center space-y-2">
                                    <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-full mx-auto flex items-center justify-center">
                                        <PlayCircle className="h-6 w-6" />
                                    </div>
                                    <p className="font-medium">Watch Demo</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="bg-white rounded-xl border shadow-sm p-4 h-32" />
                                <div className="bg-white rounded-xl border shadow-sm p-4 h-32" />
                            </div>
                        </div>
                        <div className="col-span-3 bg-white rounded-xl border shadow-sm p-4">
                            <div className="h-full w-full bg-zinc-50 rounded" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-12 flex flex-col items-center gap-4">
                <p className="text-sm text-muted-foreground">Trusted by the world leaders</p>
                <div className="flex flex-wrap justify-center gap-8 opacity-50 grayscale">
                    <div className="flex items-center gap-2 font-semibold"><div className="h-5 w-5 bg-current rounded-full" /> Acme Inc</div>
                    <div className="flex items-center gap-2 font-semibold"><div className="h-5 w-5 bg-current rounded-full" /> Globex</div>
                    <div className="flex items-center gap-2 font-semibold"><div className="h-5 w-5 bg-current rounded-full" /> Soylent</div>
                    <div className="flex items-center gap-2 font-semibold"><div className="h-5 w-5 bg-current rounded-full" /> Initech</div>
                    <div className="flex items-center gap-2 font-semibold"><div className="h-5 w-5 bg-current rounded-full" /> Umbrella</div>
                </div>
            </div>
        </section>
    )
}
