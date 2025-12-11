import { Check } from "lucide-react";
import Link from "next/link";

interface PricingTier {
    name: string;
    price: string;
    features: string[];
    highlighted?: boolean;
}

interface PricingSimpleProps {
    title?: string;
    subtitle?: string;
    tiers?: PricingTier[];
    bgColor?: string;
    accentColor?: string;
}

export function PricingSimple({ props }: { props: PricingSimpleProps }) {
    const {
        title = "Simple, transparent pricing",
        subtitle = "Choose the plan that's right for you.",
        tiers = [
            {
                name: "Starter",
                price: "$19",
                features: ["5 Projects", "Basic Support", "1GB Storage"],
            },
            {
                name: "Pro",
                price: "$49",
                features: ["Unlimited Projects", "Priority Support", "10GB Storage", "Advanced Analytics"],
                highlighted: true,
            },
            {
                name: "Enterprise",
                price: "$99",
                features: ["Unlimited Everything", "24/7 Support", "100GB Storage", "Custom Integration"],
            },
        ],
        bgColor = "#f9fafb",
        accentColor = "#3b82f6",
    } = props;

    return (
        <section className="py-12 cq-md:py-16 cq-lg:py-24" style={{ backgroundColor: bgColor }}>
            <div className="px-4 mx-auto max-w-7xl cq-sm:px-6 cq-lg:px-8">
                <div className="text-center mb-8 cq-lg:mb-16">
                    <h2 className="text-2xl cq-sm:text-3xl cq-lg:text-4xl cq-xl:text-5xl font-bold text-zinc-900 break-words">
                        {title}
                    </h2>
                    <p className="mt-3 cq-sm:mt-4 text-sm cq-sm:text-base cq-lg:text-xl break-words max-w-2xl mx-auto" style={{ opacity: 0.8 }}>
                        {subtitle}
                    </p>
                </div>

                <div className="grid grid-cols-1 cq-md:grid-cols-3 gap-6 cq-lg:gap-8 max-w-5xl mx-auto">
                    {tiers.map((tier, index) => (
                        <div
                            key={index}
                            className={`bg-white rounded-2xl shadow-lg p-6 cq-lg:p-8 ${tier.highlighted ? "ring-2 transform cq-lg:scale-105" : ""
                                }`}
                            style={tier.highlighted ? { borderColor: accentColor } : {}}
                        >
                            {tier.highlighted && (
                                <div className="text-white text-xs font-semibold px-3 py-1 rounded-full inline-block mb-4" style={{ backgroundColor: accentColor }}>
                                    POPULAR
                                </div>
                            )}
                            <h3 className="text-lg cq-lg:text-xl font-bold text-zinc-900">{tier.name}</h3>
                            <div className="mt-4 cq-lg:mt-6">
                                <span className="text-3xl cq-lg:text-4xl font-bold text-zinc-900">{tier.price}</span>
                                <span className="text-sm cq-lg:text-base text-gray-600">/month</span>
                            </div>
                            <ul className="mt-6 cq-lg:mt-8 space-y-3 cq-lg:space-y-4">
                                {tier.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start">
                                        <Check className="h-5 w-5 cq-lg:h-6 cq-lg:w-6 mr-3 flex-shrink-0 mt-0.5" style={{ color: accentColor }} />
                                        <span className="text-sm cq-lg:text-base text-gray-600 break-words">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <Link
                                href="#"
                                className={`mt-6 cq-lg:mt-8 block w-full text-center px-6 py-3 rounded-lg font-semibold text-sm cq-lg:text-base transition-opacity hover:opacity-90`}
                                style={tier.highlighted ? { backgroundColor: accentColor, color: '#ffffff' } : { backgroundColor: `${accentColor}22`, color: accentColor }}
                            >
                                Get Started
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
