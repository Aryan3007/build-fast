import Link from "next/link";
import { Menu } from "lucide-react";

interface NavbarModernProps {
    logo?: string;
    siteName?: string;
    menuItems?: string[];
    ctaText?: string;
    ctaLink?: string;
    bgColor?: string;
    accentColor?: string;
}

export function NavbarModern({ props }: { props: NavbarModernProps }) {
    const {
        siteName = "YourBrand",
        menuItems = ["Features", "Pricing", "About", "Contact"],
        ctaText = "Get Started",
        ctaLink = "#",
        bgColor = "#6366f1",
        accentColor = "#ffffff",
    } = props;

    return (
        <nav className="text-white" style={{ background: `linear-gradient(135deg, ${bgColor} 0%, #a855f7 100%)` }}>
            <div className="px-4 mx-auto max-w-7xl cq-sm:px-6 cq-lg:px-8">
                <div className="flex items-center justify-between h-14 cq-sm:h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link href="/" className="text-lg cq-sm:text-xl font-bold" style={{ color: accentColor }}>
                            {siteName}
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden cq-md:flex items-center gap-4 cq-sm:gap-6 cq-lg:gap-8">
                        {menuItems.map((item, index) => (
                            <Link
                                key={index}
                                href="#"
                                className="text-sm cq-lg:text-base hover:opacity-70 transition-opacity"
                                style={{ color: accentColor }}
                            >
                                {item}
                            </Link>
                        ))}
                        <Link
                            href={ctaLink}
                            className="px-4 cq-lg:px-6 py-2 rounded-full text-sm cq-lg:text-base font-semibold hover:opacity-90 transition-opacity"
                            style={{ backgroundColor: accentColor, color: bgColor }}
                        >
                            {ctaText}
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button className="cq-md:hidden p-2">
                        <Menu className="h-5 w-5" style={{ color: accentColor }} />
                    </button>
                </div>
            </div>
        </nav>
    );
}
