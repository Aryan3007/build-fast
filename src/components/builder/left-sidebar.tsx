"use client"

import { useBuilder } from "./builder-context"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, Trash2, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { ReplaceComponentModal } from "./replace-component-modal"

function SortableItem({ id, type, isSelected, onClick, onRemove, onReplace }: {
    id: string,
    type: string,
    isSelected: boolean,
    onClick: () => void,
    onRemove: (e: React.MouseEvent) => void,
    onReplace: (e: React.MouseEvent) => void
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "flex items-center gap-2 p-3 rounded-lg border bg-white mb-2 group cursor-pointer hover:border-zinc-400 transition-colors",
                isSelected && "border-blue-500 ring-1 ring-blue-500"
            )}
            onClick={onClick}
        >
            <div {...attributes} {...listeners} className="cursor-grab text-zinc-400 hover:text-zinc-600">
                <GripVertical className="h-4 w-4" />
            </div>
            <span className="text-sm font-medium flex-1">{type}</span>
            <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                onClick={onReplace}
                title="Replace component"
            >
                <RefreshCw className="h-3 w-3" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 hover:bg-red-50"
                onClick={onRemove}
            >
                <Trash2 className="h-3 w-3" />
            </Button>
        </div>
    )
}

export function LeftSidebar() {
    const { blocks, selectedBlockId, setSelectedBlockId, removeBlock } = useBuilder()
    const [showReplaceModal, setShowReplaceModal] = useState(false)
    const [blockToReplace, setBlockToReplace] = useState<string | null>(null)

    const handleReplace = (e: React.MouseEvent, blockId: string) => {
        e.stopPropagation()
        setBlockToReplace(blockId)
        setShowReplaceModal(true)
    }

    return (
        <div className="w-64 border shadow-xl rounded-lg overflow-hidden bg-zinc-50 flex flex-col h-full">
            <div className="p-4 border-b bg-white">
                <h2 className="font-semibold text-sm">Layers</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
                {blocks.map((block) => (
                    <SortableItem
                        key={block.id}
                        id={block.id}
                        type={block.type}
                        isSelected={block.id === selectedBlockId}
                        onClick={() => setSelectedBlockId(block.id)}
                        onRemove={(e) => {
                            e.stopPropagation()
                            removeBlock(block.id)
                        }}
                        onReplace={(e) => handleReplace(e, block.id)}
                    />
                ))}
                {blocks.length === 0 && (
                    <div className="text-center py-8 text-zinc-400 text-sm">
                        No sections yet.
                    </div>
                )}
            </div>

            <ReplaceComponentModal
                open={showReplaceModal}
                onOpenChange={setShowReplaceModal}
                blockId={blockToReplace}
            />
        </div>
    )
}
