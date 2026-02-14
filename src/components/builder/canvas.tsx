"use client";

import { useBuilder } from "./builder-context";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import { Minus, Plus, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropZone } from "./drop-zone";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2 } from "lucide-react";

interface SortableBlockWrapperProps {
    block: any;
    isSelected: boolean;
    setSelectedBlockId: (id: string | null) => void;
    removeBlock: (id: string) => void;
    children: React.ReactNode;
}

function SortableBlockWrapper({ block, isSelected, setSelectedBlockId, removeBlock, children }: SortableBlockWrapperProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: block.id });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        position: 'relative' as const, // Ensure positioning context
        zIndex: isDragging ? 50 : (isSelected ? 40 : 1), // Higher z-index while dragging or selected
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            onClick={(e) => {
                // The wrapper click is now just a fallback if inner click didn't catch it
                // But we moved the specific logic to the inner div. 
                // We still need this for dragging handle/boundary? 
                // Actually, we can remove the click handler here as the inner div handles it precisely
            }}
            className={cn(
                "relative group duration-200",
                !isDragging && "transition-all",
                isSelected ? "ring-2 ring-green-500" : "hover:ring-1 hover:ring-green-300"
            )}
        >
            {children}

            {/* Selection Controls - Right Side */}
            {isSelected && (
                <div className="absolute top-0 right-0 translate-x-full h-full pl-2 flex flex-col gap-1 z-50">
                    <div className="bg-white rounded-md shadow-md border border-zinc-200 p-1 flex flex-col gap-1 pointer-events-auto">
                        <div
                            {...attributes}
                            {...listeners}
                            className="p-1.5 hover:bg-zinc-100 text-zinc-500 hover:text-zinc-800 rounded cursor-grab active:cursor-grabbing"
                            title="Drag to reorder"
                        >
                            <GripVertical className="w-4 h-4" />
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                removeBlock(block.id);
                            }}
                            className="p-1.5 hover:bg-red-50 text-zinc-500 hover:text-red-500 rounded transition-colors"
                            title="Remove section"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Component Name Badge */}
            {isSelected && (
                <div className="absolute top-2 right-2 z-20 bg-green-500 text-white text-xs px-2 py-1 rounded shadow-sm pointer-events-none">
                    {block.componentFile}
                </div>
            )}
        </div>
    );
}

// Dynamic imports for ALL component variations from database
const componentVariations: Record<string, any> = {
    // Hero variations
    HeroSocialLearning: dynamic(() =>
        import("@/components/variations/HeroSocialLearning").then((mod) => mod.HeroSocialLearning)
    ),
    HeroModern: dynamic(() =>
        import("@/components/variations/HeroModern").then((mod) => mod.HeroModern)
    ),
    HeroMinimal: dynamic(() =>
        import("@/components/variations/HeroMinimal").then((mod) => mod.HeroMinimal)
    ),
    // Features variations
    FeaturesGrid: dynamic(() =>
        import("@/components/variations/FeaturesGrid").then((mod) => mod.FeaturesGrid)
    ),
    FeaturesCards: dynamic(() =>
        import("@/components/variations/FeaturesCards").then((mod) => mod.FeaturesCards)
    ),
    // Pricing variations
    PricingSimple: dynamic(() =>
        import("@/components/variations/PricingSimple").then((mod) => mod.PricingSimple)
    ),
    // Navbar variations
    NavbarModern: dynamic(() =>
        import("@/components/variations/NavbarModern").then((mod) => mod.NavbarModern)
    ),
    NavbarMinimal: dynamic(() =>
        import("@/components/variations/NavbarMinimal").then((mod) => mod.NavbarMinimal)
    ),
    NavbarTransparent: dynamic(() =>
        import("@/components/variations/NavbarTransparent").then((mod) => mod.NavbarTransparent)
    ),
    // Footer variations
    FooterModern: dynamic(() =>
        import("@/components/variations/FooterModern").then((mod) => mod.FooterModern)
    ),
    FooterMinimal: dynamic(() =>
        import("@/components/variations/FooterMinimal").then((mod) => mod.FooterMinimal)
    ),
    FooterSocial: dynamic(() =>
        import("@/components/variations/FooterSocial").then((mod) => mod.FooterSocial)
    ),
};

const DEVICE_FRAMES = [
    { name: "Desktop", width: 1200, scale: 0.4 },
    { name: "Tablet", width: 768, scale: 0.5 },
    { name: "Mobile", width: 375, scale: 0.8 },
];

import { ElementToolbar } from "./element-toolbar";
import { generateUniqueSelector, generateBlockCss } from "@/lib/builder-utils";

function StyleInjector({ blockId, styles }: { blockId: string; styles: Record<string, React.CSSProperties> }) {
    const css = generateBlockCss(blockId, styles);
    return <style dangerouslySetInnerHTML={{ __html: css }} />;
}

function ContentInjector({ blockId, content }: { blockId: string; content: Record<string, string> }) {
    useEffect(() => {
        // Find ALL instances of this block (one per device frame)
        const blocks = document.querySelectorAll(`.${blockId}`);
        if (blocks.length === 0) return;

        blocks.forEach(block => {
            // Apply content overrides
            Object.entries(content).forEach(([selector, text]) => {
                try {
                    const el = selector ? block.querySelector(selector) : block;
                    if (el) {
                        if ((el as HTMLElement).innerText !== text) {
                            (el as HTMLElement).innerText = text;
                        }
                    }
                } catch (e) {
                    // Ignore
                }
            });
        });
    }, [blockId, content]);

    return null;
}

export function Canvas() {
    const { blocks, selectedBlockId, setSelectedBlockId, selectedElementId, setSelectedElementId, updateBlockStyles, updateBlockContent, loadingDropZone, removeBlock, draggingBlockId, project } = useBuilder();
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    // Toolbar State
    const [toolbarState, setToolbarState] = useState<{
        position: { x: number, y: number };
        tagName: string;
        hasChildren: boolean;
        initialStyles: React.CSSProperties;
        initialContent: string;
    } | null>(null);

    const [isDragging, setIsDragging] = useState(false);
    const [isSpacePressed, setIsSpacePressed] = useState(false);
    const [isShiftPressed, setIsShiftPressed] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const dragStartRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === "Space" && !e.repeat) setIsSpacePressed(true);
            if (e.key === "Shift" && !e.repeat) setIsShiftPressed(true);
            if (e.ctrlKey || e.metaKey || e.altKey) {
                if (e.key === "=" || e.key === "+") {
                    e.preventDefault();
                    setScale((s) => Math.min(s + 0.1, 2));
                } else if (e.key === "-") {
                    e.preventDefault();
                    setScale((s) => Math.max(s - 0.1, 0.2));
                } else if (e.key === "0") {
                    e.preventDefault();
                    setScale(1);
                    setPosition({ x: 0, y: 0 });
                }
            }
        };
        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.code === "Space") {
                setIsSpacePressed(false);
                setIsDragging(false);
            }
            if (e.key === "Shift") {
                setIsShiftPressed(false);
                setIsDragging(false);
            }
        };
        const handleWheel = (e: WheelEvent) => {
            if (e.ctrlKey || e.metaKey || e.altKey) e.preventDefault();
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);
        window.addEventListener("wheel", handleWheel, { passive: false });
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
            window.removeEventListener("wheel", handleWheel);
        };
    }, []);

    const handleWheel = (e: React.WheelEvent) => {
        if (e.ctrlKey || e.metaKey || e.altKey) {
            e.preventDefault();
            const delta = -e.deltaY * 0.001;
            setScale((s) => Math.min(Math.max(s + delta, 0.2), 2));
        } else if (e.shiftKey) {
            // Shift + Wheel = Horizontal Scroll (Pan)
            setPosition((p) => ({ x: p.x - e.deltaY, y: p.y - e.deltaX }));
        } else {
            setPosition((p) => ({ x: p.x - e.deltaX, y: p.y - e.deltaY }));
        }
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.button === 1 || (e.button === 0 && (isSpacePressed || isShiftPressed))) {
            e.preventDefault();
            setIsDragging(true);
            dragStartRef.current = { x: e.clientX - position.x, y: e.clientY - position.y };
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging) {
            setPosition({ x: e.clientX - dragStartRef.current.x, y: e.clientY - dragStartRef.current.y });
        }
    };

    const handleMouseUp = () => setIsDragging(false);

    const handleCanvasClick = (e: React.MouseEvent) => {
        // If we were dragging or panning, don't deselect
        if (isDragging || isSpacePressed || isShiftPressed) return;

        // Deselect everything
        setSelectedBlockId(null);
        setSelectedElementId(null);
        setToolbarState(null);
    };

    const handleElementSelect = (e: React.MouseEvent, blockId: string) => {
        e.stopPropagation();

        // If panning/zooming, ignore selection
        if (isSpacePressed || isShiftPressed) return;

        const target = e.target as HTMLElement;
        const wrapper = e.currentTarget as HTMLElement; // This is the div with the block.id class

        // If we clicked the wrapper itself and not a child, just select the block
        if (target === wrapper) {
            setSelectedBlockId(blockId);
            setToolbarState(null);
            return;
        }

        const selector = generateUniqueSelector(target, wrapper);
        console.log('🎯 Selected Element:', selector);

        setSelectedBlockId(blockId);
        setSelectedElementId(selector);

        // Calculate Position
        // Calculate Position relative to canvas root (for absolute positioning)
        const canvasRoot = document.getElementById('canvas-root');
        const canvasRect = canvasRoot?.getBoundingClientRect() || { top: 0, left: 0 };

        const rect = target.getBoundingClientRect();

        // Get Computed Styles to populate the toolbar
        const computed = window.getComputedStyle(target);

        // Populate initial toolbar values
        setToolbarState({
            position: {
                x: rect.left - canvasRect.left,
                y: rect.bottom - canvasRect.top + 10
            },
            tagName: target.tagName,
            hasChildren: target.children.length > 0,
            initialStyles: {
                color: computed.color,
                backgroundColor: computed.backgroundColor,
                fontSize: computed.fontSize,
                fontWeight: computed.fontWeight,
                textAlign: computed.textAlign as React.CSSProperties['textAlign'],
                borderRadius: computed.borderRadius,
                padding: computed.padding,
                margin: computed.margin,
                borderWidth: computed.borderWidth,
                borderColor: computed.borderColor,
                boxShadow: computed.boxShadow,
            },
            initialContent: (target.children.length > 0) ? '' : (target.innerText || '')
        });
    };

    const handleUpdateStyle = (newStyles: React.CSSProperties) => {
        if (selectedBlockId && selectedElementId) {
            updateBlockStyles(selectedBlockId, selectedElementId, newStyles);
        }
    };

    const handleUpdateContent = (newContent: string) => {
        if (selectedBlockId && selectedElementId) {
            // 1. Update the state (database persistence)
            updateBlockContent(selectedBlockId, selectedElementId, newContent);

            // 2. Update all visual instances immediately
            const blockNodes = document.querySelectorAll(`.${selectedBlockId}`);
            blockNodes.forEach(blockNode => {
                try {
                    const element = blockNode.querySelector(selectedElementId);
                    if (element) {
                        (element as HTMLElement).innerText = newContent;
                    }
                } catch (err) {
                    // Ignore
                }
            });
        }
    };

    // ONLY render components from database with componentFile
    const renderBlocks = () => {
        // Check if we are reordering an existing block
        const isReordering = draggingBlockId && blocks.some(b => b.id === draggingBlockId);

        return (
            <SortableContext
                items={blocks.map(b => b.id)}
                strategy={verticalListSortingStrategy}
            >
                {blocks.map((block, index) => {
                    // Only render if component has a componentFile reference
                    if (!block.componentFile || !componentVariations[block.componentFile]) {
                        return null;
                    }

                    const VariationComponent = componentVariations[block.componentFile];

                    return (
                        <div key={block.id + '-wrapper'} className="relative">
                            {!isReordering && (
                                <DropZone
                                    key={`drop-${index}`}
                                    id={`drop-zone-${index}`}
                                    index={index}
                                    isLoading={loadingDropZone === index}
                                />
                            )}
                            {VariationComponent && (
                                <SortableBlockWrapper
                                    key={block.id}
                                    block={block}
                                    isSelected={block.id === selectedBlockId}
                                    setSelectedBlockId={setSelectedBlockId}
                                    removeBlock={removeBlock}
                                >
                                    {/* Inject Dynamic Styles for this block */}
                                    <StyleInjector blockId={block.id} styles={block.styles || {}} />
                                    <ContentInjector blockId={block.id} content={block.content || {}} />

                                    {/* Capture clicks on the wrapper to identify elements */}
                                    <div
                                        className={`h-full ${block.id}`} // Use class for scoping instead of ID
                                        onClick={(e) => handleElementSelect(e, block.id)}
                                    >
                                        <VariationComponent props={block.props} blockId={block.id} />
                                    </div>
                                </SortableBlockWrapper>
                            )}
                        </div>
                    );
                })}
                {/* Final Drop Zone */}
                {!isReordering && (
                    <DropZone
                        key={`drop-${blocks.length}`}
                        id={`drop-zone-${blocks.length}`}
                        index={blocks.length}
                        isLoading={loadingDropZone === blocks.length}
                    />
                )}
            </SortableContext>
        );
    };

    return (
        <div
            className="flex-1 bg-zinc-100 overflow-hidden relative h-full"
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onClick={handleCanvasClick}
            id="canvas-root"
            style={{ cursor: isSpacePressed || isShiftPressed || isDragging ? "grab" : "default" }}
        >
            {/* Zoom Controls */}
            <div className="absolute bottom-4 right-4 z-50 flex items-center gap-2 bg-white rounded-lg shadow-md p-1 border">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setScale((s) => Math.max(s - 0.1, 0.2))}>
                    <Minus className="h-4 w-4" />
                </Button>
                <span className="text-xs font-medium w-12 text-center">{Math.round(scale * 100)}%</span>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setScale((s) => Math.min(s + 0.1, 2))}>
                    <Plus className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setScale(1); setPosition({ x: 0, y: 0 }); }}>
                    <RotateCcw className="h-4 w-4" />
                </Button>
            </div>

            {/* Device Frames - Flex Layout instead of Grid */}
            <div
                ref={containerRef}
                className="min-h-full w-full flex items-start justify-center p-6 origin-top-left transition-transform duration-75 ease-out"
                style={{ transform: `translate(${position.x}px, ${position.y}px) scale(${scale})` }}
            >
                <div className="flex flex-row gap-24 items-start">
                    {DEVICE_FRAMES.map((device) => {
                        // Calculate visual dimensions to reserve space
                        const visualWidth = device.width * device.scale;

                        return (
                            <div key={device.name} className="flex flex-col items-center gap-1" style={{ width: visualWidth }}>
                                <div className="text-xs font-medium text-zinc-200 bg-black px-3 py-1 rounded-full shadow-sm border mb-4">
                                    {device.name} ({device.width}px)
                                </div>

                                {/* Wrapper that takes exactly the visual space */}
                                <div className="relative" style={{ width: visualWidth, minHeight: 600 * device.scale }}>
                                    {/* The scaled content */}
                                    <div
                                        className="bg-white shadow-xl rounded-lg flex flex-col ring-1 ring-zinc-200/50 container-support absolute top-0 left-0 origin-top-left"
                                        style={{
                                            width: device.width,
                                            minHeight: "600px",
                                            transform: `scale(${device.scale})`,
                                            height: "auto", // Allow it to grow
                                            // transformOrigin is handled by absolute positioning + top-left
                                        }}
                                    >
                                        <div className="flex-1 flex flex-col">
                                            {blocks.length > 0 ? (
                                                // Only render interactive blocks (with drop zones) in the first device
                                                device.name === "Desktop" ? renderBlocks() : (
                                                    // For other devices, render blocks without drop zones
                                                    <SortableContext
                                                        items={blocks.map(b => b.id)}
                                                        strategy={verticalListSortingStrategy}
                                                    >
                                                        {blocks.map((block) => {
                                                            if (!block.componentFile || !componentVariations[block.componentFile]) {
                                                                return null;
                                                            }
                                                            const VariationComponent = componentVariations[block.componentFile];
                                                            return (
                                                                <SortableBlockWrapper
                                                                    key={block.id}
                                                                    block={block}
                                                                    isSelected={block.id === selectedBlockId}
                                                                    setSelectedBlockId={setSelectedBlockId}
                                                                    removeBlock={removeBlock}
                                                                >
                                                                    <StyleInjector blockId={block.id} styles={block.styles || {}} />
                                                                    <ContentInjector blockId={block.id} content={block.content || {}} />
                                                                    <div className={`${block.id}`} onClick={(e) => handleElementSelect(e, block.id)}>
                                                                        <VariationComponent props={block.props} blockId={block.id} />
                                                                    </div>
                                                                </SortableBlockWrapper>
                                                            );
                                                        })}
                                                    </SortableContext>
                                                )
                                            ) : (
                                                <div className="flex-1 flex items-center justify-center text-zinc-400 p-10 text-center">
                                                    Select a template or add blocks to start
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Element Toolbar Overlay */}
            {selectedBlockId && selectedElementId && toolbarState && (
                <ElementToolbar
                    elementId={selectedElementId}
                    tagName={toolbarState.tagName}
                    hasChildren={toolbarState.hasChildren}
                    initialStyles={toolbarState.initialStyles}
                    initialContent={toolbarState.initialContent}
                    position={toolbarState.position}
                    context={project?.description || "A modern landing page"}
                    onClose={() => {
                        setSelectedElementId(null);
                        setToolbarState(null);
                    }}
                    onUpdateStyle={handleUpdateStyle}
                    onUpdateContent={handleUpdateContent}
                />
            )}

        </div>
    );
}
