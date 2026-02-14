"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { arrayMove } from "@dnd-kit/sortable"

export interface Block {
    id: string
    type: string
    componentFile?: string | null
    props: Record<string, any>
    styles?: Record<string, React.CSSProperties>
    content?: Record<string, string>
}

export interface Theme {
    name: string
    colors: {
        background: string
        accent: string
    }
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
    updateBlockContent: (blockId: string, elementId: string, content: string) => void
    reorderBlocks: (activeId: string, overId: string) => void
    moveBlock: (id: string, toIndex: number) => void
    addBlock: (type: string) => void
    addComponentFromLibrary: (componentProps: any, componentType: string, componentFile?: string | null) => void
    addBlockAtPosition: (variant: string, position: number, props?: Record<string, any>) => Promise<string>
    removeBlock: (id: string) => void
    replaceBlock: (id: string, newType: string, newComponentFile: string | null, newProps?: Record<string, any>) => void
    undo: () => void
    redo: () => void
    canUndo: boolean
    canRedo: boolean
    loadingBlocks: Set<string>
    loadingDropZone: number | null
    setLoadingDropZone: (index: number | null) => void
    draggingBlockId: string | null
    setDraggingBlockId: (id: string | null) => void
    // Project & Sitemap
    project: any | null
    currentPage: string | null
    setCurrentPage: (pageId: string) => void

    applyTheme: (theme: Theme) => void
}


const BuilderContext = createContext<BuilderContextType | undefined>(undefined)

export function BuilderProvider({
    children,
    initialBlocks = [],
    initialProject = null
}: {
    children: ReactNode,
    initialBlocks?: Block[],
    initialProject?: any
}) {
    const [project, setProject] = useState(initialProject)
    const [currentPage, setCurrentPage] = useState<string | null>(
        initialProject?.pages?.[0]?.id || null
    )


    // Load blocks from current page
    const [blocks, setBlocks] = useState<Block[]>(() => {
        if (initialProject && currentPage) {
            const page = initialProject.pages.find((p: any) => p.id === currentPage)
            if (page?.sections) {
                console.log(`📖 Loading ${page.sections.length} blocks from database`);
                console.log('📦 Raw sections data:', JSON.stringify(page.sections, null, 2));
                return page.sections.map((s: any, i: number) => ({
                    // Restore the complete block structure from saved data
                    id: s.id || `block-${i}-${Date.now()}`,
                    type: s.type,
                    componentFile: s.componentFile || s.variant || s.type,
                    props: s.props || { title: s.title, description: s.description },
                    styles: s.styles || {},
                    content: s.content || {}
                }))
            }
        }
        return initialBlocks.map((b, i) => ({
            ...b,
            id: b.id || `block-${i}-${Date.now()}`,
            styles: b.styles || {},
            content: b.content || {}
        }))
    })

    const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null)
    const [selectedElementId, setSelectedElementId] = useState<string | null>(null)
    const [loadingBlocks, setLoadingBlocks] = useState<Set<string>>(new Set())
    const [loadingDropZone, setLoadingDropZone] = useState<number | null>(null)
    const [draggingBlockId, setDraggingBlockId] = useState<string | null>(null)

    // Undo/Redo history - start empty, first change will create first entry
    const [history, setHistory] = useState<Block[][]>([])
    const [historyIndex, setHistoryIndex] = useState(-1)

    // Theme state
    const [currentTheme, setCurrentTheme] = useState<Theme | null>(null)

    // Wrapper to save history when blocks change
    const setBlocksWithHistory = (newBlocks: Block[] | ((prev: Block[]) => Block[])) => {
        setBlocks(prev => {
            const updated = typeof newBlocks === 'function' ? newBlocks(prev) : newBlocks

            // Only save to history if there's an actual change
            if (JSON.stringify(prev) !== JSON.stringify(updated)) {
                setHistory(h => {
                    // Clear any future history if we're not at the end
                    const newHistory = h.slice(0, historyIndex + 1)

                    // If this is the first change, save the initial state first
                    if (newHistory.length === 0) {
                        newHistory.push(prev)
                    }

                    // Add the new state to history
                    newHistory.push(updated)
                    return newHistory
                })
                setHistoryIndex(i => i + 1)
            }

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

    const updateBlockContent = (blockId: string, elementId: string, content: string) => {
        setBlocksWithHistory(prev => prev.map(b => {
            if (b.id === blockId) {
                const currentContent = b.content || {}
                return {
                    ...b,
                    content: {
                        ...currentContent,
                        [elementId]: content
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

    const moveBlock = (id: string, toIndex: number) => {
        setBlocksWithHistory((items) => {
            const oldIndex = items.findIndex((item) => item.id === id)
            if (oldIndex !== -1) {
                return arrayMove(items, oldIndex, toIndex)
            }
            return items
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
        const themeProps = currentTheme ? {
            bgColor: currentTheme.colors.background,
            accentColor: currentTheme.colors.accent
        } : {}

        const newBlock: Block = {
            id: `block-${Date.now()}`,
            type: componentType,
            componentFile: componentFile || null,
            props: { ...componentProps, ...themeProps },
            styles: {}
        }
        setBlocksWithHistory(prev => [...prev, newBlock])
    }

    const addBlockAtPosition = async (variant: string, position: number, props?: Record<string, any>): Promise<string> => {
        console.log('🔧 addBlockAtPosition called:', { variant, position, props })
        const componentType = variant.replace(/Modern|Minimal|Cards|Grid|Simple|Social|Transparent/g, '').trim() || variant

        const themeProps = currentTheme ? {
            bgColor: currentTheme.colors.background,
            accentColor: currentTheme.colors.accent
        } : {}

        const blockId = `block-${Date.now()}`
        const newBlock: Block = {
            id: blockId,
            type: componentType,
            componentFile: variant,
            props: { ...themeProps, ...(props || {}) },
            styles: {}
        }

        console.log('🔧 New block created:', newBlock)

        // Insert at position
        setBlocksWithHistory(prev => {
            const newBlocks = [...prev]
            newBlocks.splice(position, 0, newBlock)
            console.log('🔧 Blocks after insertion:', newBlocks.length, 'blocks')
            return newBlocks
        })

        // Sync with sitemap - add section to current page
        if (project && currentPage) {
            const sectionData = {
                title: variant,
                variant,
                type: componentType,
                description: `Auto-added ${componentType} section`
            }

            try {
                const page = project.pages?.find((p: any) => p.id === currentPage)
                if (page) {
                    const newSections = [...(page.sections || []), sectionData]
                    await fetch(`/api/projects/${project.id}/pages/${currentPage}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ sections: newSections })
                    })
                    console.log('✅ Sitemap synced with new section')
                }
            } catch (error) {
                console.error('❌ Failed to sync with sitemap:', error)
            }
        }

        return blockId
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

    const applyTheme = (theme: Theme) => {
        setCurrentTheme(theme)
        setBlocksWithHistory(prev => prev.map(block => ({
            ...block,
            props: {
                ...block.props,
                bgColor: theme.colors.background,
                accentColor: theme.colors.accent
            }
        })))
    }

    const undo = () => {
        console.log('🔙 Undo called. Current index:', historyIndex, 'History length:', history.length)
        if (historyIndex >= 0) {
            const newIndex = historyIndex - 1
            if (newIndex >= 0) {
                const previousState = history[newIndex]
                if (previousState) {
                    setHistoryIndex(newIndex)
                    setBlocks(previousState)
                    console.log('✅ Undo successful. New index:', newIndex)
                }
            } else {
                // Going back before first change - this shouldn't happen with proper history
                console.log('❌ Cannot undo - at beginning of history')
            }
        } else {
            console.log('❌ Cannot undo - no history')
        }
    }

    const redo = () => {
        console.log('🔜 Redo called. Current index:', historyIndex, 'History length:', history.length)
        if (historyIndex < history.length - 1) {
            const newIndex = historyIndex + 1
            const nextState = history[newIndex]
            if (nextState) {
                setHistoryIndex(newIndex)
                setBlocks(nextState)
                console.log('✅ Redo successful. New index:', newIndex)
            }
        } else {
            console.log('❌ Cannot redo - at end of history')
        }
    }

    const canUndo = historyIndex >= 0
    const canRedo = historyIndex < history.length - 1

    console.log('📊 History state - Index:', historyIndex, 'Length:', history.length, 'canUndo:', canUndo, 'canRedo:', canRedo)

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
            updateBlockContent,
            reorderBlocks,
            moveBlock,
            addBlock,
            addComponentFromLibrary,
            addBlockAtPosition,
            removeBlock,
            replaceBlock,
            undo,
            redo,
            canUndo,
            canRedo,
            loadingBlocks,
            loadingDropZone,
            setLoadingDropZone,
            draggingBlockId,
            setDraggingBlockId,
            project,
            currentPage,
            setCurrentPage,
            applyTheme,
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