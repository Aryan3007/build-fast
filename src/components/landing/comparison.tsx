import { Check, X } from "lucide-react"

interface ComparisonProps {
    title?: string
    subtitle?: string
    pros?: string[]
    cons?: string[]
    blockId?: string
}

export function Comparison({
    title = "Why Choose Us",
    subtitle = "See the difference",
    pros = ["Feature 1", "Feature 2", "Feature 3"],
    cons = ["Alternative 1", "Alternative 2"],
    blockId
}: ComparisonProps) {
    if (blockId) {
        return (
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-zinc-900">{title}</h2>
                        <p className="mt-2 text-lg text-zinc-600">{subtitle}</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="p-6 bg-green-50 rounded-lg border border-green-200">
                            <h3 className="text-xl font-bold text-green-900 mb-4">With Us</h3>
                            <ul className="space-y-3">
                                {pros.map((pro, index) => (
                                    <li key={index} className="flex items-start">
                                        <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                                        <span>{pro}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="p-6 bg-red-50 rounded-lg border border-red-200">
                            <h3 className="text-xl font-bold text-red-900 mb-4">Without Us</h3>
                            <ul className="space-y-3">
                                {cons.map((con, index) => (
                                    <li key={index} className="flex items-start">
                                        <X className="h-5 w-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                                        <span>{con}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-zinc-900">{title}</h2>
                    <p className="mt-2 text-lg text-zinc-600">{subtitle}</p>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-6 bg-green-50 rounded-lg border border-green-200">
                        <h3 className="text-xl font-bold text-green-900 mb-4">With Us</h3>
                        <ul className="space-y-3">
                            {pros.map((pro, index) => (
                                <li key={index} className="flex items-start">
                                    <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                                    <span>{pro}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="p-6 bg-red-50 rounded-lg border border-red-200">
                        <h3 className="text-xl font-bold text-red-900 mb-4">Without Us</h3>
                        <ul className="space-y-3">
                            {cons.map((con, index) => (
                                <li key={index} className="flex items-start">
                                    <X className="h-5 w-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                                    <span>{con}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    )

}
