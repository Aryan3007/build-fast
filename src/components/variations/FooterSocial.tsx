import Link from "next/link";
import { Mail, MapPin, Phone, Facebook, Twitter, Instagram, Linkedin, Github } from "lucide-react";

interface FooterSocialProps {
    companyName?: string;
    tagline?: string;
    email?: string;
    phone?: string;
    address?: string;
    bgColor?: string;
    accentColor?: string;
}

export function FooterSocial({ props }: { props: FooterSocialProps }) {
    const {
        companyName = "BrandName",
        tagline = "Building the future, one line at a time.",
        email = "hello@company.com",
        phone = "+1 (555) 123-4567",
        address = "123 Main St, City, State 12345",
        bgColor = "#111827",
        accentColor = "#ffffff",
    } = props;

    return (
        <footer style={{ backgroundColor: bgColor }}>
            <div className="px-4 py-8 cq-sm:py-12 cq-lg:py-16 mx-auto max-w-7xl cq-sm:px-6 cq-lg:px-8">
                <div className="grid grid-cols-1 cq-md:grid-cols-2 gap-8 cq-lg:gap-12">
                    {/* Left Column - Brand & Social */}
                    <div>
                        <h3 className="text-xl cq-sm:text-2xl cq-lg:text-3xl font-bold text-white mb-3 cq-sm:mb-4">
                            {companyName}
                        </h3>
                        <p className="text-sm cq-sm:text-base text-gray-400 mb-6 cq-sm:mb-8 max-w-md">
                            {tagline}
                        </p>

                        {/* Social Links */}
                        <div className="flex gap-3 cq-sm:gap-4">
                            <Link
                                href="#"
                                className="p-2 cq-sm:p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                            >
                                <Facebook className="h-4 w-4 cq-sm:h-5 cq-sm:w-5 text-white" />
                            </Link>
                            <Link
                                href="#"
                                className="p-2 cq-sm:p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                            >
                                <Twitter className="h-4 w-4 cq-sm:h-5 cq-sm:w-5 text-white" />
                            </Link>
                            <Link
                                href="#"
                                className="p-2 cq-sm:p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                            >
                                <Instagram className="h-4 w-4 cq-sm:h-5 cq-sm:w-5 text-white" />
                            </Link>
                            <Link
                                href="#"
                                className="p-2 cq-sm:p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                            >
                                <Linkedin className="h-4 w-4 cq-sm:h-5 cq-sm:w-5 text-white" />
                            </Link>
                            <Link
                                href="#"
                                className="p-2 cq-sm:p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                            >
                                <Github className="h-4 w-4 cq-sm:h-5 cq-sm:w-5 text-white" />
                            </Link>
                        </div>
                    </div>

                    {/* Right Column - Contact Info */}
                    <div className="space-y-4 cq-sm:space-y-6">
                        <h4 className="text-base cq-sm:text-lg font-semibold text-white mb-4 cq-sm:mb-6">
                            Get In Touch
                        </h4>
                        <div className="flex items-start gap-3">
                            <Mail className="h-4 w-4 cq-sm:h-5 cq-sm:w-5 mt-1 text-gray-400" />
                            <div>
                                <p className="text-xs cq-sm:text-sm text-gray-400">Email</p>
                                <Link href={`mailto:${email}`} className="text-sm cq-sm:text-base text-white hover:text-gray-300">
                                    {email}
                                </Link>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Phone className="h-4 w-4 cq-sm:h-5 cq-sm:w-5 mt-1 text-gray-400" />
                            <div>
                                <p className="text-xs cq-sm:text-sm text-gray-400">Phone</p>
                                <Link href={`tel:${phone}`} className="text-sm cq-sm:text-base text-white hover:text-gray-300">
                                    {phone}
                                </Link>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <MapPin className="h-4 w-4 cq-sm:h-5 cq-sm:w-5 mt-1 text-gray-400" />
                            <div>
                                <p className="text-xs cq-sm:text-sm text-gray-400">Address</p>
                                <p className="text-sm cq-sm:text-base text-white">{address}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-8 cq-sm:mt-12 pt-6 cq-sm:pt-8 border-t border-gray-700 text-center">
                    <p className="text-xs cq-sm:text-sm text-gray-400">
                        © {new Date().getFullYear()} {companyName}. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
