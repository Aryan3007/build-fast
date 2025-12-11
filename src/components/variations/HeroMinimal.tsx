import Link from "next/link";
import { isLightColor } from "@/lib/utils";

interface HeroMinimalProps {
    title?: string;
    subtitle?: string;
    ctaText?: string;
    ctaLink?: string;
    bgColor?: string;
    accentColor?: string;
}

export function HeroMinimal({ props }: { props: HeroMinimalProps }) {
    const {
        title = "Build Better. Ship Faster.",
        subtitle = "The simplest way to create beautiful landing pages.",
        ctaText = "Start Building",
        ctaLink = "#",
        bgColor = "#ffffff",
        accentColor = "#000000",
    } = props;

    const isDark = !isLightColor(bgColor);

    return (
        <section style={{ backgroundColor: bgColor }}>
            <div className="px-4 mx-auto max-w-5xl py-16 cq-sm:py-24 cq-lg:py-32 cq-xl:py-48">
                <div className="text-center space-y-6 cq-sm:space-y-8">
                    <h1 className={`text-2xl cq-sm:text-4xl cq-md:text-5xl cq-lg:text-6xl cq-xl:text-7xl font-bold tracking-tight leading-tight break-words px-4 ${isDark ? 'text-white' : 'text-gray-900'
                        }`}>
                        {title}
                    </h1>

                    <p className={`text-base cq-sm:text-lg cq-lg:text-xl cq-xl:text-2xl max-w-2xl mx-auto break-words px-4 ${isDark ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                        {subtitle}
                    </p>

                    <div className="pt-4 px-4">
                        <Link
                            href={ctaLink}
                            className="inline-flex items-center px-6 cq-sm:px-8 py-3 cq-sm:py-4 text-sm cq-sm:text-base cq-lg:text-lg font-semibold text-white rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap"
                            style={{ backgroundColor: accentColor }}
                        >
                            {ctaText}
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
