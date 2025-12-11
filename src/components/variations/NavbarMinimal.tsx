import Link from "next/link";
import { Menu } from "lucide-react";

interface NavbarMinimalProps {
    siteName?: string;
    menuItems?: string[];
    bgColor?: string;
    accentColor?: string;
}

export function NavbarMinimal({ props }: { props: NavbarMinimalProps }) {
    const {
        siteName = "Brand",
        menuItems = ["Home", "About", "Services", "Contact"],
        bgColor = "#ffffff",
        accentColor = "#1f2937",
    } = props;

    return (
        <nav className="border-b" style={{ backgroundColor: bgColor, borderColor: `${accentColor}20` }}>
            <div className="px-4 mx-auto max-w-7xl cq-sm:px-6 cq-lg:px-8">
                <div className="flex items-center justify-between h-14 cq-sm:h-16">
                    {/* Logo */}
                    <Link href="/" className="text-base cq-sm:text-lg font-bold text-zinc-900">
                        {siteName}
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden cq-md:flex items-center gap-4 cq-sm:gap-6 cq-lg:gap-8">
                        {menuItems.map((item, index) => (
                            <Link
                                key={index}
                                href="#"
                                className="text-sm cq-lg:text-base text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                {item}
                            </Link>
                        ))}
                    </div>

                    {/* Mobile Menu Button */}
                    <button className="cq-md:hidden p-2">
                        <Menu className="h-5 w-5 text-zinc-900" />
                    </button>
                </div>
            </div>
        </nav>
    );
}
