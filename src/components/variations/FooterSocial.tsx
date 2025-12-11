import Link from "next/link";
import { Mail, MapPin, Phone, Facebook, Twitter, Instagram, Linkedin, Github } from "lucide-react";
import { isLightColor } from "@/lib/utils";

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
        bgColor = "#ffffffff",
        accentColor = "#ffffff",
    } = props;

    const isDark = !isLightColor(bgColor);

    return (
        <footer style={{ backgroundColor: bgColor }}>
            <div className="px-4 py-8 cq-sm:py-12 cq-lg:py-16 mx-auto max-w-7xl cq-sm:px-6 cq-lg:px-8">
                <div className="grid grid-cols-1 cq-md:grid-cols-2 gap-8 cq-lg:gap-12">
                    {/* Left Column - Brand & Social */}
                    <div>
                        <h3 className={`text-xl cq-sm:text-2xl cq-lg:text-3xl font-bold mb-3 cq-sm:mb-4 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                            {companyName}
                        </h3>
                        <p className={`text-sm cq-sm:text-base mb-6 cq-sm:mb-8 max-w-md ${isDark ? 'text-gray-400' : 'text-zinc-600'}`}>
                            {tagline}
                        </p>

                        {/* Social Links */}
                        <div className="flex gap-3 cq-sm:gap-4">
                            {[Facebook, Twitter, Instagram, Linkedin, Github].map((Icon, i) => (
                                <Link
                                    key={i}
                                    href="#"
                                    className={`p-2 cq-sm:p-3 rounded-lg transition-colors ${isDark
                                            ? 'bg-white/10 hover:bg-white/20'
                                            : 'bg-black/5 hover:bg-black/10'
                                        }`}
                                >
                                    <Icon className={`h-4 w-4 cq-sm:h-5 cq-sm:w-5 ${isDark ? 'text-white' : 'text-zinc-900'}`} />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Right Column - Contact Info */}
                    <div className="space-y-4 cq-sm:space-y-6">
                        <h4 className={`text-base cq-sm:text-lg font-semibold mb-4 cq-sm:mb-6 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                            Get In Touch
                        </h4>
                        <div className="flex items-start gap-3">
                            <Mail className={`h-4 w-4 cq-sm:h-5 cq-sm:w-5 mt-1 ${isDark ? 'text-gray-400' : 'text-zinc-500'}`} />
                            <div>
                                <p className={`text-xs cq-sm:text-sm ${isDark ? 'text-gray-400' : 'text-zinc-500'}`}>Email</p>
                                <Link href={`mailto:${email}`} className={`text-sm cq-sm:text-base hover:opacity-80 transition-opacity ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                                    {email}
                                </Link>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Phone className={`h-4 w-4 cq-sm:h-5 cq-sm:w-5 mt-1 ${isDark ? 'text-gray-400' : 'text-zinc-500'}`} />
                            <div>
                                <p className={`text-xs cq-sm:text-sm ${isDark ? 'text-gray-400' : 'text-zinc-500'}`}>Phone</p>
                                <Link href={`tel:${phone}`} className={`text-sm cq-sm:text-base hover:opacity-80 transition-opacity ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                                    {phone}
                                </Link>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <MapPin className={`h-4 w-4 cq-sm:h-5 cq-sm:w-5 mt-1 ${isDark ? 'text-gray-400' : 'text-zinc-500'}`} />
                            <div>
                                <p className={`text-xs cq-sm:text-sm ${isDark ? 'text-gray-400' : 'text-zinc-500'}`}>Address</p>
                                <p className={`text-sm cq-sm:text-base ${isDark ? 'text-white' : 'text-zinc-900'}`}>{address}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className={`mt-8 cq-sm:mt-12 pt-6 cq-sm:pt-8 border-t text-center ${isDark ? 'border-gray-700' : 'border-zinc-200'}`}>
                    <p className={`text-xs cq-sm:text-sm ${isDark ? 'text-gray-400' : 'text-zinc-500'}`}>
                        © {new Date().getFullYear()} {companyName}. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
