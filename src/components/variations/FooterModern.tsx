import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

interface FooterModernProps {
    companyName?: string;
    description?: string;
    columns?: {
        title: string;
        links: string[];
    }[];
    bgColor?: string;
    accentColor?: string;
}

export function FooterModern({ props }: { props: FooterModernProps }) {
    const {
        companyName = "YourCompany",
        description = "Building amazing products for the modern web.",
        columns = [
            { title: "Product", links: ["Features", "Pricing", "Security", "Roadmap"] },
            { title: "Company", links: ["About", "Blog", "Careers", "Press"] },
            { title: "Resources", links: ["Documentation", "Help Center", "Community", "Contact"] },
        ],
        bgColor = "#111827",
        accentColor = "#d1d5db",
    } = props;

    return (
        <footer style={{ backgroundColor: bgColor }}>
            <div className="px-4 py-8 cq-sm:py-12 mx-auto max-w-7xl cq-sm:px-6 cq-lg:px-8">
                <div className="grid grid-cols-1 gap-6 cq-sm:grid-cols-2 cq-lg:grid-cols-5 cq-lg:gap-8">
                    {/* Brand Column */}
                    <div className="cq-lg:col-span-2">
                        <h3 className="text-lg cq-sm:text-xl font-bold text-white mb-3 cq-sm:mb-4">
                            {companyName}
                        </h3>
                        <p className="text-sm cq-sm:text-base text-gray-400 mb-4 cq-sm:mb-6 max-w-sm">
                            {description}
                        </p>
                        <div className="flex gap-4">
                            <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Facebook className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Twitter className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Instagram className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Linkedin className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Links Columns */}
                    {columns.map((column, index) => (
                        <div key={index}>
                            <h4 className="text-sm cq-sm:text-base font-semibold text-white mb-3 cq-sm:mb-4">
                                {column.title}
                            </h4>
                            <ul className="space-y-2 cq-sm:space-y-3">
                                {column.links.map((link, linkIndex) => (
                                    <li key={linkIndex}>
                                        <Link
                                            href="#"
                                            className="text-xs cq-sm:text-sm text-gray-400 hover:text-white transition-colors"
                                        >
                                            {link}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Bar */}
                <div className="mt-8 cq-sm:mt-12 pt-6 cq-sm:pt-8 border-t border-gray-800 text-center cq-sm:text-left">
                    <p className="text-xs cq-sm:text-sm text-gray-500">
                        © {new Date().getFullYear()} {companyName}. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
