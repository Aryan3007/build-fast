"use client"

import { DndContext, rectIntersection, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent, DragOverlay, DragStartEvent } from "@dnd-kit/core"
import { useBuilder } from "./builder-context"
import { LeftSidebar, VariantCard } from "./left-sidebar"
import { Canvas } from "./canvas"

import { ArrowLeft, ChevronLeft, Layers, Eye, Sparkles, Undo2, Redo2, ChevronDown } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ComponentLibraryModal } from "./component-library-modal"
import { ThemeSelector } from "./theme-selector"
import { PublishModal } from "./publish-modal"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

export function BuilderLayout() {
    const { blocks, reorderBlocks, moveBlock, addComponentFromLibrary, addBlockAtPosition, updateBlock, setLoadingDropZone, undo, redo, canUndo, canRedo, project, setDraggingBlockId } = useBuilder()
    const [showComponentModal, setShowComponentModal] = useState(false)
    const [showPublishModal, setShowPublishModal] = useState(false)
    const [showLeftSidebar, setShowLeftSidebar] = useState(true)
    const [activeId, setActiveId] = useState<string | null>(null)
    const [activeVariant, setActiveVariant] = useState<{ variant: string;[key: string]: unknown } | null>(null)
    const [isSaving, setIsSaving] = useState(false)
    const [lastSaved, setLastSaved] = useState<Date | null>(null)

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 4, // Require 8px movement before drag starts (prevents accidental drags)
            },
        }),
        useSensor(KeyboardSensor)
    )

    const handleDragStart = (event: DragStartEvent) => {
        const id = event.active.id as string
        setActiveId(id)

        if (event.active.data.current?.type === 'component-variant') {
            // Find the variant data for the overlay
            // We reconstruct it from data because we don't have the full variant object here easily without prop drilling
            // But we passed everything needed in active.data.current
            setActiveVariant({
                variant: event.active.data.current.variant || '',
                name: 'New Component', // Fallback, though we should probably pass this in data too if we want it perfect
                description: event.active.data.current.variant,
                // If we want exact visual match, we might need to pass the whole variant object in data
                ...event.active.data.current
            })
        }

        setDraggingBlockId(id)
    }

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event

        setActiveId(null)
        setActiveVariant(null)
        setDraggingBlockId(null)

        if (!over) {
            console.log('❌ No drop target found')
            return
        }

        // Check if dragging from sidebar (component variant)
        if (active.data.current?.type === 'component-variant') {
            console.log('✅ Component variant detected:', active.data.current.variant)
            const variant = active.data.current.variant
            let dropPosition = -1

            // Check if dropped on a DropZone
            if (over.id.toString().startsWith('drop-zone-')) {
                dropPosition = parseInt(over.id.toString().replace('drop-zone-', ''))
            }
            // Check if dropped on a Block (fallback)
            else {
                const overIndex = blocks.findIndex(b => b.id === over.id)
                if (overIndex !== -1) {
                    // If dropped on a block, insert AFTER it
                    dropPosition = overIndex + 1
                    console.log('📍 Dropped on block:', over.id, 'Index:', overIndex, '-> New Position:', dropPosition)
                } else {
                    console.log('⚠️ Dropped on unknown item:', over.id)
                }
            }

            if (dropPosition !== -1 && !isNaN(dropPosition)) {
                console.log('📍 Drop position:', dropPosition)

                // Show loading in the drop zone
                setLoadingDropZone(dropPosition)

                // Add component INSTANTLY with default props (or empty)
                const defaultProps = active.data.current.defaultProps || {}
                const blockId = await addBlockAtPosition(variant, dropPosition, defaultProps)

                // Fetch AI content in background - MERGE with defaults if AI returns something
                fetch('/api/ai/generate-component-content', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        variant,
                        projectDescription: project?.description || '',
                        existingComponents: blocks
                    })
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.success && data.props) {
                            updateBlock(blockId, data.props)
                        }
                    })
                    .catch(err => console.error('❌ AI generation failed:', err))
                    .finally(() => {
                        setLoadingDropZone(null)  // This clears the loading state
                    })
            }
            return
        }

        // Regular reordering of existing blocks
        if (active.id !== over.id) {
            const overId = over.id as string

            // If dropping on a drop zone, calculate index
            if (overId.startsWith('drop-zone-')) {
                const newIndex = parseInt(overId.replace('drop-zone-', ''))
                const oldIndex = blocks.findIndex(b => b.id === active.id)

                // Adjust index if dragging downwards
                const targetIndex = oldIndex < newIndex ? newIndex - 1 : newIndex;

                moveBlock(active.id as string, targetIndex)
            } else {
                reorderBlocks(active.id as string, over.id as string)
            }
        }
    }

    const handlePreview = () => {
        // Store blocks in sessionStorage for preview page
        sessionStorage.setItem("preview-blocks", JSON.stringify(blocks))
        // Open preview in new tab
        window.open("/preview", "_blank")
    }

    const handleSave = async () => {
        if (!project) {
            console.log('No project to save')
            return
        }

        setIsSaving(true)
        try {
            // Save blocks to the current page
            const response = await fetch(`/api/projects/${project.id}/pages/${project.pages[0].id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    blocks: blocks.map(b => ({
                        id: b.id,
                        type: b.type,
                        componentFile: b.componentFile,
                        props: b.props,
                        styles: b.styles || {},
                        content: b.content || {}
                    }))
                })
            })

            if (response.ok) {
                setLastSaved(new Date())
                console.log('✅ Template saved successfully')
            } else {
                console.error('❌ Failed to save template')
            }
        } catch (error) {
            console.error('❌ Save error:', error)
        } finally {
            setIsSaving(false)
        }
    }

    // Keyboard shortcuts for undo/redo
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
                e.preventDefault()
                undo()
            } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
                e.preventDefault()
                redo()
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [undo, redo])

    return (
        <div className="flex flex-col h-screen overflow-hidden">
            {/* Main Workspace - Full Screen Canvas */}
            <div className="flex-1 relative overflow-hidden flex flex-col">

                {/* Header Elements (Absolute Overlay) - Responsive */}
                <header className="absolute top-2 md:top-4 w-fit left-2 md:left-1/2 md:-translate-x-1/2 right-2 z-40 bg-white/80 backdrop-blur-md shadow-xl border border-zinc-200/50 rounded-full md:rounded-full px-2 md:px-4 py-2 md:py-0 h-auto md:h-12 flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-6 transition-all hover:bg-white hover:shadow-md">
                    <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto justify-between md:justify-start">
                        <div className="flex items-center gap-2 md:gap-4">
                            <Link href={project ? "/projects" : "/templates"} className="text-muted-foreground hover:text-foreground">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                            <h1 className="font-semibold text-xs md:text-sm truncate max-w-[120px] md:max-w-none md:whitespace-nowrap">
                                {project ? project.name : "Template Builder"}
                            </h1>
                        </div>
                        {/* Mobile: Top Right Actions */}
                        <div className="flex items-center gap-1 md:hidden">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 rounded-full"
                                onClick={undo}
                                disabled={!canUndo}
                                title="Undo"
                            >
                                <Undo2 className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 rounded-full"
                                onClick={redo}
                                disabled={!canRedo}
                                title="Redo"
                            >
                                <Redo2 className="h-3.5 w-3.5" />
                            </Button>
                        </div>
                    </div>



                    {/* Desktop: Action Buttons */}
                    <div className="hidden md:flex items-center gap-2">
                        {/* Undo/Redo */}
                        <div className="flex items-center gap-1 border-r pr-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full"
                                onClick={undo}
                                disabled={!canUndo}
                                title="Undo (Ctrl+Z)"
                            >
                                <Undo2 className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full"
                                onClick={redo}
                                disabled={!canRedo}
                                title="Redo (Ctrl+Y)"
                            >
                                <Redo2 className="h-4 w-4" />
                            </Button>
                        </div>
                        <Button variant="ghost" size="sm" className="rounded-full" onClick={handlePreview}>
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                        </Button>
                        <ThemeSelector />
                    </div>
                </header>

                {/* Top Right Actions - Desktop Only */}
                <div className="hidden md:flex absolute top-4 right-4 z-50 items-center gap-2 h-12">
                    <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full gap-2 border-zinc-200 text-zinc-700 bg-white shadow-sm h-[45px] px-4 my-auto"
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        {isSaving ? 'Saving...' : lastSaved ? `Saved ${new Date(lastSaved).toLocaleTimeString()}` : 'Save Draft'}
                        <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
                    </Button>
                    <Button
                        size="sm"
                        className="rounded-full bg-zinc-900 text-white hover:bg-zinc-800 shadow-sm gap-2 h-[38px] px-4 my-auto"
                        onClick={() => setShowPublishModal(true)}
                        disabled={!project}
                    >
                        <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                        Publish Now
                    </Button>
                </div>

                {/* Mobile: Bottom Action Bar */}
                <div className="md:hidden fixed bottom-4 left-2 right-2 z-50 flex items-center gap-2 bg-white/90 backdrop-blur-md shadow-xl border border-zinc-200/50 rounded-full px-3 py-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full gap-1.5 border-zinc-200 text-zinc-700 bg-white shadow-sm h-9 px-3 flex-1 text-xs"
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        {isSaving ? 'Saving...' : lastSaved ? 'Saved' : 'Save'}
                    </Button>
                    <Button
                        size="sm"
                        className="rounded-full bg-zinc-900 text-white hover:bg-zinc-800 shadow-sm gap-1.5 h-9 px-3 flex-1 text-xs"
                        onClick={() => setShowPublishModal(true)}
                        disabled={!project}
                    >
                        <Sparkles className="h-3 w-3 text-amber-400" />
                        Publish
                    </Button>
                    <Button variant="ghost" size="sm" className="rounded-full h-9 w-9 p-0" onClick={handlePreview}>
                        <Eye className="h-4 w-4" />
                    </Button>
                    <ThemeSelector />
                </div>

                {/* DnD Context - Main Interactive Area */}
                <DndContext
                    sensors={sensors}
                    collisionDetection={rectIntersection}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    autoScroll={{ threshold: { x: 0.2, y: 0.2 }, acceleration: 10 }}
                >
                    {/* Content Area with Sidebar and Canvas - Uniform Background */}
                    <div className="flex-1 flex flex-row overflow-hidden relative bg-zinc-100 pt-12 md:pt-0 pb-16 md:pb-0">
                        {/* Sidebar Flex Container - Responsive */}
                        <div
                            className={cn(
                                "relative z-20 transition-all duration-300 ease-in-out h-full flex shrink-0",
                                // Mobile: Overlay sidebar
                                "md:relative fixed inset-y-0 left-0",
                                showLeftSidebar
                                    ? "md:w-[300px] w-[280px] md:opacity-100 opacity-100 md:ml-4 md:my-4 ml-0 my-0"
                                    : "md:w-0 w-0 md:opacity-0 opacity-0 md:m-0 m-0 overflow-hidden"
                            )}
                        >
                            {/* Mobile: Backdrop */}
                            {showLeftSidebar && (
                                <div
                                    className="md:hidden fixed inset-0 bg-black/20 z-10"
                                    onClick={() => setShowLeftSidebar(false)}
                                />
                            )}
                            <div className="h-full w-full shadow-xl md:rounded-xl rounded-none overflow-hidden border border-zinc-200 bg-white relative z-20">
                                <LeftSidebar />
                            </div>
                        </div>

                        {/* Toggle Button - Responsive */}
                        <div className={cn(
                            "absolute top-1/2 -translate-y-1/2 z-30 transition-all duration-300",
                            // Mobile: Always visible on left edge
                            "left-2 md:left-auto",
                            // Desktop: Position based on sidebar state
                            showLeftSidebar ? "md:left-[320px]" : "md:left-4"
                        )}>
                            <Button
                                variant="secondary"
                                size="icon"
                                className="rounded-full shadow-lg bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-600 h-8 w-8 md:h-8 md:w-8"
                                onClick={() => setShowLeftSidebar(!showLeftSidebar)}
                            >
                                {showLeftSidebar ? <ChevronLeft className="h-4 w-4" /> : <Layers className="h-4 w-4" />}
                            </Button>
                        </div>

                        {/* Canvas Flex Item */}
                        <div className="flex-1 h-full overflow-hidden relative">
                            <Canvas />
                        </div>
                    </div>
                    <DragOverlay dropAnimation={null} zIndex={100}>
                        {activeId ? (
                            activeVariant ? (
                                <div className="w-[280px] opacity-90 rotate-3 cursor-grabbing shadow-2xl pointer-events-none">
                                    <VariantCard variant={{
                                        name: 'New Component',
                                        description: activeVariant.variant,
                                    }} />
                                </div>
                            ) : null
                        ) : null}
                    </DragOverlay>
                </DndContext>
            </div >

            {/* Component Library Modal */}
            {
                showComponentModal && (
                    <ComponentLibraryModal
                        onClose={() => setShowComponentModal(false)}
                        onSelectComponent={(props, type, file) => {
                            addComponentFromLibrary(props, type, file)
                            setShowComponentModal(false)
                        }}
                    />
                )
            }

            {/* Publish Modal */}
            {project && (
                <PublishModal
                    open={showPublishModal}
                    onClose={() => setShowPublishModal(false)}
                    projectId={project.id}
                    projectName={project.name}
                    onPublishSuccess={(url) => {
                        console.log('✅ Published to:', url)
                    }}
                />
            )}
        </div >
    )
}
