"use client"

import { useBuilder } from "./builder-context"
import { cn } from "@/lib/utils"

interface SelectableProps extends React.HTMLAttributes<HTMLElement> {
    elementId: string
    blockId?: string
    as?: React.ElementType
}

export function Selectable({
    elementId,
    blockId,
    as: Component = "div",
    className,
    style,
    children,
    onClick,
    ...props
}: SelectableProps) {
    const { selectedElementId, setSelectedElementId, selectedBlockId, blocks, setSelectedBlockId } = useBuilder()

    const isSelected = selectedElementId === elementId && selectedBlockId === blockId

    // Get styles from the block
    const block = blocks.find(b => b.id === blockId)
    const elementStyles = block?.styles?.[elementId] || {}

    const handleClick = (e: React.MouseEvent<Element>) => {
        e.stopPropagation()
        if (blockId) {
            // Set both the block ID and element ID
            setSelectedBlockId(blockId)
            setSelectedElementId(elementId)
            if (onClick) onClick(e as React.MouseEvent<HTMLElement>)
        }
    }

    return (
        <Component
            className={cn(
                "transition-all duration-100",
                isSelected && "ring-2 ring-blue-500 ring-offset-2",
                !isSelected && "hover:ring-1 hover:ring-blue-300",
                className
            )}
            style={{ ...style, ...elementStyles }}
            onClick={handleClick}
            {...props}
        >
            {children}
        </Component>
    )
}
