import { Layers } from "lucide-react"

interface ProblemCard {
    title: string
    description: string
    icon?: string
}

interface ProblemProps {
    title?: string
    subtitle?: string
    cards?: ProblemCard[]
    blockId?: string
}

export function Problem({
    title = "The Problem",
    subtitle = "Why this matters",
    cards = [
        { title: "Challenge 1", description: "Description of the problem", icon: "Layers" },
        { title: "Challenge 2", description: "Another issue to solve", icon: "Zap" },
        { title: "Challenge 3", description: "Final problem", icon: "BarChart3" }
    ],
    blockId
}: ProblemProps) {
    if (blockId) {
        return (
            <section className="py-16 bg-zinc-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-zinc-900">{title}</h2>
                        <p className="mt-2 text-lg text-zinc-600">{subtitle}</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {cards.map((card, index) => (
                            <div key={index} className="p-6 bg-white rounded-lg border">
                                <Layers className="h-10 w-10 text-red-500 mb-4" />
                                <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
                                <p className="text-zinc-600">{card.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="py-16 bg-zinc-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-zinc-900">{title}</h2>
                    <p className="mt-2 text-lg text-zinc-600">{subtitle}</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    {cards.map((card, index) => (
                        <div key={index} className="p-6 bg-white rounded-lg border">
                            <Layers className="h-10 w-10 text-red-500 mb-4" />
                            <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
                            <p className="text-zinc-600">{card.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
