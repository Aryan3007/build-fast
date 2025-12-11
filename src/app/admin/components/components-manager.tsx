"use client";

import { useState } from "react";
import { Eye, Pencil, Plus, X, Save } from "lucide-react";

interface Component {
    id: string;
    name: string;
    category: string;
    type: string;
    componentFile: string | null;
    thumbnail: string | null;
    props: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export function ComponentsManager({ components }: { components: Component[] }) {
    const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState<Partial<Component>>({});

    // Group components by category
    const groupedComponents = components.reduce((acc, component) => {
        if (!acc[component.category]) {
            acc[component.category] = [];
        }
        acc[component.category].push(component);
        return acc;
    }, {} as Record<string, Component[]>);

    const handleView = (component: Component) => {
        setSelectedComponent(component);
        setIsEditing(false);
        setIsAdding(false);
    };

    const handleEdit = (component: Component) => {
        setSelectedComponent(component);
        setFormData(component);
        setIsEditing(true);
        setIsAdding(false);
    };

    const handleAdd = () => {
        setFormData({
            name: "",
            category: "",
            type: "",
            componentFile: "",
            description: "",
            props: JSON.stringify({}, null, 2),
            thumbnail: "",
        });
        setIsAdding(true);
        setIsEditing(false);
        setSelectedComponent(null);
    };

    const handleSave = async () => {
        try {
            const url = isAdding ? "/api/admin/components" : `/api/admin/components/${selectedComponent?.id}`;
            const method = isAdding ? "POST" : "PATCH";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                window.location.reload();
            } else {
                alert("Failed to save component");
            }
        } catch (error) {
            console.error("Error saving component:", error);
            alert("Error saving component");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this component?")) return;

        try {
            const response = await fetch(`/api/admin/components/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                window.location.reload();
            } else {
                alert("Failed to delete component");
            }
        } catch (error) {
            console.error("Error deleting component:", error);
            alert("Error deleting component");
        }
    };

    const closeModal = () => {
        setSelectedComponent(null);
        setIsEditing(false);
        setIsAdding(false);
        setFormData({});
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Components</h1>
                    <p className="text-gray-500 mt-2">Manage component library</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add Component
                </button>
            </div>

            {/* Component Groups */}
            {Object.entries(groupedComponents).map(([category, categoryComponents]) => (
                <div key={category} className="space-y-4">
                    <div className="flex items-center gap-2">
                        <h2 className="text-xl font-semibold text-gray-900 capitalize">{category}</h2>
                        <span className="text-sm text-gray-500">({categoryComponents.length})</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {categoryComponents.map((component) => (
                            <div
                                key={component.id}
                                className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{component.name}</h3>
                                        <p className="text-xs text-gray-500">{component.type}</p>
                                    </div>
                                </div>

                                {component.description && (
                                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{component.description}</p>
                                )}

                                <div className="flex items-center gap-2 mt-4">
                                    <button
                                        onClick={() => handleView(component)}
                                        className="flex items-center gap-1 px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                                    >
                                        <Eye className="w-3 h-3" />
                                        View
                                    </button>
                                    <button
                                        onClick={() => handleEdit(component)}
                                        className="flex items-center gap-1 px-3 py-1.5 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-colors"
                                    >
                                        <Pencil className="w-3 h-3" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(component.id)}
                                        className="flex items-center gap-1 px-3 py-1.5 text-xs bg-red-100 hover:bg-red-200 text-red-700 rounded transition-colors"
                                    >
                                        <X className="w-3 h-3" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            {components.length === 0 && (
                <div className="text-center py-12 text-gray-500">No components found</div>
            )}

            {/* View/Edit Modal */}
            {(selectedComponent || isAdding) && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
                            <h2 className="text-xl font-bold text-gray-900">
                                {isAdding ? "Add Component" : isEditing ? "Edit Component" : "View Component"}
                            </h2>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            {isEditing || isAdding ? (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                        <input
                                            type="text"
                                            value={formData.name || ""}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                            <input
                                                type="text"
                                                value={formData.category || ""}
                                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                placeholder="e.g., hero, features, pricing"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                            <input
                                                type="text"
                                                value={formData.type || ""}
                                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                placeholder="e.g., Hero, Features"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Component File
                                            <span className="text-xs text-gray-500 ml-2">(e.g., HeroSocialLearning)</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.componentFile || ""}
                                            onChange={(e) => setFormData({ ...formData, componentFile: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            placeholder="HeroSocialLearning"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Must match a variation file in src/components/variations/
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                        <textarea
                                            value={formData.description || ""}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            rows={2}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail URL</label>
                                        <input
                                            type="text"
                                            value={formData.thumbnail || ""}
                                            onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            placeholder="/components/hero-modern.png"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Props (JSON)</label>
                                        <textarea
                                            value={formData.props || ""}
                                            onChange={(e) => setFormData({ ...formData, props: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                                            rows={8}
                                        />
                                    </div>

                                    <div className="flex gap-2 pt-4">
                                        <button
                                            onClick={handleSave}
                                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                        >
                                            <Save className="w-4 h-4" />
                                            Save
                                        </button>
                                        <button
                                            onClick={closeModal}
                                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <span className="text-sm font-medium text-gray-500">Name</span>
                                        <p className="text-gray-900 mt-1">{selectedComponent?.name}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <span className="text-sm font-medium text-gray-500">Category</span>
                                            <p className="text-gray-900 mt-1 capitalize">{selectedComponent?.category}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium text-gray-500">Type</span>
                                            <p className="text-gray-900 mt-1">{selectedComponent?.type}</p>
                                        </div>
                                    </div>

                                    {selectedComponent?.description && (
                                        <div>
                                            <span className="text-sm font-medium text-gray-500">Description</span>
                                            <p className="text-gray-900 mt-1">{selectedComponent.description}</p>
                                        </div>
                                    )}

                                    {selectedComponent?.thumbnail && (
                                        <div>
                                            <span className="text-sm font-medium text-gray-500">Thumbnail</span>
                                            <p className="text-gray-900 mt-1 text-sm">{selectedComponent.thumbnail}</p>
                                        </div>
                                    )}

                                    <div>
                                        <span className="text-sm font-medium text-gray-500">Props</span>
                                        <pre className="text-gray-900 mt-1 bg-gray-50 p-3 rounded-lg overflow-x-auto text-sm">
                                            {JSON.stringify(JSON.parse(selectedComponent?.props || "{}"), null, 2)}
                                        </pre>
                                    </div>

                                    <button
                                        onClick={() => selectedComponent && handleEdit(selectedComponent)}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        <Pencil className="w-4 h-4" />
                                        Edit Component
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
