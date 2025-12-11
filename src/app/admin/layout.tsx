import { isUserAdmin } from "@/lib/admin-check";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Users, Globe, FileCode, Grid3x3 } from "lucide-react";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const isAdmin = await isUserAdmin();

    if (!isAdmin) {
        redirect("/");
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-6 border-b border-gray-200">
                    <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage your platform</p>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    <NavLink href="/admin" icon={LayoutDashboard}>
                        Dashboard
                    </NavLink>
                    <NavLink href="/admin/users" icon={Users}>
                        Users
                    </NavLink>
                    <NavLink href="/admin/sites" icon={Globe}>
                        Sites
                    </NavLink>
                    <NavLink href="/admin/templates" icon={FileCode}>
                        Templates
                    </NavLink>
                    <NavLink href="/admin/components" icon={Grid3x3}>
                        Components
                    </NavLink>
                </nav>

                <div className="p-4 border-t border-gray-200">
                    <Link
                        href="/"
                        className="block text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        ← Back to App
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <div className="max-w-7xl mx-auto p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}

function NavLink({
    href,
    icon: Icon,
    children,
}: {
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    children: React.ReactNode;
}) {
    return (
        <Link
            href={href}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors group"
        >
            <Icon className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
            <span className="font-medium">{children}</span>
        </Link>
    );
}
