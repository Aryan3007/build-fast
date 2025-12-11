import Link from "next/link";

interface HeroModernProps {
    title?: string;
    subtitle?: string;
    ctaText?: string;
    ctaLink?: string;
    bgColor?: string;
    accentColor?: string;
}

export function HeroModern({ props }: { props: HeroModernProps }) {
    const {
        title = "The New Era AI Command Center",
        subtitle = "Plan, launch and scale — in one glass-clear dashboard for modern founders.",
        ctaText = "Get Template",
        ctaLink = "#",
        bgColor = "#6366f1",
        accentColor = "#ffffff",
    } = props;

    return (
        <section className="relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${bgColor} 0%, #a855f7 50%, #ec4899 100%)` }}>
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-1/2 -right-1/2 w-64 h-64 cq-sm:w-96 cq-sm:h-96 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-1/2 -left-1/2 w-64 h-64 cq-sm:w-96 cq-sm:h-96 bg-white/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative px-4 mx-auto max-w-7xl cq-sm:px-6 cq-lg:px-8 py-16 cq-sm:py-24 cq-lg:py-32 cq-xl:py-40">
                <div className="text-center space-y-6 cq-sm:space-y-8">
                    <h1 className="text-2xl cq-sm:text-4xl cq-md:text-5xl cq-lg:text-6xl cq-xl:text-7xl font-bold tracking-tight text-white leading-tight break-words px-4">
                        {title}
                    </h1>

                    <p className="mt-4 cq-sm:mt-6 text-sm cq-sm:text-lg cq-lg:text-xl leading-7 cq-sm:leading-8 text-gray-100 max-w-2xl mx-auto break-words px-4">
                        {subtitle}
                    </p>

                    <div className="mt-6 cq-sm:mt-10 flex items-center justify-center gap-x-4 cq-sm:gap-x-6 px-4">
                        <Link
                            href={ctaLink}
                            className="rounded-full px-6 cq-sm:px-8 py-3 cq-sm:py-4 text-sm cq-sm:text-base font-semibold shadow-sm hover:opacity-90 transition-all whitespace-nowrap"
                            style={{ backgroundColor: accentColor, color: bgColor }}
                        >
                            {ctaText}
                        </Link>
                    </div>
                </div>
            </div>

          
        </section>
    );
}
