"use client"

import { useDroppable, useDndContext } from "@dnd-kit/core"
import { cn } from "@/lib/utils"

interface DropZoneProps {
    id: string
    index: number
    isLoading?: boolean
}

export function DropZone({ id, index, isLoading }: DropZoneProps) {
    const { setNodeRef, isOver } = useDroppable({
        id,
    })
    const { active } = useDndContext()

    // Only show drop zones when dragging
    const isDragging = !!active
    const isActive = isLoading || isOver

    if (!isDragging && !isLoading) {
        return <div ref={setNodeRef} className="h-0 w-0 overflow-hidden" />
    }

    return (
        <div
            ref={setNodeRef}
            className={cn(
                "transition-all duration-200",
                isActive
                    ? "h-[200px] mx-4 my-4 bg-blue-100 border-2 border-dashed border-blue-400 rounded-lg flex items-center justify-center"
                    : "h-16 mx-4 my-2 bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg flex items-center justify-center opacity-60 hover:opacity-100 hover:border-blue-400"
            )}
        >
            {isLoading ? (
                <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm font-semibold text-blue-600">
                        Generating content...
                    </span>
                </div>
            ) : isOver ? (
                <span className="text-sm font-semibold text-blue-600">
                    Drop component here (Position {index})
                </span>
            ) : (
                <span className="text-xs text-blue-400">
                    Drop here
                </span>
            )}
        </div>
    )
}
