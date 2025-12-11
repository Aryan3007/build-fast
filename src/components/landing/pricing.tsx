import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

interface PricingPlan {
    name: string
    description: string
    price: string
    period: string
    features: string[]
    buttonText: string
    highlight?: boolean
}

interface PricingProps {
    title?: string
    subtitle?: string
    plans?: PricingPlan[]
    blockId?: string
}

export function Pricing({
    title = "Simple Pricing",
    subtitle = "Choose the plan that's right for you",
    plans = [
        {
            name: "Starter",
            description: "For individuals",
            price: "$0",
            period: "month",
            features: ["5 projects", "Basic support"],
            buttonText: "Get Started"
        },
        {
            name: "Pro",
            description: "For teams",
            price: "$29",
            period: "month",
            features: ["Unlimited projects", "Priority support", "Advanced features"],
            buttonText: "Get Pro",
            highlight: true
        },
        {
            name: "Enterprise",
            description: "For organizations",
            price: "Custom",
            period: "",
            features: ["Custom solutions", "Dedicated support"],
            buttonText: "Contact Us"
        }
    ],
    blockId
}: PricingProps) {
    if (blockId) {
        return (
            <section className="py-16 bg-zinc-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-zinc-900">{title}</h2>
                        <p className="mt-2 text-lg text-zinc-600">{subtitle}</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {plans.map((plan, index) => (
                            <div
                                key={index}
                                className={`p-8 rounded-lg ${plan.highlight ? 'bg-blue-50 border-2 border-blue-500' : 'bg-white border'}`}
                            >
                                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                                <p className="text-zinc-600 mb-4">{plan.description}</p>
                                <div className="mb-6">
                                    <span className="text-4xl font-bold">{plan.price}</span>
                                    {plan.period && <span className="text-zinc-600">/{plan.period}</span>}
                                </div>
                                <ul className="space-y-3 mb-6">
                                    {plan.features.map((feature, fIndex) => (
                                        <li key={fIndex} className="flex items-center">
                                            <Check className="h-5 w-5 text-green-500 mr-2" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Button className="w-full" variant={plan.highlight ? "default" : "outline"}>
                                    {plan.buttonText}
                                </Button>
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
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`p-8 rounded-lg ${plan.highlight ? 'bg-blue-50 border-2 border-blue-500' : 'bg-white border'}`}
                        >
                            <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                            <p className="text-zinc-600 mb-4">{plan.description}</p>
                            <div className="mb-6">
                                <span className="text-4xl font-bold">{plan.price}</span>
                                {plan.period && <span className="text-zinc-600">/{plan.period}</span>}
                            </div>
                            <ul className="space-y-3 mb-6">
                                {plan.features.map((feature, fIndex) => (
                                    <li key={fIndex} className="flex items-center">
                                        <Check className="h-5 w-5 text-green-500 mr-2" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <Button className="w-full" variant={plan.highlight ? "default" : "outline"}>
                                {plan.buttonText}
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
