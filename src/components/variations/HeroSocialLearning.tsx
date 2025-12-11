import Link from "next/link";
import { isLightColor } from "@/lib/utils";

interface HeroSocialLearningProps {
    tagline?: string;
    title?: string;
    subtitle?: string;
    ctaText?: string;
    ctaLink?: string;
    secondaryText?: string;
    secondaryLinkText?: string;
    secondaryLink?: string;
    heroImage?: string;
    logo?: string;
    menuItems?: string[];
    bgColor?: string;
    accentColor?: string;
}

export function HeroSocialLearning({ props }: { props: HeroSocialLearningProps }) {
    const {
        tagline = "A social media for learners",
        title = "Connect & learn from the experts",
        subtitle = "Grow your career fast with right mentor.",
        ctaText = "Join for free",
        ctaLink = "#",
        secondaryText = "Already joined us?",
        secondaryLinkText = "Log in",
        secondaryLink = "#",
        heroImage = "https://cdn.rareblocks.xyz/collection/celebration/images/hero/1/hero-img.png",
        logo = "https://cdn.rareblocks.xyz/collection/celebration/images/logo.svg",
        menuItems = ["Features", "Solutions", "Resources", "Pricing"],
        bgColor = "#ffffffff",
        accentColor = "#FCD34D",
    } = props;

    const isDark = !isLightColor(bgColor);

    return (
        <section className="py-8 cq-md:py-16 cq-lg:py-24" style={{ backgroundColor: bgColor }}>
            <div className="px-4 mx-auto max-w-7xl cq-sm:px-6 cq-lg:px-8">
                <div className="grid items-center grid-cols-1 gap-8 cq-lg:gap-12 cq-lg:grid-cols-2">
                    {/* Text Content */}
                    <div className="space-y-4 cq-sm:space-y-6">
                        <p className={`text-xs cq-sm:text-base font-semibold tracking-wider uppercase break-words ${isDark ? 'text-blue-400' : 'text-blue-600'
                            }`}>
                            {tagline}
                        </p>

                        <h1 className={`text-2xl cq-sm:text-4xl cq-md:text-5xl cq-lg:text-6xl cq-xl:text-7xl font-bold leading-tight break-words ${isDark ? 'text-white' : 'text-black'
                            }`}>
                            {title}
                        </h1>

                        <p className={`text-sm cq-sm:text-base cq-lg:text-lg break-words ${isDark ? 'text-gray-300' : 'text-black'
                            }`}>
                            {subtitle}
                        </p>

                        <div className="flex flex-col cq-sm:flex-row items-start cq-sm:items-center gap-4 pt-4">
                            <Link
                                href={ctaLink}
                                className="inline-flex items-center justify-center px-6 py-3 cq-sm:py-4 font-semibold text-white transition-all duration-200 rounded-full text-sm cq-sm:text-base whitespace-nowrap hover:opacity-90"
                                style={{ backgroundColor: accentColor }}
                            >
                                {ctaText}
                                <svg
                                    className="w-5 h-5 cq-sm:w-6 cq-sm:h-6 ml-6 cq-sm:ml-8 -mr-2"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="1.5"
                                        d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </Link>
                        </div>

                        <p className={`text-sm cq-sm:text-base break-words ${isDark ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                            {secondaryText}{" "}
                            <Link href={secondaryLink} className={`transition-all duration-200 hover:underline whitespace-nowrap ${isDark ? 'text-white' : 'text-black'
                                }`}>
                                {secondaryLinkText}
                            </Link>
                        </p>
                    </div>

                    {/* Image */}
                    <div className="w-full max-w-lg mx-auto lg:max-w-none">
                        <img className="w-full h-auto object-contain" src={heroImage} alt="Hero" />
                    </div>
                </div>
            </div>
        </section>
    );
}
