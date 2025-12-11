import { PrismaClient } from "@prisma/client";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export default async function SitesPage() {
    const sites = await prisma.site.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            user: {
                select: {
                    email: true,
                    name: true
                }
            },
            _count: {
                select: { pages: true }
            }
        }
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Sites</h1>
                    <p className="text-gray-500 mt-2">Manage all sites on the platform</p>
                </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Site Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Subdomain
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Owner
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Pages
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Created
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {sites.map((site) => (
                                <tr key={site.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{site.name}</div>
                                        {site.description && (
                                            <div className="text-sm text-gray-500">{site.description}</div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{site.subdomain}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{site.user.email}</div>
                                        {site.user.name && (
                                            <div className="text-sm text-gray-500">{site.user.name}</div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{site._count.pages}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(site.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <Link
                                            href={`/preview/${site.subdomain}`}
                                            className="text-blue-600 hover:text-blue-900 inline-flex items-center gap-1"
                                            target="_blank"
                                        >
                                            View
                                            <ExternalLink className="w-3 h-3" />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {sites.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    No sites found
                </div>
            )}
        </div>
    );
}
