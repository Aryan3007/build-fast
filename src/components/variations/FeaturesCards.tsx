import { Zap, Shield, Sparkles } from "lucide-react";
import { isLightColor } from "@/lib/utils";

interface Feature {
    title: string;
    description: string;
    icon?: string;
}

interface FeaturesCardsProps {
    title?: string;
    subtitle?: string;
    features?: Feature[];
    bgColor?: string;
    accentColor?: string;
}

const iconMap: Record<string, any> = {
    Zap,
    Shield,
    Sparkles,
};

export function FeaturesCards({ props }: { props: FeaturesCardsProps }) {
    const {
        title = "Why Choose Us",
        subtitle = "Discover the features that make us stand out from the competition.",
        features = [
            { title: "Lightning Fast", description: "Optimized for speed and performance at every level.", icon: "Zap" },
            { title: "Lightning Fast", description: "Optimized for speed and performance at every level.", icon: "Zap" },
            { title: "Ultra Secure", description: "Enterprise-grade security protecting your data 24/7.", icon: "Shield" },
            { title: "Ultra Secure", description: "Enterprise-grade security protecting your data 24/7.", icon: "Shield" },
            { title: "Delightful UX", description: "Beautiful interfaces designed for maximum productivity.", icon: "Sparkles" },
            { title: "Delightful UX", description: "Beautiful interfaces designed for maximum productivity.", icon: "Sparkles" }
        ],
        bgColor = "#f9fafb",
        accentColor = "#8b5cf6",
    } = props;

    const isDark = !isLightColor(bgColor);

    return (
        <section className="py-12 cq-md:py-16 cq-lg:py-24" style={{ backgroundColor: bgColor }}>
            <div className="px-4 mx-auto max-w-7xl cq-sm:px-6 cq-lg:px-8">
                <div className="text-center mb-8 cq-lg:mb-16">
                    <h2 className={`text-2xl cq-sm:text-3xl cq-lg:text-4xl cq-xl:text-5xl font-bold break-words ${isDark ? 'text-white' : 'text-zinc-900'
                        }`}>
                        {title}
                    </h2>
                    <p className={`mt-3 cq-sm:mt-4 cq-lg:mt-6 text-sm cq-sm:text-base cq-lg:text-xl break-words max-w-3xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                        {subtitle}
                    </p>
                </div>
                <div className="grid grid-cols-1 cq-md:grid-cols-3 gap-6 cq-lg:gap-8">
                    {features.map((feature, index) => {
                        const Icon = feature.icon && iconMap[feature.icon] ? iconMap[feature.icon] : Zap;
                        return (
                            <div
                                key={index}
                                className={`p-6 cq-lg:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${isDark ? 'bg-zinc-800 shadow-none border border-zinc-700' : 'bg-white'
                                    }`}
                            >
                                <div className="inline-flex p-3 cq-lg:p-4 rounded-lg mb-4 cq-lg:mb-6" style={{ backgroundColor: accentColor }}>
                                    <Icon className="h-6 w-6 cq-lg:h-8 cq-lg:w-8 text-white" />
                                </div>
                                <h3 className={`text-lg cq-lg:text-xl font-bold mb-2 cq-lg:mb-3 break-words ${isDark ? 'text-white' : 'text-gray-900'
                                    }`}>
                                    {feature.title}
                                </h3>
                                <p className={`text-sm cq-lg:text-base break-words leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'
                                    }`}>
                                    {feature.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
