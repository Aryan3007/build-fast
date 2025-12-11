import { Zap } from "lucide-react"

interface Feature {
    title: string
    description: string
    icon?: string
}

interface FeaturesProps {
    title?: string
    subtitle?: string
    features?: Feature[]
    blockId?: string
}

export function Features({
    title = "Features that matter",
    subtitle = "Everything you need to build your next great product.",
    features = [
        { title: "Fast Performance", description: "Lightning fast load times.", icon: "Zap" },
        { title: "Secure", description: "Bank-level security.", icon: "Shield" },
        { title: "Easy to Use", description: "Intuitive interface.", icon: "Sparkles" }
    ],
    blockId
}: FeaturesProps) {
    if (blockId) {
        return (
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-zinc-900">{title}</h2>
                        <p className="mt-2 text-lg text-zinc-600">{subtitle}</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
                                <Zap className="h-10 w-10 text-blue-500 mb-4" />
                                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                <p className="text-zinc-600">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-zinc-900">{title}</h2>
                    <p className="mt-2 text-lg text-zinc-600">{subtitle}</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
                            <Zap className="h-10 w-10 text-blue-500 mb-4" />
                            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                            <p className="text-zinc-600">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
