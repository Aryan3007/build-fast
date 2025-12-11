"use client"

import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { useBuilder } from "./builder-context"
import { LeftSidebar } from "./left-sidebar"
import { RightSidebar } from "./right-sidebar"
import { Canvas } from "./canvas"
import { ArrowLeft, Plus, ChevronLeft, ChevronRight, Layers, Settings, Eye, Sparkles, Undo2, Redo2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ComponentLibraryModal } from "./component-library-modal"
import { AiPromptPanel } from "./ai-prompt-panel"
import { SaveTemplateModal } from "./save-template-modal"
import { useState, useEffect } from "react"

export function BuilderLayout() {
    const { blocks, reorderBlocks, addComponentFromLibrary, undo, redo, canUndo, canRedo } = useBuilder()
    const [showComponentModal, setShowComponentModal] = useState(false)
    const [showAiPanel, setShowAiPanel] = useState(false)
    const [showSaveModal, setShowSaveModal] = useState(false)
    const [showLeftSidebar, setShowLeftSidebar] = useState(true)
    const [showRightSidebar, setShowRightSidebar] = useState(true)

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor)
    )

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event

        if (over && active.id !== over.id) {
            reorderBlocks(active.id as string, over.id as string)
        }
    }

    const handlePreview = () => {
        // Store blocks in sessionStorage for preview page
        sessionStorage.setItem("preview-blocks", JSON.stringify(blocks))
        // Open preview in new tab
        window.open("/preview", "_blank")
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
            <div className="flex-1 relative overflow-hidden">
                {/* Floating Top Header */}
                <header className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-white/95 backdrop-blur-sm border shadow-xl rounded-full px-6 py-3 flex items-center gap-8">
                    <div className="flex items-center gap-4">
                        <Link href="/templates" className="text-muted-foreground hover:text-foreground">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                        <h1 className="font-semibold text-sm whitespace-nowrap">Template Builder</h1>
                    </div>
                    <div className="flex items-center gap-2">
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
                        <Button variant="outline" className="rounded-full" size="sm" onClick={() => setShowComponentModal(true)}>
                            <Plus className="h-4 w-4 mr-1" /> Add Component
                        </Button>
                        <Button variant="outline" className="rounded-full" size="sm" onClick={() => setShowAiPanel(true)}>
                            <Sparkles className="h-4 w-4 mr-1" /> AI Assistant
                        </Button>
                        <Button variant="outline" className="rounded-full" size="sm" onClick={handlePreview}>
                            <Eye className="h-4 w-4" /> Preview
                        </Button>
                        <Button size="sm" className="rounded-full" onClick={() => setShowSaveModal(true)}>Save Template</Button>
                    </div>
                </header>

                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    {/* Full-screen Canvas */}
                    <Canvas />

                    <SortableContext
                        items={blocks?.map(b => b.id) || []}
                        strategy={verticalListSortingStrategy}
                    >
                        {/* Floating Left Sidebar */}
                        <div className={`absolute left-4 top-4 bottom-4 z-10 transition-transform duration-300 ${showLeftSidebar ? 'translate-x-0' : '-translate-x-full'}`}>
                            <LeftSidebar />
                        </div>

                        {/* Left Sidebar Toggle Button */}
                        <Button
                            variant="secondary"
                            size="icon"
                            className={`absolute top-1/2 -translate-y-1/2 z-20 shadow-lg transition-all duration-300 ${showLeftSidebar ? 'left-[272px]' : 'left-4'}`}
                            onClick={() => setShowLeftSidebar(!showLeftSidebar)}
                        >
                            {showLeftSidebar ? <ChevronLeft className="h-4 w-4" /> : <Layers className="h-4 w-4" />}
                        </Button>
                    </SortableContext>

                    {/* Floating Right Sidebar */}
                    <div className={`absolute right-4 top-4 bottom-4 z-10 transition-transform duration-300 ${showRightSidebar ? 'translate-x-0' : 'translate-x-full'}`}>
                        <RightSidebar />
                    </div>

                    {/* Right Sidebar Toggle Button */}
                    <Button
                        variant="secondary"
                        size="icon"
                        className={`absolute top-1/2 -translate-y-1/2 z-20 shadow-lg transition-all duration-300 ${showRightSidebar ? 'right-[336px]' : 'right-4'}`}
                        onClick={() => setShowRightSidebar(!showRightSidebar)}
                    >
                        {showRightSidebar ? <ChevronRight className="h-4 w-4" /> : <Settings className="h-4 w-4" />}
                    </Button>
                </DndContext>
            </div>

            {/* Component Library Modal */}
            {showComponentModal && (
                <ComponentLibraryModal
                    onClose={() => setShowComponentModal(false)}
                    onSelectComponent={addComponentFromLibrary}
                />
            )}

            {/* AI Prompt Panel */}
            {showAiPanel && (
                <AiPromptPanel onClose={() => setShowAiPanel(false)} />
            )}

            {/* Save Template Modal */}
            {showSaveModal && (
                <SaveTemplateModal onClose={() => setShowSaveModal(false)} />
            )}
        </div>
    )
}
