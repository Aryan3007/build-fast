import Link from "next/link";

interface FooterMinimalProps {
    companyName?: string;
    links?: string[];
    bgColor?: string;
    accentColor?: string;
}

export function FooterMinimal({ props }: { props: FooterMinimalProps }) {
    const {
        companyName = "Company",
        links = ["Privacy", "Terms", "Contact"],
        bgColor = "#ffffff",
        accentColor = "#1f2937",
    } = props;

    return (
        <footer className="border-t" style={{ backgroundColor: bgColor }}>
            <div className="px-4 py-6 cq-sm:py-8 mx-auto max-w-7xl cq-sm:px-6 cq-lg:px-8">
                <div className="flex flex-col cq-sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs cq-sm:text-sm text-gray-600">
                        © {new Date().getFullYear()} {companyName}. All rights reserved.
                    </p>
                    <div className="flex gap-4 cq-sm:gap-6">
                        {links.map((link, index) => (
                            <Link
                                key={index}
                                href="#"
                                className="text-xs cq-sm:text-sm text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                {link}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
