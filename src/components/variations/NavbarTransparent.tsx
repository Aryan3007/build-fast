import Link from "next/link";
import { Menu } from "lucide-react";
import { isLightColor } from "@/lib/utils";

interface NavbarTransparentProps {
    siteName?: string;
    menuItems?: string[];
    ctaText?: string;
    bgColor?: string;
    accentColor?: string;
}

export function NavbarTransparent({ props }: { props: NavbarTransparentProps }) {
    const {
        siteName = "Logo",
        menuItems = ["Product", "Features", "Pricing", "Blog"],
        ctaText = "Contact Us",
        bgColor = "#ffffff",
        accentColor = "#1f2937",
    } = props;

    const isDark = !isLightColor(bgColor);

    return (
        <nav className="backdrop-blur-md border-b sticky top-0 z-50" style={{ backgroundColor: `${bgColor}cc`, borderColor: `${accentColor}20` }}>
            <div className="px-4 mx-auto max-w-7xl cq-sm:px-6 cq-lg:px-8">
                <div className="flex items-center justify-between h-14 cq-sm:h-16">
                    {/* Logo */}
                    <Link href="/" className={`text-base cq-sm:text-lg font-bold ${isDark ? 'text-white' : 'text-zinc-900'
                        }`}>
                        {siteName}
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden cq-md:flex items-center gap-4 cq-sm:gap-6 cq-lg:gap-8">
                        {menuItems.map((item, index) => (
                            <Link
                                key={index}
                                href="#"
                                className={`text-sm cq-lg:text-base transition-colors font-medium ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                {item}
                            </Link>
                        ))}
                        <Link
                            href="#"
                            className="px-4 cq-lg:px-5 py-2 rounded-lg text-sm cq-lg:text-base font-semibold transition-opacity hover:opacity-90 text-white"
                            style={{ backgroundColor: accentColor }}
                        >
                            {ctaText}
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button className="cq-md:hidden p-2">
                        <Menu className={`h-5 w-5 ${isDark ? 'text-white' : 'text-zinc-900'}`} />
                    </button>
                </div>
            </div>
        </nav>
    );
}
