"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2, Sparkles, X, Type, Layout, Palette, FileEdit } from "lucide-react"
import { useBuilder } from "./builder-context"

type EditMode = "content" | "structure" | "rewrite" | "theme"

interface AiPromptPanelProps {
    onClose: () => void
}

export function AiPromptPanel({ onClose }: AiPromptPanelProps) {
    const { blocks, setBlocks, selectedBlockId } = useBuilder()
    const [prompt, setPrompt] = useState("")
    const [editMode, setEditMode] = useState<EditMode>("content")
    const [isProcessing, setIsProcessing] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [previewBlocks, setPreviewBlocks] = useState<any[] | null>(null)

    const editModes = [
        {
            id: "content" as EditMode,
            label: "Edit Content",
            icon: Type,
            description: "Modify text and content",
            example: "Make this more professional",
            supportsSelection: true
        },
        {
            id: "structure" as EditMode,
            label: "Edit Structure",
            icon: Layout,
            description: "Modify component layouts",
            example: "Make this two columns",
            supportsSelection: true
        },
        {
            id: "rewrite" as EditMode,
            label: "Rewrite Section",
            icon: FileEdit,
            description: "Completely rewrite content",
            example: "Rewrite to be more professional",
            requiresSelection: true
        },
        {
            id: "theme" as EditMode,
            label: "Change Theme",
            icon: Palette,
            description: "Update colors and styling",
            example: "Match the first hero section's theme",
            supportsSelection: true
        },
    ]

    const selectedMode = editModes.find(m => m.id === editMode)
    // IMPORTANT: Edit selected component only when one is selected (for all modes!)
    const editingSelectedOnly = Boolean(selectedBlockId)

    const handleSubmit = async () => {
        if (!prompt.trim()) {
            setError("Please enter a prompt")
            return
        }

        if (editMode === "rewrite" && !selectedBlockId) {
            setError("Please select a component first to rewrite it")
            return
        }

        setIsProcessing(true)
        setError(null)
        setPreviewBlocks(null)

        try {
            const response = await fetch("/api/ai/edit-template", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    blocks,
                    prompt,
                    editType: editMode,
                    targetBlockId: selectedBlockId,
                    editSelectedOnly: editingSelectedOnly,
                }),
            })

            const data = await response.json()

            if (!data.success) {
                setError(data.error || "AI editing failed")
                return
            }

            console.log("=== AI RESPONSE ===")
            console.log("Edit mode:", editMode)
            console.log("Editing selected only:", editingSelectedOnly)
            console.log("Original blocks:", blocks)
            console.log("AI returned blocks:", data.blocks)
            console.log("Number of blocks returned:", data.blocks?.length)

            // Show preview
            setPreviewBlocks(data.blocks)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to connect to AI service")
        } finally {
            setIsProcessing(false)
        }
    }

    const handleApplyChanges = () => {
        if (previewBlocks) {
            let updatedBlocks;

            if (editingSelectedOnly && selectedBlockId && previewBlocks.length > 0) {
                // Single component editing - merge the updated block back
                updatedBlocks = blocks.map(block => {
                    if (block.id === selectedBlockId) {
                        // Preserve ID and componentFile from original, merge everything else
                        const aiBlock = previewBlocks[0];
                        return {
                            ...aiBlock,
                            id: block.id,
                            componentFile: block.componentFile
                        }
                    }
                    return block
                })

                console.log("=== APPLYING SINGLE COMPONENT EDIT ===")
                console.log("Updated block ID:", selectedBlockId)
            } else {
                // Multi-component editing - preserve IDs and componentFiles from original blocks
                updatedBlocks = previewBlocks.map((aiBlock, index) => {
                    const originalBlock = blocks[index];
                    if (originalBlock) {
                        return {
                            ...aiBlock,
                            id: originalBlock.id,
                            componentFile: originalBlock.componentFile
                        };
                    }
                    return aiBlock;
                });

                console.log("=== APPLYING MULTI COMPONENT EDIT ===")
            }

            console.log("Mode:", editMode)
            console.log("Before:", blocks)
            console.log("After:", updatedBlocks)

            setBlocks(updatedBlocks)
            setPreviewBlocks(null)
            setPrompt("")
            setError(null)
        }
    }

    const handleDiscard = () => {
        setPreviewBlocks(null)
    }

    return (
        <div className="fixed inset-y-0 right-0 w-96 bg-white border-l shadow-2xl z-50 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b bg-gradient-to-r from-purple-50 to-blue-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg">
                        <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h2 className="font-semibold text-lg">AI Assistant</h2>
                        <p className="text-xs text-zinc-600">Powered by Gemini</p>
                    </div>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="h-5 w-5" />
                </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Edit Mode Selection */}
                <div className="space-y-2">
                    <Label className="text-sm font-medium">Select Edit Mode</Label>
                    <div className="grid grid-cols-2 gap-2">
                        {editModes.map((mode) => {
                            const Icon = mode.icon
                            const isDisabled = mode.requiresSelection && !selectedBlockId
                            return (
                                <button
                                    key={mode.id}
                                    onClick={() => !isDisabled && setEditMode(mode.id)}
                                    disabled={isDisabled}
                                    className={`p-3 rounded-lg border-2 text-left transition-all ${editMode === mode.id
                                        ? "border-blue-500 bg-blue-50"
                                        : isDisabled
                                            ? "border-zinc-200 bg-zinc-50 opacity-50 cursor-not-allowed"
                                            : "border-zinc-200 hover:border-blue-200 hover:bg-blue-50/50"
                                        }`}
                                >
                                    <Icon className={`h-4 w-4 mb-1 ${editMode === mode.id ? "text-blue-600" : "text-zinc-600"}`} />
                                    <div className="text-xs font-medium text-zinc-900">{mode.label}</div>
                                </button>
                            )
                        })}
                    </div>
                    {selectedMode && (
                        <div className="text-xs text-zinc-600 p-3 bg-zinc-50 rounded-lg">
                            <p className="font-medium mb-1">{selectedMode.description}</p>
                            <p className="text-zinc-500">
                                <span className="font-medium">Example:</span> "{selectedMode.example}"
                            </p>
                        </div>
                    )}
                </div>

                {/* Prompt Input */}
                <div className="space-y-2">
                    <Label htmlFor="ai-prompt" className="text-sm font-medium">
                        What would you like to change?
                    </Label>
                    {selectedBlockId && selectedMode?.supportsSelection && (
                        <div className="text-xs bg-blue-50 text-blue-700 p-2 rounded border border-blue-200">
                            <strong>Editing selected component only.</strong> You can reference other components (e.g., "match the first hero's colors")
                        </div>
                    )}
                    {!selectedBlockId && !selectedMode?.requiresSelection && (
                        <div className="text-xs bg-purple-50 text-purple-700 p-2 rounded border border-purple-200">
                            <strong>Editing all components.</strong> Select a component first to edit just that one.
                        </div>
                    )}
                    <Textarea
                        id="ai-prompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder={selectedMode?.example || "Describe your changes..."}
                        className="min-h-[100px] resize-none"
                        disabled={isProcessing}
                    />
                </div>

                {/* Error Message */}
                {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                        {error}
                    </div>
                )}

                {/* Preview */}
                {previewBlocks && (
                    <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg space-y-3">
                        <div className="flex items-center gap-2 text-green-700 font-medium">
                            <Sparkles className="h-4 w-4" />
                            AI Suggestions Ready
                        </div>
                        <p className="text-sm text-green-600">
                            {previewBlocks.length} component{previewBlocks.length !== 1 ? "s" : ""} will be updated
                        </p>
                        <div className="flex gap-2">
                            <Button onClick={handleApplyChanges} size="sm" className="flex-1">
                                Apply Changes
                            </Button>
                            <Button onClick={handleDiscard} size="sm" variant="outline">
                                Discard
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t bg-zinc-50">
                <Button
                    onClick={handleSubmit}
                    disabled={isProcessing || !prompt.trim()}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                    {isProcessing ? (
                        <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            AI is thinking...
                        </>
                    ) : (
                        <>
                            <Sparkles className="h-4 w-4 mr-2" />
                            Generate with AI
                        </>
                    )}
                </Button>
            </div>
        </div>
    )
}
