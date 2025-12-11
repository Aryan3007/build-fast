"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { X, Loader2, Save } from "lucide-react"
import { useBuilder } from "./builder-context"

interface SaveTemplateModalProps {
    onClose: () => void
}

export function SaveTemplateModal({ onClose }: SaveTemplateModalProps) {
    const { blocks } = useBuilder()
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const handleSave = async () => {
        if (!name.trim()) {
            setError("Please enter a template name")
            return
        }

        setIsSaving(true)
        setError(null)

        try {
            const response = await fetch("/api/templates/save", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: name.trim(),
                    description: description.trim() || null,
                    blocks,
                }),
            })

            const data = await response.json()

            if (!data.success) {
                setError(data.error || "Failed to save template")
                return
            }

            setSuccess(true)
            setTimeout(() => {
                onClose()
            }, 1500)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to save template")
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
                            <Save className="h-5 w-5 text-white" />
                        </div>
                        <h2 className="text-lg font-semibold">Save Template</h2>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    {success ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Save className="h-8 w-8 text-green-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-green-600 mb-2">Template Saved!</h3>
                            <p className="text-sm text-zinc-600">Your template has been saved successfully</p>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="template-name">Template Name *</Label>
                                <Input
                                    id="template-name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="My Awesome Template"
                                    disabled={isSaving}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="template-description">Description (Optional)</Label>
                                <Textarea
                                    id="template-description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Describe your template..."
                                    className="min-h-[100px] resize-none"
                                    disabled={isSaving}
                                />
                            </div>

                            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
                                <p className="font-medium">Saving {blocks.length} component{blocks.length !== 1 ? "s" : ""}</p>
                            </div>

                            {error && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                                    {error}
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Footer */}
                {!success && (
                    <div className="p-6 border-t bg-zinc-50 flex gap-3">
                        <Button variant="outline" onClick={onClose} disabled={isSaving} className="flex-1">
                            Cancel
                        </Button>
                        <Button onClick={handleSave} disabled={isSaving || !name.trim()} className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                            {isSaving ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4 mr-2" />
                                    Save Template
                                </>
                            )}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
