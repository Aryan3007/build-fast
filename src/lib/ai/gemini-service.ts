import { GoogleGenerativeAI } from "@google/generative-ai";
import { Block } from "@/components/builder/builder-context";

if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not defined in environment variables");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export type EditType = "structure" | "content" | "rewrite" | "theme";

/**
 * Main function to edit template using AI
 */
export async function editTemplateWithAI(
    blocks: Block[],
    prompt: string,
    editType: EditType,
    targetBlockId?: string,
    editSelectedOnly?: boolean
): Promise<{ success: boolean; blocks?: Block[]; error?: string }> {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const systemPrompt = getSystemPrompt(editType);
        const contextPrompt = buildContextPrompt(blocks, targetBlockId, editType, editSelectedOnly);
        const fullPrompt = `${systemPrompt}\n\n${contextPrompt}\n\nUser Request: ${prompt}\n\nReturn ONLY a valid JSON array of blocks with your modifications. No markdown, no explanation, just the JSON array.`;

        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const text = response.text();

        // Parse the AI response
        const updatedBlocks = parseAIResponse(text);

        if (!updatedBlocks || !Array.isArray(updatedBlocks)) {
            return {
                success: false,
                error: "AI response was not in the expected format",
            };
        }

        return {
            success: true,
            blocks: updatedBlocks,
        };
    } catch (error) {
        console.error("AI editing error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error occurred",
        };
    }
}

/**
 * Get system prompt based on edit type
 */
function getSystemPrompt(editType: EditType): string {
    const basePrompt = `You are an expert web template editor. You modify landing page templates by editing blocks/components.

Each block has this structure:
{
  "id": "unique-id",
  "type": "component-type",
  "componentFile": "ComponentFileName",
  "props": { key-value pairs of component properties },
  "styles": { optional styling overrides }
}

Component types available: Hero, Features, Pricing, Navbar, Footer

CRITICAL RULES:
1. NEVER change block IDs
2. NEVER change componentFile names
3. Keep all blocks unless explicitly asked to remove them
4. Maintain valid JSON structure
5. Return ONLY the JSON array, no markdown formatting, no explanation`;

    switch (editType) {
        case "structure":
            return `${basePrompt}

STRUCTURE EDITING:
- You can reorder blocks
- You can modify component layouts within props
- You can add/remove sections within components
- Preserve existing content unless changes are needed`;

        case "content":
            return `${basePrompt}

CONTENT EDITING:
- Modify text in props (title, subtitle, description, etc.)
- Update all relevant blocks to match the new content theme
- Keep formatting and structure intact
- Ensure consistency across all components`;

        case "rewrite":
            return `${basePrompt}

SECTION REWRITING:
- Focus on the specified block only
- Completely rewrite the content while maintaining structure
- Keep the same props keys but update values
- Make content professional and engaging`;

        case "theme":
            return `${basePrompt}

THEME/COLOR CHANGES:
Components use Tailwind CSS classes in their className strings within props.

IMPORTANT: You MUST find and modify Tailwind color classes throughout the component props.

Common className props that contain colors:
- className strings with: bg-*, text-*, border-*, from-*, to-*, ring-*, divide-*

Examples of color class patterns:
- Backgrounds: "bg-blue-500", "bg-gradient-to-r from-purple-500 to-blue-500"
- Text: "text-white", "text-gray-900", "text-blue-600"
- Buttons: "bg-blue-600 hover:bg-blue-700"
- Borders: "border-blue-200"

CRITICAL STEPS:
1. Search ALL props for any string values
2. Look for className properties containing Tailwind classes
3. Find color classes (bg-*, text-*, border-*, from-*, to-*)
4. Replace color names (blue → purple, green → blue, etc.)
5. Keep intensity numbers the same (500, 600, 700)
6. Maintain hover states with new colors

Example transformation for "Use blue and purple theme":
Before: "className": "bg-green-500 hover:bg-green-700 text-white"
After:  "className": "bg-blue-500 hover:bg-blue-700 text-white"

Before: "className": "from-red-500 to-orange-500"  
After:  "className": "from-blue-500 to-purple-500"

ALSO check for style props like bgColor and accentColor:
- "bgColor": "#ff0000" → update hex color
- "accentColor": "#00ff00" → update hex color`;

        default:
            return basePrompt;
    }
}

/**
 * Build context prompt with current blocks
 */
function buildContextPrompt(
    blocks: Block[],
    targetBlockId: string | undefined,
    editType: EditType,
    editSelectedOnly?: boolean
): string {
    let context = "";

    if (editSelectedOnly && targetBlockId) {
        // Single component edit with full context
        const targetBlock = blocks.find((b) => b.id === targetBlockId);
        const targetIndex = blocks.findIndex((b) => b.id === targetBlockId);

        if (targetBlock) {
            context += "Full template for context (DO NOT MODIFY THESE):\n```json\n";
            context += JSON.stringify(blocks, null, 2);
            context += "\n```\n\n";
            context += `TARGET BLOCK TO MODIFY (block #${targetIndex + 1}):\n\`\`\`json\n`;
            context += JSON.stringify([targetBlock], null, 2);
            context += "\n```\n\n";
            context += `IMPORTANT: Modify ONLY the target block above (block #${targetIndex + 1}). You can reference other blocks in the template for context (e.g., "match colors from block #1"), but return ONLY the modified target block in an array. Do not modify any other blocks.`;
        } else {
            // Fallback if block not found
            context += "Current template blocks:\n```json\n";
            context += JSON.stringify(blocks, null, 2);
            context += "\n```";
        }
    } else {
        // Multi-component edit or legacy rewrite mode
        context += "Current template blocks:\n```json\n";
        context += JSON.stringify(blocks, null, 2);
        context += "\n```";
    }

    return context;
}

/**
 * Parse AI response to extract blocks
 */
function parseAIResponse(text: string): Block[] | null {
    try {
        // Remove markdown code blocks if present
        let cleaned = text.trim();
        cleaned = cleaned.replace(/^```json\s*/i, "");
        cleaned = cleaned.replace(/^```\s*/i, "");
        cleaned = cleaned.replace(/\s*```$/i, "");
        cleaned = cleaned.trim();

        // Parse JSON
        const parsed = JSON.parse(cleaned);

        // If it's a single block, wrap in array
        if (parsed && !Array.isArray(parsed) && parsed.id) {
            return [parsed];
        }

        return Array.isArray(parsed) ? parsed : null;
    } catch (error) {
        console.error("Failed to parse AI response:", error);
        console.error("Raw response:", text);
        return null;
    }
}
