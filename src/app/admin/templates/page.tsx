import { PrismaClient } from "@prisma/client";
import { FileCode } from "lucide-react";

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export default async function TemplatesPage({
    searchParams,
}: {
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    // searchParams is typed as Promise for Next.js 16 compatibility
    const templates = await prisma.template.findMany({
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Templates</h1>
                    <p className="text-gray-500 mt-2">Manage landing page templates</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template) => (
                    <div
                        key={template.id}
                        className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                    >
                        {template.thumbnail && (
                            <div className="aspect-video bg-gray-100 flex items-center justify-center">
                                <img
                                    src={template.thumbnail}
                                    alt={template.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                    }}
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                                    <FileCode className="w-12 h-12 text-gray-400" />
                                </div>
                            </div>
                        )}

                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {template.name}
                            </h3>

                            {template.description && (
                                <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                                    {template.description}
                                </p>
                            )}

                            <div className="flex items-center justify-between text-sm text-gray-500">
                                <span>{new Date(template.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {templates.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    No templates found
                </div>
            )}
        </div>
    );
}
