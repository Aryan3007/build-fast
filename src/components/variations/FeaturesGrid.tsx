import { Zap, Shield, Sparkles } from "lucide-react";
import { isLightColor } from "@/lib/utils";

interface Feature {
    title: string;
    description: string;
    icon?: string;
}

interface FeaturesGridProps {
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

export function FeaturesGrid({ props }: { props: FeaturesGridProps }) {
    const {
        title = "Features that matter",
        subtitle = "Everything you need to build your next great product.",
        features = [
            { title: "Fast Performance", description: "Lightning fast load times for better user experience.", icon: "Zap" },
            { title: "Secure by Design", description: "Bank-level security to keep your data safe.", icon: "Shield" },
            { title: "Easy to Use", description: "Intuitive interface that anyone can master.", icon: "Sparkles" }
        ],
        bgColor = "#ffffff",
        accentColor = "#3b82f6",
    } = props;

    const isDark = !isLightColor(bgColor);

    return (
        <section className="py-12 cq-md:py-16 cq-lg:py-20" style={{ backgroundColor: bgColor }}>
            <div className="px-4 mx-auto max-w-7xl cq-sm:px-6 cq-lg:px-8">
                <div className="text-center mb-8 cq-sm:mb-12">
                    <h2 className={`text-2xl cq-sm:text-3xl cq-lg:text-4xl font-bold break-words ${isDark ? 'text-white' : 'text-zinc-900'
                        }`}>
                        {title}
                    </h2>
                    <p className={`mt-2 cq-sm:mt-4 text-sm cq-sm:text-base cq-lg:text-lg break-words max-w-2xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                        {subtitle}
                    </p>
                </div>
                <div className="grid grid-cols-1 cq-sm:grid-cols-2 cq-lg:grid-cols-3 gap-6 cq-sm:gap-8">
                    {features.map((feature, index) => {
                        const Icon = feature.icon && iconMap[feature.icon] ? iconMap[feature.icon] : Zap;
                        return (
                            <div
                                key={index}
                                className={`p-4 cq-sm:p-6 border rounded-lg hover:shadow-lg transition-shadow ${isDark ? 'border-zinc-700 hover:bg-zinc-800/50' : 'border-zinc-200 hover:shadow-xl'
                                    }`}
                            >
                                <Icon className="h-8 w-8 cq-sm:h-10 cq-sm:w-10 mb-3 cq-sm:mb-4" style={{ color: accentColor }} />
                                <h3 className={`text-lg cq-sm:text-xl font-semibold mb-2 break-words ${isDark ? 'text-white' : 'text-zinc-900'
                                    }`}>
                                    {feature.title}
                                </h3>
                                <p className={`text-sm cq-sm:text-base break-words ${isDark ? 'text-gray-400' : 'text-gray-600'
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
