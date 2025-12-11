"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import { arrayMove } from "@dnd-kit/sortable"

export interface Block {
    id: string
    type: string
    componentFile?: string | null
    props: Record<string, any>
    styles?: Record<string, React.CSSProperties>
}

interface BuilderContextType {
    blocks: Block[]
    setBlocks: (blocks: Block[]) => void
    selectedBlockId: string | null
    setSelectedBlockId: (id: string | null) => void
    selectedElementId: string | null
    setSelectedElementId: (id: string | null) => void
    updateBlock: (id: string, props: Record<string, any>) => void
    updateBlockStyles: (blockId: string, elementId: string, styles: React.CSSProperties) => void
    reorderBlocks: (activeId: string, overId: string) => void
    addBlock: (type: string) => void
    addComponentFromLibrary: (componentProps: any, componentType: string, componentFile?: string | null) => void
    removeBlock: (id: string) => void
    replaceBlock: (id: string, newType: string, newComponentFile: string | null, newProps?: Record<string, any>) => void
    undo: () => void
    redo: () => void
    canUndo: boolean
    canRedo: boolean
}

const BuilderContext = createContext<BuilderContextType | undefined>(undefined)

export function BuilderProvider({ children, initialBlocks = [] }: { children: ReactNode, initialBlocks?: Block[] }) {
    const [blocks, setBlocks] = useState<Block[]>(() =>
        initialBlocks.map((b, i) => ({ ...b, id: b.id || `block-${i}-${Date.now()}`, styles: b.styles || {} }))
    )
    const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null)
    const [selectedElementId, setSelectedElementId] = useState<string | null>(null)

    // Undo/Redo history
    const [history, setHistory] = useState<Block[][]>([])
    const [historyIndex, setHistoryIndex] = useState(-1)

    // Wrapper to save history when blocks change
    const setBlocksWithHistory = (newBlocks: Block[] | ((prev: Block[]) => Block[])) => {
        setBlocks(prev => {
            const updated = typeof newBlocks === 'function' ? newBlocks(prev) : newBlocks

            // Save to history (remove any future history if we're not at the end)
            setHistory(h => [...h.slice(0, historyIndex + 1), prev])
            setHistoryIndex(i => i + 1)

            return updated
        })
    }

    const updateBlock = (id: string, props: Record<string, any>) => {
        setBlocksWithHistory(prev => prev.map(b => b.id === id ? { ...b, props: { ...b.props, ...props } } : b))
    }

    const updateBlockStyles = (blockId: string, elementId: string, styles: React.CSSProperties) => {
        setBlocksWithHistory(prev => prev.map(b => {
            if (b.id === blockId) {
                const currentStyles = b.styles || {}
                return {
                    ...b,
                    styles: {
                        ...currentStyles,
                        [elementId]: { ...(currentStyles[elementId] || {}), ...styles }
                    }
                }
            }
            return b
        }))
    }

    const reorderBlocks = (activeId: string, overId: string) => {
        setBlocksWithHistory((items) => {
            const oldIndex = items.findIndex((item) => item.id === activeId)
            const newIndex = items.findIndex((item) => item.id === overId)
            return arrayMove(items, oldIndex, newIndex)
        })
    }

    const addBlock = (type: string) => {
        const newBlock: Block = {
            id: `block-${Date.now()}`,
            type,
            props: {},
            styles: {}
        }
        setBlocksWithHistory(prev => [...prev, newBlock])
    }

    const addComponentFromLibrary = (componentProps: any, componentType: string, componentFile?: string | null) => {
        const newBlock: Block = {
            id: `block-${Date.now()}`,
            type: componentType,
            componentFile: componentFile || null,
            props: componentProps,
            styles: {}
        }
        setBlocksWithHistory(prev => [...prev, newBlock])
    }

    const removeBlock = (id: string) => {
        setBlocksWithHistory(prev => prev.filter(b => b.id !== id))
        if (selectedBlockId === id) {
            setSelectedBlockId(null)
            setSelectedElementId(null)
        }
    }

    const replaceBlock = (id: string, newType: string, newComponentFile: string | null, newProps?: Record<string, any>) => {
        setBlocksWithHistory(prev => prev.map(block => {
            if (block.id === id) {
                // Transfer compatible props from old to new component
                const oldProps = block.props

                // Universal props that always transfer
                const transferredProps: Record<string, any> = {}
                if (oldProps.bgColor) transferredProps.bgColor = oldProps.bgColor
                if (oldProps.accentColor) transferredProps.accentColor = oldProps.accentColor

                // Common props that transfer if they exist
                const commonProps = ['title', 'subtitle', 'description', 'ctaText', 'ctaLink',
                    'siteName', 'menuItems', 'companyName', 'tagline', 'email',
                    'phone', 'address', 'links']
                commonProps.forEach(prop => {
                    if (oldProps[prop] !== undefined) {
                        transferredProps[prop] = oldProps[prop]
                    }
                })

                // Array props (features, cards, tiers) - transfer existing items
                const arrayProps = ['features', 'cards', 'tiers', 'items']
                arrayProps.forEach(prop => {
                    if (oldProps[prop] && Array.isArray(oldProps[prop])) {
                        transferredProps[prop] = oldProps[prop]
                    }
                })

                // Merge with any new props provided (from AI generation)
                const finalProps = { ...transferredProps, ...newProps }

                return {
                    ...block,
                    type: newType,
                    componentFile: newComponentFile,
                    props: finalProps
                }
            }
            return block
        }))
    }

    const undo = () => {
        if (historyIndex >= 0 && history[historyIndex]) {
            const previousState = history[historyIndex]
            setBlocks(previousState)
            setHistoryIndex(i => i - 1)
        }
    }

    const redo = () => {
        if (historyIndex < history.length - 1) {
            const nextIndex = historyIndex + 2 // Skip current, get next saved state
            if (nextIndex < history.length && history[nextIndex]) {
                setBlocks(history[nextIndex])
                setHistoryIndex(i => i + 1)
            }
        }
    }

    const canUndo = historyIndex >= 0 && history[historyIndex] !== undefined
    const canRedo = historyIndex < history.length - 1 && history[historyIndex + 2] !== undefined

    // Override setBlocks used by AI panel to use history tracking
    const setBlocksForAI = setBlocksWithHistory

    return (
        <BuilderContext.Provider value={{
            blocks,
            setBlocks: setBlocksForAI,
            selectedBlockId,
            setSelectedBlockId,
            selectedElementId,
            setSelectedElementId,
            updateBlock,
            updateBlockStyles,
            reorderBlocks,
            addBlock,
            addComponentFromLibrary,
            removeBlock,
            replaceBlock,
            undo,
            redo,
            canUndo,
            canRedo
        }}>
            {children}
        </BuilderContext.Provider>
    )
}

export function useBuilder() {
    const context = useContext(BuilderContext)
    if (context === undefined) {
        throw new Error("useBuilder must be used within a BuilderProvider")
    }
    return context
}
