"use client"

import { useBuilder } from "./builder-context"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { Type, Palette, Box, Layout, Square, Sparkles } from "lucide-react"

type TabType = "content" | "typography" | "colors" | "spacing" | "layout" | "borders" | "effects"

export function RightSidebar() {
    const { blocks, selectedBlockId, selectedElementId, updateBlock, updateBlockStyles } = useBuilder()
    const [activeTab, setActiveTab] = useState<TabType>("content")

    const selectedBlock = blocks.find(b => b.id === selectedBlockId)

    if (!selectedBlock) {
        return (
            <div className="w-80 border shadow-xl rounded-lg overflow-hidden bg-zinc-50 flex flex-col h-full p-4 text-center text-zinc-500 text-sm justify-center">
                Select a block or element to edit
            </div>
        )
    }

    const handlePropChange = (key: string, value: any) => {
        updateBlock(selectedBlock.id, { [key]: value })
    }

    const handleStyleChange = (property: string, value: string) => {
        if (selectedElementId) {
            updateBlockStyles(selectedBlock.id, selectedElementId, { [property]: value })
        }
    }

    const currentStyles = selectedElementId ? (selectedBlock.styles?.[selectedElementId] || {}) : {}

    const tabs = [
        { id: "content" as TabType, label: "Content", icon: Type, show: !selectedElementId },
        { id: "typography" as TabType, label: "Typography", icon: Type, show: !!selectedElementId },
        { id: "colors" as TabType, label: "Colors", icon: Palette, show: !!selectedElementId },
        { id: "spacing" as TabType, label: "Spacing", icon: Box, show: !!selectedElementId },
        { id: "layout" as TabType, label: "Layout", icon: Layout, show: !!selectedElementId },
        { id: "borders" as TabType, label: "Borders", icon: Square, show: !!selectedElementId },
        { id: "effects" as TabType, label: "Effects", icon: Sparkles, show: !!selectedElementId },
    ].filter(tab => tab.show)

    const renderContentEditor = () => {
        const props = selectedBlock.props || {}

        return Object.entries(props).map(([key, value]) => {
            if (typeof value === 'string') {
                const isLongText = value.length > 50 || key.includes("description") || key.includes("subtitle")
                return (
                    <div key={key} className="space-y-2">
                        <Label htmlFor={key} className="text-xs font-medium text-zinc-700 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                        </Label>
                        {isLongText ? (
                            <Textarea
                                id={key}
                                value={value}
                                onChange={(e) => handlePropChange(key, e.target.value)}
                                className="min-h-[80px] text-sm"
                            />
                        ) : (
                            <Input
                                id={key}
                                value={value}
                                onChange={(e) => handlePropChange(key, e.target.value)}
                                className="text-sm"
                            />
                        )}
                    </div>
                )
            }
            if (Array.isArray(value)) {
                return (
                    <div key={key} className="space-y-2">
                        <Label className="text-xs font-medium text-zinc-700 capitalize">{key}</Label>
                        <div className="text-xs text-zinc-500 p-3 border rounded bg-zinc-50">
                            Array editing not yet implemented
                        </div>
                    </div>
                )
            }
            return null
        })
    }

    const renderTypographyControls = () => (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label className="text-xs font-medium text-zinc-700">Font Family</Label>
                <select
                    value={currentStyles.fontFamily as string || ""}
                    onChange={(e) => handleStyleChange("fontFamily", e.target.value)}
                    className="w-full h-10 px-3 rounded-md border text-sm bg-white"
                >
                    <option value="">Default</option>
                    <option value="Arial, sans-serif">Arial</option>
                    <option value="'Times New Roman', serif">Times New Roman</option>
                    <option value="'Courier New', monospace">Courier New</option>
                    <option value="Georgia, serif">Georgia</option>
                    <option value="Verdana, sans-serif">Verdana</option>
                    <option value="'Trebuchet MS', sans-serif">Trebuchet MS</option>
                    <option value="Inter, sans-serif">Inter</option>
                    <option value="'Playfair Display', serif">Playfair Display</option>
                </select>
            </div>

            <div className="space-y-2">
                <Label className="text-xs font-medium text-zinc-700">Font Size</Label>
                <div className="flex gap-2">
                    <Input
                        value={currentStyles.fontSize as string || ""}
                        onChange={(e) => handleStyleChange("fontSize", e.target.value)}
                        placeholder="16px"
                        className="text-sm flex-1"
                    />
                    <select className="h-10 px-2 rounded-md border text-sm w-20 bg-white">
                        <option>px</option>
                        <option>rem</option>
                        <option>em</option>
                    </select>
                </div>
            </div>

            <div className="space-y-2">
                <Label className="text-xs font-medium text-zinc-700">Font Weight</Label>
                <select
                    value={currentStyles.fontWeight as string || ""}
                    onChange={(e) => handleStyleChange("fontWeight", e.target.value)}
                    className="w-full h-10 px-3 rounded-md border text-sm bg-white"
                >
                    <option value="">Default</option>
                    <option value="300">Light (300)</option>
                    <option value="400">Normal (400)</option>
                    <option value="500">Medium (500)</option>
                    <option value="600">Semibold (600)</option>
                    <option value="700">Bold (700)</option>
                    <option value="800">Extrabold (800)</option>
                </select>
            </div>

            <div className="space-y-2">
                <Label className="text-xs font-medium text-zinc-700">Text Align</Label>
                <div className="grid grid-cols-4 gap-1">
                    {['left', 'center', 'right', 'justify'].map(align => (
                        <button
                            key={align}
                            onClick={() => handleStyleChange("textAlign", align)}
                            className={`h-10 rounded border text-xs capitalize ${currentStyles.textAlign === align
                                ? 'bg-blue-500 text-white border-blue-600'
                                : 'bg-white hover:bg-zinc-50'
                                }`}
                        >
                            {align}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <Label className="text-xs font-medium text-zinc-700">Line Height</Label>
                <Input
                    value={currentStyles.lineHeight as string || ""}
                    onChange={(e) => handleStyleChange("lineHeight", e.target.value)}
                    placeholder="1.5"
                    className="text-sm"
                />
            </div>

            <div className="space-y-2">
                <Label className="text-xs font-medium text-zinc-700">Letter Spacing</Label>
                <Input
                    value={currentStyles.letterSpacing as string || ""}
                    onChange={(e) => handleStyleChange("letterSpacing", e.target.value)}
                    placeholder="0px"
                    className="text-sm"
                />
            </div>

            <div className="space-y-2">
                <Label className="text-xs font-medium text-zinc-700">Text Transform</Label>
                <select
                    value={currentStyles.textTransform as string || ""}
                    onChange={(e) => handleStyleChange("textTransform", e.target.value)}
                    className="w-full h-10 px-3 rounded-md border text-sm bg-white"
                >
                    <option value="">None</option>
                    <option value="uppercase">UPPERCASE</option>
                    <option value="lowercase">lowercase</option>
                    <option value="capitalize">Capitalize</option>
                </select>
            </div>
        </div>
    )

    const renderColorControls = () => (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label className="text-xs font-medium text-zinc-700">Text Color</Label>
                <div className="flex gap-2">
                    <Input
                        type="color"
                        className="w-14 h-10 p-1 cursor-pointer"
                        value={currentStyles.color as string || "#000000"}
                        onChange={(e) => handleStyleChange("color", e.target.value)}
                    />
                    <Input
                        value={currentStyles.color as string || ""}
                        onChange={(e) => handleStyleChange("color", e.target.value)}
                        placeholder="#000000"
                        className="text-sm flex-1"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label className="text-xs font-medium text-zinc-700">Background Color</Label>
                <div className="flex gap-2">
                    <Input
                        type="color"
                        className="w-14 h-10 p-1 cursor-pointer"
                        value={currentStyles.backgroundColor as string || "#ffffff"}
                        onChange={(e) => handleStyleChange("backgroundColor", e.target.value)}
                    />
                    <Input
                        value={currentStyles.backgroundColor as string || ""}
                        onChange={(e) => handleStyleChange("backgroundColor", e.target.value)}
                        placeholder="transparent"
                        className="text-sm flex-1"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label className="text-xs font-medium text-zinc-700">Opacity</Label>
                <div className="flex gap-3 items-center">
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={currentStyles.opacity as number || 1}
                        onChange={(e) => handleStyleChange("opacity", e.target.value)}
                        className="flex-1"
                    />
                    <span className="text-sm text-zinc-600 w-12 text-right">
                        {((currentStyles.opacity as number || 1) * 100).toFixed(0)}%
                    </span>
                </div>
            </div>
        </div>
    )

    const renderSpacingControls = () => (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label className="text-xs font-medium text-zinc-700">Padding</Label>
                <Input
                    value={currentStyles.padding as string || ""}
                    onChange={(e) => handleStyleChange("padding", e.target.value)}
                    placeholder="10px 20px"
                    className="text-sm"
                />
                <div className="grid grid-cols-2 gap-2 mt-2">
                    <Input
                        value={currentStyles.paddingTop as string || ""}
                        onChange={(e) => handleStyleChange("paddingTop", e.target.value)}
                        placeholder="Top"
                        className="text-xs"
                    />
                    <Input
                        value={currentStyles.paddingRight as string || ""}
                        onChange={(e) => handleStyleChange("paddingRight", e.target.value)}
                        placeholder="Right"
                        className="text-xs"
                    />
                    <Input
                        value={currentStyles.paddingBottom as string || ""}
                        onChange={(e) => handleStyleChange("paddingBottom", e.target.value)}
                        placeholder="Bottom"
                        className="text-xs"
                    />
                    <Input
                        value={currentStyles.paddingLeft as string || ""}
                        onChange={(e) => handleStyleChange("paddingLeft", e.target.value)}
                        placeholder="Left"
                        className="text-xs"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label className="text-xs font-medium text-zinc-700">Margin</Label>
                <Input
                    value={currentStyles.margin as string || ""}
                    onChange={(e) => handleStyleChange("margin", e.target.value)}
                    placeholder="10px"
                    className="text-sm"
                />
                <div className="grid grid-cols-2 gap-2 mt-2">
                    <Input
                        value={currentStyles.marginTop as string || ""}
                        onChange={(e) => handleStyleChange("marginTop", e.target.value)}
                        placeholder="Top"
                        className="text-xs"
                    />
                    <Input
                        value={currentStyles.marginRight as string || ""}
                        onChange={(e) => handleStyleChange("marginRight", e.target.value)}
                        placeholder="Right"
                        className="text-xs"
                    />
                    <Input
                        value={currentStyles.marginBottom as string || ""}
                        onChange={(e) => handleStyleChange("marginBottom", e.target.value)}
                        placeholder="Bottom"
                        className="text-xs"
                    />
                    <Input
                        value={currentStyles.marginLeft as string || ""}
                        onChange={(e) => handleStyleChange("marginLeft", e.target.value)}
                        placeholder="Left"
                        className="text-xs"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label className="text-xs font-medium text-zinc-700">Gap</Label>
                <Input
                    value={currentStyles.gap as string || ""}
                    onChange={(e) => handleStyleChange("gap", e.target.value)}
                    placeholder="16px"
                    className="text-sm"
                />
            </div>
        </div>
    )

    const renderLayoutControls = () => (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label className="text-xs font-medium text-zinc-700">Display</Label>
                <select
                    value={currentStyles.display as string || ""}
                    onChange={(e) => handleStyleChange("display", e.target.value)}
                    className="w-full h-10 px-3 rounded-md border text-sm bg-white"
                >
                    <option value="">Default</option>
                    <option value="block">Block</option>
                    <option value="inline-block">Inline Block</option>
                    <option value="flex">Flex</option>
                    <option value="grid">Grid</option>
                    <option value="none">none</option>
                </select>
            </div>

            <div className="space-y-2">
                <Label className="text-xs font-medium text-zinc-700">Width</Label>
                <Input
                    value={currentStyles.width as string || ""}
                    onChange={(e) => handleStyleChange("width", e.target.value)}
                    placeholder="auto"
                    className="text-sm"
                />
            </div>

            <div className="space-y-2">
                <Label className="text-xs font-medium text-zinc-700">Height</Label>
                <Input
                    value={currentStyles.height as string || ""}
                    onChange={(e) => handleStyleChange("height", e.target.value)}
                    placeholder="auto"
                    className="text-sm"
                />
            </div>

            {(currentStyles.display === 'flex') && (
                <>
                    <div className="space-y-2">
                        <Label className="text-xs font-medium text-zinc-700">Flex Direction</Label>
                        <select
                            value={currentStyles.flexDirection as string || ""}
                            onChange={(e) => handleStyleChange("flexDirection", e.target.value)}
                            className="w-full h-10 px-3 rounded-md border text-sm bg-white"
                        >
                            <option value="">Default</option>
                            <option value="row">Row</option>
                            <option value="column">Column</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs font-medium text-zinc-700">Justify Content</Label>
                        <select
                            value={currentStyles.justifyContent as string || ""}
                            onChange={(e) => handleStyleChange("justifyContent", e.target.value)}
                            className="w-full h-10 px-3 rounded-md border text-sm bg-white"
                        >
                            <option value="">Default</option>
                            <option value="flex-start">Start</option>
                            <option value="center">Center</option>
                            <option value="flex-end">End</option>
                            <option value="space-between">Space Between</option>
                            <option value="space-around">Space Around</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs font-medium text-zinc-700">Align Items</Label>
                        <select
                            value={currentStyles.alignItems as string || ""}
                            onChange={(e) => handleStyleChange("alignItems", e.target.value)}
                            className="w-full h-10 px-3 rounded-md border text-sm bg-white"
                        >
                            <option value="">Default</option>
                            <option value="flex-start">Start</option>
                            <option value="center">Center</option>
                            <option value="flex-end">End</option>
                            <option value="stretch">Stretch</option>
                        </select>
                    </div>
                </>
            )}
        </div>
    )

    const renderBorderControls = () => (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label className="text-xs font-medium text-zinc-700">Border Width</Label>
                <Input
                    value={currentStyles.borderWidth as string || ""}
                    onChange={(e) => handleStyleChange("borderWidth", e.target.value)}
                    placeholder="1px"
                    className="text-sm"
                />
            </div>

            <div className="space-y-2">
                <Label className="text-xs font-medium text-zinc-700">Border Style</Label>
                <select
                    value={currentStyles.borderStyle as string || ""}
                    onChange={(e) => handleStyleChange("borderStyle", e.target.value)}
                    className="w-full h-10 px-3 rounded-md border text-sm bg-white"
                >
                    <option value="">None</option>
                    <option value="solid">Solid</option>
                    <option value="dashed">Dashed</option>
                    <option value="dotted">Dotted</option>
                </select>
            </div>

            <div className="space-y-2">
                <Label className="text-xs font-medium text-zinc-700">Border Color</Label>
                <div className="flex gap-2">
                    <Input
                        type="color"
                        className="w-14 h-10 p-1 cursor-pointer"
                        value={currentStyles.borderColor as string || "#000000"}
                        onChange={(e) => handleStyleChange("borderColor", e.target.value)}
                    />
                    <Input
                        value={currentStyles.borderColor as string || ""}
                        onChange={(e) => handleStyleChange("borderColor", e.target.value)}
                        placeholder="#000000"
                        className="text-sm flex-1"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label className="text-xs font-medium text-zinc-700">Border Radius</Label>
                <Input
                    value={currentStyles.borderRadius as string || ""}
                    onChange={(e) => handleStyleChange("borderRadius", e.target.value)}
                    placeholder="8px"
                    className="text-sm"
                />
            </div>
        </div>
    )

    const renderEffectsControls = () => (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label className="text-xs font-medium text-zinc-700">Box Shadow</Label>
                <Input
                    value={currentStyles.boxShadow as string || ""}
                    onChange={(e) => handleStyleChange("boxShadow", e.target.value)}
                    placeholder="0 4px 6px rgba(0,0,0,0.1)"
                    className="text-sm"
                />
                <div className="text-xs text-zinc-500 mt-1">
                    Example: 0 4px 6px rgba(0,0,0,0.1)
                </div>
            </div>

            <div className="space-y-2">
                <Label className="text-xs font-medium text-zinc-700">Text Shadow</Label>
                <Input
                    value={currentStyles.textShadow as string || ""}
                    onChange={(e) => handleStyleChange("textShadow", e.target.value)}
                    placeholder="2px 2px 4px rgba(0,0,0,0.3)"
                    className="text-sm"
                />
            </div>

            <div className="space-y-2">
                <Label className="text-xs font-medium text-zinc-700">Transform</Label>
                <Input
                    value={currentStyles.transform as string || ""}
                    onChange={(e) => handleStyleChange("transform", e.target.value)}
                    placeholder="rotate(10deg)"
                    className="text-sm"
                />
                <div className="text-xs text-zinc-500 mt-1">
                    Examples: rotate(10deg), scale(1.1), translateX(10px)
                </div>
            </div>

            <div className="space-y-2">
                <Label className="text-xs font-medium text-zinc-700">Transition</Label>
                <Input
                    value={currentStyles.transition as string || ""}
                    onChange={(e) => handleStyleChange("transition", e.target.value)}
                    placeholder="all 0.3s ease"
                    className="text-sm"
                />
            </div>
        </div>
    )

    const renderTabContent = () => {
        switch (activeTab) {
            case "content":
                return renderContentEditor()
            case "typography":
                return renderTypographyControls()
            case "colors":
                return renderColorControls()
            case "spacing":
                return renderSpacingControls()
            case "layout":
                return renderLayoutControls()
            case "borders":
                return renderBorderControls()
            case "effects":
                return renderEffectsControls()
            default:
                return null
        }
    }

    return (
        <div className="w-80 border rounded-lg overflow-hidden bg-white flex flex-col h-full shadow-xl">
            <div className="p-4 border-b bg-zinc-50 shrink-0">
                <h2 className="font-semibold text-sm">{selectedBlock.componentFile || selectedBlock.type}</h2>
                {selectedElementId && (
                    <p className="text-xs text-zinc-500 mt-1">Element: {selectedElementId}</p>
                )}
            </div>

            {/* Tabs */}
            <div className="border-b bg-white shrink-0 overflow-x-auto">
                <div className="flex">
                    {tabs.map(tab => {
                        const Icon = tab.icon
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium whitespace-nowrap transition-colors border-b-2 ${activeTab === tab.id
                                    ? 'border-blue-500 text-blue-600 bg-blue-50/50'
                                    : 'border-transparent text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
                                    }`}
                            >
                                <Icon className="h-3.5 w-3.5" />
                                {tab.label}
                            </button>
                        )
                    })}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                <div className="p-4 space-y-4">
                    {renderTabContent()}
                </div>
            </div>
        </div>
    )
}
