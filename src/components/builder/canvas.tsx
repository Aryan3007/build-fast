"use client";

import { useBuilder } from "./builder-context";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import { Minus, Plus, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

// Dynamic imports for ALL component variations from database
const componentVariations: Record<string, any> = {
    // Hero variations
    HeroSocialLearning: dynamic(() =>
        import("@/components/variations/HeroSocialLearning").then((mod) => mod.HeroSocialLearning)
    ),
    HeroModern: dynamic(() =>
        import("@/components/variations/HeroModern").then((mod) => mod.HeroModern)
    ),
    HeroMinimal: dynamic(() =>
        import("@/components/variations/HeroMinimal").then((mod) => mod.HeroMinimal)
    ),
    // Features variations
    FeaturesGrid: dynamic(() =>
        import("@/components/variations/FeaturesGrid").then((mod) => mod.FeaturesGrid)
    ),
    FeaturesCards: dynamic(() =>
        import("@/components/variations/FeaturesCards").then((mod) => mod.FeaturesCards)
    ),
    // Pricing variations
    PricingSimple: dynamic(() =>
        import("@/components/variations/PricingSimple").then((mod) => mod.PricingSimple)
    ),
    // Navbar variations
    NavbarModern: dynamic(() =>
        import("@/components/variations/NavbarModern").then((mod) => mod.NavbarModern)
    ),
    NavbarMinimal: dynamic(() =>
        import("@/components/variations/NavbarMinimal").then((mod) => mod.NavbarMinimal)
    ),
    NavbarTransparent: dynamic(() =>
        import("@/components/variations/NavbarTransparent").then((mod) => mod.NavbarTransparent)
    ),
    // Footer variations
    FooterModern: dynamic(() =>
        import("@/components/variations/FooterModern").then((mod) => mod.FooterModern)
    ),
    FooterMinimal: dynamic(() =>
        import("@/components/variations/FooterMinimal").then((mod) => mod.FooterMinimal)
    ),
    FooterSocial: dynamic(() =>
        import("@/components/variations/FooterSocial").then((mod) => mod.FooterSocial)
    ),
};

const DEVICE_FRAMES = [
    { name: "Desktop", width: 1200, scale: 0.4 },
    { name: "Tablet", width: 768, scale: 0.5 },
    { name: "Mobile", width: 375, scale: 0.8 },
];

export function Canvas() {
    const { blocks, selectedBlockId, setSelectedBlockId } = useBuilder();
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [isSpacePressed, setIsSpacePressed] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const dragStartRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === "Space" && !e.repeat) setIsSpacePressed(true);
            if (e.ctrlKey || e.metaKey) {
                if (e.key === "=" || e.key === "+") {
                    e.preventDefault();
                    setScale((s) => Math.min(s + 0.1, 2));
                } else if (e.key === "-") {
                    e.preventDefault();
                    setScale((s) => Math.max(s - 0.1, 0.2));
                } else if (e.key === "0") {
                    e.preventDefault();
                    setScale(1);
                    setPosition({ x: 0, y: 0 });
                }
            }
        };
        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.code === "Space") {
                setIsSpacePressed(false);
                setIsDragging(false);
            }
        };
        const handleWheel = (e: WheelEvent) => {
            if (e.ctrlKey || e.metaKey) e.preventDefault();
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);
        window.addEventListener("wheel", handleWheel, { passive: false });
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
            window.removeEventListener("wheel", handleWheel);
        };
    }, []);

    const handleWheel = (e: React.WheelEvent) => {
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            const delta = -e.deltaY * 0.001;
            setScale((s) => Math.min(Math.max(s + delta, 0.2), 2));
        } else {
            setPosition((p) => ({ x: p.x - e.deltaX, y: p.y - e.deltaY }));
        }
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.button === 1 || (e.button === 0 && isSpacePressed)) {
            e.preventDefault();
            setIsDragging(true);
            dragStartRef.current = { x: e.clientX - position.x, y: e.clientY - position.y };
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging) {
            setPosition({ x: e.clientX - dragStartRef.current.x, y: e.clientY - dragStartRef.current.y });
        }
    };

    const handleMouseUp = () => setIsDragging(false);

    // ONLY render components from database with componentFile
    const renderBlocks = () => {
        return blocks.map((block) => {
            const isSelected = block.id === selectedBlockId;

            // Only render if component has a componentFile reference
            if (!block.componentFile || !componentVariations[block.componentFile]) {
                return null;
            }

            const VariationComponent = componentVariations[block.componentFile];

            return (
                <div
                    key={block.id}
                    onClick={(e) => {
                        if (!isDragging && !isSpacePressed) {
                            e.stopPropagation();
                            setSelectedBlockId(block.id);
                        }
                    }}
                    className={cn(
                        "relative group transition-all duration-200",
                        isSelected ? "ring-2 ring-green-500 z-10" : "hover:ring-1 hover:ring-green-300"
                    )}
                >
                    <VariationComponent props={block.props} blockId={block.id} />
                    {isSelected && (
                        <div className="absolute top-2 right-2 z-20 bg-green-500 text-white text-xs px-2 py-1 rounded shadow-sm">
                            {block.componentFile}
                        </div>
                    )}
                </div>
            );
        });
    };

    return (
        <div
            className="flex-1 bg-zinc-100 overflow-hidden relative h-full"
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{ cursor: isSpacePressed || isDragging ? "grab" : "default" }}
        >
            {/* Zoom Controls */}
            <div className="absolute bottom-4 right-4 z-50 flex items-center gap-2 bg-white rounded-lg shadow-md p-1 border">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setScale((s) => Math.max(s - 0.1, 0.2))}>
                    <Minus className="h-4 w-4" />
                </Button>
                <span className="text-xs font-medium w-12 text-center">{Math.round(scale * 100)}%</span>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setScale((s) => Math.min(s + 0.1, 2))}>
                    <Plus className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setScale(1); setPosition({ x: 0, y: 0 }); }}>
                    <RotateCcw className="h-4 w-4" />
                </Button>
            </div>

            {/* Device Frames */}
           <div
  ref={containerRef}
  className="min-h-full w-full flex items-start justify-center p-6 origin-top-left transition-transform duration-75 ease-out"
  style={{ transform: `translate(${position.x}px, ${position.y}px) scale(${scale})` }}
>
  <div className="grid grid-cols-3 gap-24">
    {DEVICE_FRAMES.map((device) => (
      <div key={device.name} className="flex flex-col items-center gap-1">
        <div className="text-xs font-medium text-zinc-200 bg-black px-3 py-1 rounded-full shadow-sm border">
          {device.name} ({device.width}px)
        </div>

        <div
          className="bg-white shadow-xl rounded-lg overflow-hidden flex flex-col ring-1 ring-zinc-200/50 container-support"
          style={{
            width: device.width,
            minHeight: "600px",
            transform: `scale(${device.scale})`,
            transformOrigin: "top center",
          }}
        >
          <div className="flex-1 flex flex-col">
            {blocks.length > 0 ? (
              renderBlocks()
            ) : (
              <div className="flex-1 flex items-center justify-center text-zinc-400 p-10 text-center">
                Select a template or add blocks to start
              </div>
            )}
          </div>
        </div>
      </div>
    ))}
  </div>
</div>

        </div>
    );
}
