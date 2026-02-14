
import React, { useState, useEffect } from "react"
import { Bold, Italic, Type, Palette, Layout, Sparkles, X, Move, Link as LinkIcon, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ElementToolbarProps {
    elementId: string // The CSS selector
    tagName: string
    initialStyles: React.CSSProperties
    initialContent: string
    hasChildren?: boolean
    context?: string
    onUpdateStyle: (styles: React.CSSProperties) => void
    onUpdateContent: (content: string) => void
    onClose: () => void
    position: { x: number, y: number }
}

export function ElementToolbar({
    elementId,
    tagName,
    initialStyles,
    initialContent,
    onUpdateStyle,
    onUpdateContent,
    onClose,
    position,
    context,
    hasChildren
}: ElementToolbarProps) {
    const [styles, setStyles] = useState<React.CSSProperties>(initialStyles || {})
    const [content, setContent] = useState(initialContent)
    const [activeTab, setActiveTab] = useState("style")
    const [generatingOp, setGeneratingOp] = useState<string | null>(null)

    // Sync local state when props change (new selection)
    useEffect(() => {
        setStyles(initialStyles || {})
        setContent(initialContent)
    }, [elementId, initialStyles, initialContent])

    const handleStyleChange = (property: string, value: string | number) => {
        const newStyles = { ...styles, [property]: value }
        setStyles(newStyles)
        onUpdateStyle(newStyles)
    }

    const handleContentChange = (newContent: string) => {
        setContent(newContent)
        onUpdateContent(newContent)
    }

    const handleAiRewrite = async (prompt: string, opId: string) => {
        if (!content) return;

        setGeneratingOp(opId);
        try {
            const response = await fetch('/api/ai/rewrite', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: content,
                    rewriteType: prompt,
                    projectContext: context || "General website content"
                })
            });

            const data = await response.json();
            if (data.success && data.text) {
                handleContentChange(data.text);
            }
        } catch (error) {
            console.error("Rewrite failed:", error);
        } finally {
            setGeneratingOp(null);
        }
    }

    // Determine available controls based on tag
    const isText = ["H1", "H2", "H3", "H4", "H5", "H6", "P", "SPAN", "DIV", "BUTTON", "A", "LI"].includes(tagName)
    const canEditText = isText && !hasChildren
    const isImage = tagName === "IMG"
    const isLink = tagName === "A"

    return (
        <div
            className="absolute z-50 bg-white rounded-lg shadow-2xl border border-zinc-200 w-80 flex flex-col animate-in fade-in zoom-in-95 duration-200"
            style={{
                top: `${position.y}px`,
                left: `${position.x}px`,
                // Ensure it doesn't go off screen - logic could be improved
            }}
            onClick={(e) => e.stopPropagation()}
        >
            {/* Header / Drag Handle */}
            <div className="flex items-center justify-between p-2 border-b border-zinc-100 bg-zinc-50 rounded-t-lg cursor-move">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded uppercase">
                        {tagName.toLowerCase()}
                    </span>
                    <span className="text-xs text-zinc-400 truncate max-w-[150px]">{elementId}</span>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
                    <X className="h-3 w-3" />
                </Button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0 h-9">
                    <TabsTrigger value="style" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-4 py-2 text-xs">
                        Style
                    </TabsTrigger>
                    {(canEditText || isImage) && (
                        <TabsTrigger value="content" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-4 py-2 text-xs">
                            Content
                        </TabsTrigger>
                    )}
                    <TabsTrigger value="ai" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-4 py-2 text-xs">
                        AI Magic
                    </TabsTrigger>
                </TabsList>

                <div className="p-4 max-h-[400px] overflow-y-auto">
                    <TabsContent value="style" className="mt-0 space-y-4">
                        {/* Typography */}
                        {isText && (
                            <div className="space-y-3">
                                <Label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Typography</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <Label className="text-xs mb-1.5 block">Color</Label>
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-6 h-6 rounded border shadow-sm"
                                                style={{ backgroundColor: (styles.color as string) || '#000000' }}
                                            />
                                            <Input
                                                type="color"
                                                className="w-full h-8 p-1"
                                                value={(styles.color as string) || '#000000'}
                                                onChange={(e) => handleStyleChange('color', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="text-xs mb-1.5 block">Size (px)</Label>
                                        <Input
                                            type="number"
                                            className="h-8"
                                            value={parseInt((styles.fontSize as string) || '16')}
                                            onChange={(e) => handleStyleChange('fontSize', `${e.target.value}px`)}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-xs mb-1.5 block">Weight</Label>
                                    <div className="flex bg-zinc-100 rounded-md p-1 gap-1">
                                        {[400, 500, 600, 700].map(weight => (
                                            <button
                                                key={weight}
                                                className={`flex-1 text-xs py-1 rounded ${styles.fontWeight == weight ? 'bg-white shadow-sm font-bold' : 'text-zinc-500'}`}
                                                onClick={() => handleStyleChange('fontWeight', weight)}
                                            >
                                                {weight === 400 ? 'Reg' : weight === 700 ? 'Bold' : weight}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-xs mb-1.5 block">Align</Label>
                                    <div className="flex bg-zinc-100 rounded-md p-1 gap-1">
                                        {['left', 'center', 'right'].map(align => (
                                            <button
                                                key={align}
                                                className={`flex-1 text-xs py-1 rounded capitalize ${styles.textAlign === align ? 'bg-white shadow-sm font-bold' : 'text-zinc-500'}`}
                                                onClick={() => handleStyleChange('textAlign', align)}
                                            >
                                                {align}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Spacing & Border */}
                        <div className="space-y-3 pt-2 border-t border-zinc-100">
                            <Label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Spacing & Border</Label>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <Label className="text-xs mb-1.5 block">Margin (px)</Label>
                                    <Input
                                        type="text"
                                        className="h-8"
                                        placeholder="e.g. 10px or auto"
                                        value={(styles.margin as string) || ''}
                                        onChange={(e) => handleStyleChange('margin', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label className="text-xs mb-1.5 block">Padding (px)</Label>
                                    <Input
                                        type="text"
                                        className="h-8"
                                        placeholder="e.g. 10px"
                                        value={(styles.padding as string) || ''}
                                        onChange={(e) => handleStyleChange('padding', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <Label className="text-xs mb-1.5 block">Radius (px)</Label>
                                    <Input
                                        type="number"
                                        className="h-8"
                                        value={parseInt((styles.borderRadius as string) || '0')}
                                        onChange={(e) => handleStyleChange('borderRadius', `${e.target.value}px`)}
                                    />
                                </div>
                                <div>
                                    <Label className="text-xs mb-1.5 block">Border Width</Label>
                                    <Input
                                        type="number"
                                        className="h-8"
                                        value={parseInt((styles.borderWidth as string) || '0')}
                                        onChange={(e) => handleStyleChange('borderWidth', `${e.target.value}px`)}
                                    />
                                </div>
                            </div>
                            <div>
                                <Label className="text-xs mb-1.5 block">Border Color</Label>
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-6 h-6 rounded border shadow-sm"
                                        style={{ backgroundColor: (styles.borderColor as string) || 'transparent' }}
                                    />
                                    <Input
                                        type="color"
                                        className="w-full h-8 p-1"
                                        value={(styles.borderColor as string) || '#000000'}
                                        onChange={(e) => handleStyleChange('borderColor', e.target.value)}
                                        // Ensure border style is set if color is picked
                                        onBlur={() => {
                                            if (!styles.borderStyle) handleStyleChange('borderStyle', 'solid');
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Background */}
                        <div className="space-y-3 pt-2 border-t border-zinc-100">
                            <Label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Background & Effects</Label>
                            <div>
                                <Label className="text-xs mb-1.5 block">Color</Label>
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-6 h-6 rounded border shadow-sm"
                                        style={{ backgroundColor: (styles.backgroundColor as string) || 'transparent' }}
                                    />
                                    <Input
                                        type="color"
                                        className="w-full h-8 p-1"
                                        value={(styles.backgroundColor as string) || '#ffffff'}
                                        onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <Label className="text-xs mb-1.5 block">Shadow</Label>
                                <Input
                                    type="text"
                                    className="h-8"
                                    placeholder="e.g. 0 4px 6px -1px rgb(0 0 0 / 0.1)"
                                    value={(styles.boxShadow as string) || ''}
                                    onChange={(e) => handleStyleChange('boxShadow', e.target.value)}
                                />
                            </div>
                        </div>

                    </TabsContent>

                    {(canEditText || isImage) && (
                        <TabsContent value="content" className="mt-0 space-y-4">
                            {canEditText && (
                                <div className="space-y-2">
                                    <Label>Text Content</Label>
                                    <Textarea
                                        value={content}
                                        onChange={(e) => handleContentChange(e.target.value)}
                                        rows={5}
                                        className="resize-none"
                                    />
                                </div>
                            )}
                            {isLink && (
                                <div className="space-y-2">
                                    <Label>Link URL</Label>
                                    <Input placeholder="https://" />
                                </div>
                            )}
                            {isImage && (
                                <div className="space-y-2">
                                    <Label>Image Source</Label>
                                    <Input placeholder="/images/..." />
                                </div>
                            )}
                        </TabsContent>
                    )}

                    <TabsContent value="ai" className="mt-0 space-y-4">
                        {canEditText ? (
                            <>
                                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-sm text-blue-700 mb-2">
                                    <Sparkles className="w-4 h-4 inline-block mr-1" />
                                    Use AI to rewrite or style this element.
                                </div>
                                <div className="grid grid-cols-1 gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="justify-start"
                                        onClick={() => handleAiRewrite("Make it sharper, more professional and concise", "professional")}
                                        disabled={!!generatingOp}
                                    >
                                        <Sparkles className="w-4 h-4 mr-2 text-purple-500" />
                                        {generatingOp === "professional" ? "Rewriting..." : "Reword Professional"}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="justify-start"
                                        onClick={() => handleAiRewrite("Make it punchy, exciting and marketing-focused", "punchy")}
                                        disabled={!!generatingOp}
                                    >
                                        <Sparkles className="w-4 h-4 mr-2 text-blue-500" />
                                        {generatingOp === "punchy" ? "Rewriting..." : "Make it Punchy"}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="justify-start"
                                        onClick={() => handleAiRewrite("Fix grammar and spelling", "grammar")}
                                        disabled={!!generatingOp}
                                    >
                                        <Type className="w-4 h-4 mr-2 text-green-500" />
                                        {generatingOp === "grammar" ? "Fixing..." : "Fix Grammar"}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="justify-start"
                                        onClick={() => handleAiRewrite("Make it shorter and more direct", "shorten")}
                                        disabled={!!generatingOp}
                                    >
                                        <Move className="w-4 h-4 mr-2 text-orange-500" />
                                        {generatingOp === "shorten" ? "Shortening..." : "Shorten"}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="justify-start"
                                        onClick={() => handleAiRewrite("Expand with more details and explanation", "expand")}
                                        disabled={!!generatingOp}
                                    >
                                        <Layout className="w-4 h-4 mr-2 text-pink-500" />
                                        {generatingOp === "expand" ? "Expanding..." : "Expand"}
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-8 text-zinc-500 text-sm">
                                <Sparkles className="w-8 h-8 mx-auto mb-2 text-zinc-300" />
                                {hasChildren
                                    ? "AI editing is only available for text elements without children."
                                    : "AI generation for this element type is coming soon."}
                            </div>
                        )}
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    )
}
