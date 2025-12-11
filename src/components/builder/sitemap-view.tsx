"use client"

import { useBuilder } from "./builder-context"
import { ChevronDown, ChevronRight, FileText, Folder, GripVertical, MoreVertical, Plus, Trash2, Edit2, X } from "lucide-react"
import { useState } from "react"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { arrayMove } from "@dnd-kit/sortable"
import { Button } from "@/components/ui/button"

interface AddSectionModalProps {
    isOpen: boolean
    onClose: () => void
    onAdd: (sectionData: any) => void
}

function AddSectionModal({ isOpen, onClose, onAdd }: AddSectionModalProps) {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [variant, setVariant] = useState("HeroModern")

    const componentTypes = [
        { value: "HeroModern", label: "Hero - Modern" },
        { value: "HeroMinimal", label: "Hero - Minimal" },
        { value: "FeaturesCards", label: "Features - Cards" },
        { value: "FeaturesGrid", label: "Features - Grid" },
        { value: "PricingSimple", label: "Pricing - Simple" },
        { value: "NavbarModern", label: "Navbar - Modern" },
        { value: "NavbarMinimal", label: "Navbar - Minimal" },
        { value: "FooterModern", label: "Footer - Modern" },
        { value: "FooterMinimal", label: "Footer - Minimal" },
    ]

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onAdd({
            title: title || variant,
            description,
            variant,
            type: variant.replace(/Modern|Minimal|Cards|Grid|Simple/g, '').trim() || variant
        })
        setTitle("")
        setDescription("")
        setVariant("HeroModern")
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-zinc-900">Add New Section</h3>
                    <button onClick={onClose} className="p-1 hover:bg-zinc-100 rounded">
                        <X className="h-5 w-5 text-zinc-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-1">Component Type</label>
                        <select
                            value={variant}
                            onChange={(e) => setVariant(e.target.value)}
                            className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            {componentTypes.map(type => (
                                <option key={type.value} value={type.value}>{type.label}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-1">Title (optional)</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., Hero Section"
                            className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-1">Description (optional)</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Brief description of this section..."
                            rows={3}
                            className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        />
                    </div>

                    <div className="flex gap-2 pt-2">
                        <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                            Cancel
                        </Button>
                        <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                            Add Section
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

interface AddPageModalProps {
    isOpen: boolean
    onClose: () => void
    onAdd: (pageData: any) => void
}

function AddPageModal({ isOpen, onClose, onAdd }: AddPageModalProps) {
    const [name, setName] = useState("")
    const [slug, setSlug] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim()) return

        const generatedSlug = slug || name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
        onAdd({
            name: name.trim(),
            slug: generatedSlug
        })
        setName("")
        setSlug("")
        onClose()
    }

    const handleNameChange = (value: string) => {
        setName(value)
        if (!slug) {
            setSlug(value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-zinc-900">Add New Page</h3>
                    <button onClick={onClose} className="p-1 hover:bg-zinc-100 rounded">
                        <X className="h-5 w-5 text-zinc-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-1">Page Name *</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => handleNameChange(e.target.value)}
                            placeholder="e.g., About Us"
                            required
                            className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-1">URL Slug *</label>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-zinc-500">/</span>
                            <input
                                type="text"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))}
                                placeholder="about-us"
                                required
                                className="flex-1 px-3 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <p className="text-xs text-zinc-500 mt-1">Auto-generated from page name</p>
                    </div>

                    <div className="flex gap-2 pt-2">
                        <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                            Cancel
                        </Button>
                        <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                            Add Page
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

interface SectionNodeProps {
    section: any
    pageId: string
    index: number
    isLast: boolean
}

function SectionNode({ section, pageId, index, isLast }: SectionNodeProps) {
    const { setSelectedBlockId } = useBuilder()
    const [showActions, setShowActions] = useState(false)
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: `${pageId}-${index}` })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="group relative pl-8"
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
        >
            {/* Tree Lines */}
            <div className="absolute left-0 top-0 bottom-0 flex pointer-events-none">
                {/* Vertical line */}
                {!isLast && (
                    <div className="w-px bg-zinc-300 ml-4" style={{ left: '0px' }} />
                )}
                {/* Horizontal line */}
                <div className="absolute top-6 left-4 w-4 h-px bg-zinc-300" />
                {/* Corner for last item */}
                {isLast && (
                    <div className="absolute top-0 left-4 w-px h-6 bg-zinc-300" />
                )}
            </div>

            <div className="flex items-start gap-2 py-2.5 px-4 ml-0 hover:bg-white rounded-lg border border-transparent hover:border-zinc-200 hover:shadow-sm cursor-pointer transition-all duration-200">
                {/* Drag Handle */}
                <div
                    {...attributes}
                    {...listeners}
                    className={`mt-1 cursor-grab active:cursor-grabbing transition-opacity ${showActions ? 'opacity-100' : 'opacity-0'}`}
                >
                    <GripVertical className="h-4 w-4 text-zinc-400 hover:text-zinc-600" />
                </div>

                {/* Icon */}
                <div className="mt-0.5 flex-shrink-0">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                        <FileText className="h-4 w-4 text-blue-600" />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-zinc-900 truncate">
                                {section.title || section.variant || section.type}
                            </h4>
                            {section.description && (
                                <p className="text-xs text-zinc-500 mt-1 line-clamp-2 leading-relaxed">
                                    {section.description}
                                </p>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                                <span className="text-xs text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded">
                                    {section.variant || section.type}
                                </span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className={`flex items-center gap-1 transition-opacity ${showActions ? 'opacity-100' : 'opacity-0'}`}>
                            <button
                                className="p-1.5 hover:bg-zinc-100 rounded transition-colors"
                                onClick={(e) => {
                                    e.stopPropagation()
                                }}
                                title="Edit section"
                            >
                                <Edit2 className="h-3.5 w-3.5 text-zinc-500" />
                            </button>
                            <button
                                className="p-1.5 hover:bg-red-50 rounded transition-colors"
                                onClick={(e) => {
                                    e.stopPropagation()
                                }}
                                title="Delete section"
                            >
                                <Trash2 className="h-3.5 w-3.5 text-red-500" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

interface PageNodeProps {
    page: any
    onReorder: (pageId: string, sections: any[]) => void
    onAddSection: (pageId: string, section: any) => void
}

function PageNode({ page, onReorder, onAddSection }: PageNodeProps) {
    const [isExpanded, setIsExpanded] = useState(true)
    const [sections, setSections] = useState(page.sections || [])
    const [showActions, setShowActions] = useState(false)
    const [showAddModal, setShowAddModal] = useState(false)

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor)
    )

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        if (!over || active.id === over.id) return

        const activeIndex = parseInt(active.id.toString().split('-')[1])
        const overIndex = parseInt(over.id.toString().split('-')[1])

        const newSections = arrayMove(sections, activeIndex, overIndex)
        setSections(newSections)
        onReorder(page.id, newSections)
    }

    const handleAddSection = (sectionData: any) => {
        const newSections = [...sections, sectionData]
        setSections(newSections)
        onAddSection(page.id, sectionData)
    }

    return (
        <>
            <div className="mb-4">
                {/* Page Header */}
                <div
                    className="flex items-center gap-3 p-4 bg-white border border-zinc-200 rounded-xl hover:border-blue-300 hover:shadow-md cursor-pointer group transition-all duration-200"
                    onClick={() => setIsExpanded(!isExpanded)}
                    onMouseEnter={() => setShowActions(true)}
                    onMouseLeave={() => setShowActions(false)}
                >
                    <button className="text-zinc-400 hover:text-zinc-700 transition-colors flex-shrink-0">
                        {isExpanded ? (
                            <ChevronDown className="h-5 w-5" />
                        ) : (
                            <ChevronRight className="h-5 w-5" />
                        )}
                    </button>

                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                        <Folder className="h-5 w-5 text-white" />
                    </div>

                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-zinc-900 truncate text-base">{page.name}</h3>
                        <p className="text-xs text-zinc-500 mt-0.5">/{page.slug}</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-zinc-50 px-3 py-1.5 rounded-lg">
                            <FileText className="h-3.5 w-3.5 text-zinc-400" />
                            <span className="text-xs font-medium text-zinc-600">
                                {sections.length}
                            </span>
                        </div>

                        <button
                            className={`p-2 hover:bg-zinc-100 rounded-lg transition-all ${showActions ? 'opacity-100' : 'opacity-0'}`}
                            onClick={(e) => {
                                e.stopPropagation()
                            }}
                        >
                            <MoreVertical className="h-4 w-4 text-zinc-500" />
                        </button>
                    </div>
                </div>

                {/* Sections Tree */}
                {isExpanded && (
                    <div className="mt-3 relative">
                        {sections.length > 0 && (
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleDragEnd}
                            >
                                <SortableContext
                                    items={sections.map((_: any, i: number) => `${page.id}-${i}`)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {sections.map((section: any, index: number) => (
                                        <SectionNode
                                            key={`${page.id}-${index}`}
                                            section={section}
                                            pageId={page.id}
                                            index={index}
                                            isLast={index === sections.length - 1}
                                        />
                                    ))}
                                </SortableContext>
                            </DndContext>
                        )}

                        {/* Add Section Button */}
                        <div className="pl-8 mt-2">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setShowAddModal(true)
                                }}
                                className="flex items-center gap-2 py-2.5 px-4 ml-0 text-sm text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border-2 border-dashed border-blue-200 hover:border-blue-300 transition-all w-full font-medium"
                            >
                                <Plus className="h-4 w-4" />
                                Add Section
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <AddSectionModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onAdd={handleAddSection}
            />
        </>
    )
}

export function SitemapView() {
    const { project } = useBuilder()
    const [pages, setPages] = useState(project?.pages || [])
    const [showAddPageModal, setShowAddPageModal] = useState(false)

    const handleReorder = async (pageId: string, newSections: any[]) => {
        // Update local state
        setPages(pages.map((p: any) =>
            p.id === pageId ? { ...p, sections: newSections } : p
        ))

        // Persist to database
        try {
            const response = await fetch(`/api/projects/${project.id}/pages/${pageId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sections: newSections })
            })

            if (!response.ok) {
                console.error('Failed to update page sections')
            }
        } catch (error) {
            console.error('Error updating sections:', error)
        }
    }

    const handleAddSection = async (pageId: string, sectionData: any) => {
        // Update local state
        setPages(pages.map((p: any) =>
            p.id === pageId ? { ...p, sections: [...p.sections, sectionData] } : p
        ))

        // Persist to database
        const page = pages.find((p: any) => p.id === pageId)
        if (page) {
            const newSections = [...page.sections, sectionData]
            try {
                await fetch(`/api/projects/${project.id}/pages/${pageId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ sections: newSections })
                })
            } catch (error) {
                console.error('Error adding section:', error)
            }
        }
    }

    const handleAddPage = async (pageData: any) => {
        try {
            const response = await fetch(`/api/projects/${project.id}/pages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: pageData.name,
                    slug: pageData.slug,
                    order: pages.length
                })
            })

            if (response.ok) {
                const data = await response.json()
                if (data.success && data.page) {
                    setPages([...pages, data.page])
                }
            }
        } catch (error) {
            console.error('Error adding page:', error)
        }
    }

    if (!project || !pages || pages.length === 0) {
        return (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-zinc-50 to-zinc-100">
                <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                        <Folder className="h-10 w-10 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-zinc-900 mb-2">No sitemap available</h3>
                    <p className="text-sm text-zinc-500">Create a project to get started</p>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="h-full mt-12 overflow-y-auto p-8 bg-gradient-to-br from-zinc-50 via-white to-zinc-50">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="mb-8 pb-6 border-b border-zinc-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-3xl font-bold text-zinc-900 mb-2 bg-gradient-to-r from-zinc-900 to-zinc-600 bg-clip-text text-transparent">
                                    Sitemap
                                </h2>
                                <p className="text-zinc-600 font-medium">
                                    {project.name}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="bg-white px-4 py-2 rounded-lg border border-zinc-200 shadow-sm">
                                    <div className="flex items-center gap-2">
                                        <Folder className="h-4 w-4 text-blue-600" />
                                        <span className="text-sm font-semibold text-zinc-900">
                                            {pages.length}
                                        </span>
                                        <span className="text-sm text-zinc-500">
                                            {pages.length === 1 ? 'page' : 'pages'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 mt-4 text-sm text-zinc-500 bg-blue-50 px-3 py-2 rounded-lg border border-blue-100">
                            <GripVertical className="h-4 w-4 text-blue-600" />
                            <span>Drag sections to reorder within pages</span>
                        </div>
                    </div>

                    {/* Pages Tree */}
                    <div className="space-y-4">
                        {pages
                            .sort((a: any, b: any) => a.order - b.order)
                            .map((page: any) => (
                                <PageNode
                                    key={page.id}
                                    page={page}
                                    onReorder={handleReorder}
                                    onAddSection={handleAddSection}
                                />
                            ))}
                    </div>

                    {/* Add Page Button */}
                    <button
                        onClick={() => setShowAddPageModal(true)}
                        className="mt-6 w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-zinc-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 text-zinc-600 hover:text-blue-600 transition-all font-medium shadow-sm hover:shadow"
                    >
                        <Plus className="h-5 w-5" />
                        <span>Add New Page</span>
                    </button>
                </div>
            </div>

            <AddPageModal
                isOpen={showAddPageModal}
                onClose={() => setShowAddPageModal(false)}
                onAdd={handleAddPage}
            />
        </>
    )
}
