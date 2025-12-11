"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2, ExternalLink, Copy, Check, Globe, Sparkles } from "lucide-react"
import { generateSubdomain, buildPublishedUrl } from "@/lib/subdomain-utils"

interface PublishModalProps {
    open: boolean
    onClose: () => void
    projectId: string
    projectName: string
    onPublishSuccess?: (publishedUrl: string) => void
}

export function PublishModal({ open, onClose, projectId, projectName, onPublishSuccess }: PublishModalProps) {
    const [isPublishing, setIsPublishing] = useState(false)
    const [publishedUrl, setPublishedUrl] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [copied, setCopied] = useState(false)

    const previewSubdomain = generateSubdomain(projectName)
    const previewUrl = buildPublishedUrl(previewSubdomain)

    const handlePublish = async () => {
        setIsPublishing(true)
        setError(null)

        try {
            const response = await fetch(`/api/projects/${projectId}/publish`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            })

            const data = await response.json()

            if (data.success) {
                setPublishedUrl(data.project.publishedUrl)
                onPublishSuccess?.(data.project.publishedUrl)
            } else {
                setError(data.error || 'Failed to publish project')
            }
        } catch (err) {
            setError('An error occurred while publishing')
            console.error('Publish error:', err)
        } finally {
            setIsPublishing(false)
        }
    }

    const handleCopyUrl = () => {
        if (publishedUrl) {
            navigator.clipboard.writeText(publishedUrl)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    const handleClose = () => {
        setPublishedUrl(null)
        setError(null)
        setCopied(false)
        onClose()
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px]">
                {!publishedUrl ? (
                    <>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-amber-500" />
                                Publish Your Project
                            </DialogTitle>
                            <DialogDescription>
                                Your project will be published and accessible to everyone on the internet.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-700">
                                    Your project will be published at:
                                </label>
                                <div className="flex items-center gap-2 p-3 bg-zinc-50 border border-zinc-200 rounded-lg">
                                    <Globe className="h-4 w-4 text-zinc-500 shrink-0" />
                                    <code className="text-sm font-mono text-zinc-900 break-all">
                                        {previewUrl}
                                    </code>
                                </div>
                                <p className="text-xs text-zinc-500">
                                    The subdomain is automatically generated from your project name.
                                </p>
                            </div>

                            {error && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-sm text-red-600">{error}</p>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button
                                variant="outline"
                                onClick={handleClose}
                                disabled={isPublishing}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handlePublish}
                                disabled={isPublishing}
                                className="bg-zinc-900 text-white hover:bg-zinc-800"
                            >
                                {isPublishing ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Publishing...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="h-4 w-4 mr-2 text-amber-400" />
                                        Publish Now
                                    </>
                                )}
                            </Button>
                        </div>
                    </>
                ) : (
                    <>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-green-600">
                                <Check className="h-5 w-5" />
                                Successfully Published!
                            </DialogTitle>
                            <DialogDescription>
                                Your project is now live and accessible to everyone.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-700">
                                    Your published URL:
                                </label>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                                        <Globe className="h-4 w-4 text-green-600 shrink-0" />
                                        <code className="text-sm font-mono text-green-700 break-all">
                                            {publishedUrl}
                                        </code>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={handleCopyUrl}
                                        className="shrink-0"
                                    >
                                        {copied ? (
                                            <Check className="h-4 w-4 text-green-600" />
                                        ) : (
                                            <Copy className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => window.open(publishedUrl, '_blank')}
                                >
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    View Site
                                </Button>
                                <Button
                                    className="flex-1 bg-zinc-900 text-white hover:bg-zinc-800"
                                    onClick={handleClose}
                                >
                                    Done
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}
