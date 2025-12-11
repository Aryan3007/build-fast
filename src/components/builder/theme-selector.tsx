"use client"

import { Button } from "@/components/ui/button"
import { useBuilder, Theme } from "./builder-context"
import { Palette, Check } from "lucide-react"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

const THEMES: Theme[] = [
    {
        name: "Modern Blue",
        colors: {
            background: "#ffffff",
            accent: "#3b82f6" // blue-500
        }
    },
    {
        name: "Midnight",
        colors: {
            background: "#0f172a", // slate-900
            accent: "#38bdf8" // sky-400
        }
    },
    {
        name: "Forest",
        colors: {
            background: "#052e16", // green-950
            accent: "#4ade80" // green-400
        }
    },
    {
        name: "Lavender",
        colors: {
            background: "#faf5ff", // purple-50
            accent: "#a855f7" // purple-500
        }
    },
    {
        name: "Dark Purple",
        colors: {
            background: "#2e1065", // violet-950
            accent: "#c4b5fd" // violet-300
        }
    },
    {
        name: "Sunset",
        colors: {
            background: "#fff7ed", // orange-50
            accent: "#f97316" // orange-500
        }
    },
    {
        name: "Clean Gray",
        colors: {
            background: "#f8fafc", // slate-50
            accent: "#475569" // slate-600
        }
    },
    {
        name: "Black & White",
        colors: {
            background: "#000000",
            accent: "#ffffff"
        }
    }
]

export function ThemeSelector() {
    const { applyTheme } = useBuilder()

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="rounded-full">
                    <Palette className="h-4 w-4 mr-2" />
                    Select Theme
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="end">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">Color Palette</h4>
                        <p className="text-sm text-muted-foreground">
                            Apply a color theme to your entire page.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        {THEMES.map((theme) => (
                            <button
                                key={theme.name}
                                onClick={() => applyTheme(theme)}
                                className={cn(
                                    "flex items-center justify-start gap-3 p-2 rounded-lg border hover:bg-zinc-50 transition-colors text-left group",
                                )}
                            >
                                <div
                                    className="h-8 w-8 rounded-full border shadow-sm shrink-0"
                                    style={{
                                        backgroundColor: theme.colors.background,
                                        borderColor: theme.colors.accent === '#ffffff' ? '#e2e8f0' : 'transparent'
                                    }}
                                >
                                    <div
                                        className="h-full w-full rounded-full flex items-center justify-center"
                                        style={{ color: theme.colors.accent }}
                                    >
                                        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: theme.colors.accent }} />
                                    </div>
                                </div>
                                <span className="text-sm font-medium text-zinc-700 group-hover:text-zinc-900">
                                    {theme.name}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}
