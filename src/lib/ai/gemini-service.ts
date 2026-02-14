import { GoogleGenerativeAI } from "@google/generative-ai";
import { Block } from "@/components/builder/builder-context";

if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not defined in environment variables");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export type EditType = "structure" | "content" | "rewrite" | "theme";

// Sitemap generation types
export interface SitemapSection {
    type: string;
    title: string;
    variant?: string;
    description?: string;
}

export interface SitemapPage {
    name: string;
    slug: string;
    sections: SitemapSection[];
}

export interface SitemapStructure {
    pages: SitemapPage[];
}


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

/**
 * Generate sitemap structure using AI based on company description
 */
export async function generateSitemap(
    description: string,
    pageCount: number,
    language: string = "en"
): Promise<{ success: boolean; sitemap?: SitemapStructure; error?: string }> {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `Generate a website sitemap structure for the following company/project:

Description: ${description}
Number of pages: ${pageCount}
Language: ${language}

Create a professional website structure with ${pageCount} pages. Each page should have appropriate sections using these component types:
- Navbar (variants: NavbarModern, NavbarMinimal, NavbarTransparent)
- Hero (variants: HeroSocialLearning, HeroModern, HeroMinimal)
- Features (variants: FeaturesCards, FeaturesGrid)
- Pricing (variant: PricingSimple)
- Footer (variants: FooterModern, FooterMinimal, FooterSocial)

Guidelines:
1. First page should always be "Home" with slug "home"
2. Common pages: About, Services, Pricing, Blog, Contact, etc.
3. Each page should have 3-6 sections
4. All pages should have Navbar at top and Footer at bottom
5. Suggest appropriate component variants for each section
6. Make section titles relevant to the company description

Return ONLY valid JSON in this exact format:
{
  "pages": [
    {
      "name": "Home",
      "slug": "home",
      "sections": [
        { "type": "Navbar", "title": "Main Navigation", "variant": "NavbarModern" },
        { "type": "Hero", "title": "Hero Section", "variant": "HeroModern", "description": "Main hero showcasing the product" },
        { "type": "Features", "title": "Key Features", "variant": "FeaturesCards", "description": "Highlight main features" },
        { "type": "Footer", "title": "Footer", "variant": "FooterModern" }
      ]
    }
  ]
}

Return ONLY the JSON, no markdown, no explanation.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Parse the AI response
        const sitemap = parseSitemapResponse(text);

        if (!sitemap) {
            return {
                success: false,
                error: "AI response was not in the expected format",
            };
        }

        return {
            success: true,
            sitemap,
        };
    } catch (error) {
        console.error("Sitemap generation error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error occurred",
        };
    }
}

/**
 * Parse AI response to extract sitemap structure
 */
function parseSitemapResponse(text: string): SitemapStructure | null {
    try {
        // Remove markdown code blocks if present
        let cleaned = text.trim();
        cleaned = cleaned.replace(/^```json\s*/i, "");
        cleaned = cleaned.replace(/^```\s*/i, "");
        cleaned = cleaned.replace(/```\s*$/i, "");

        const parsed = JSON.parse(cleaned);

        // Validate structure
        if (!parsed.pages || !Array.isArray(parsed.pages)) {
            return null;
        }

        return parsed as SitemapStructure;
    } catch (error) {
        console.error("Failed to parse sitemap response:", error);
        return null;
    }
}

/**
 * Edit a single component using AI with context from other components
 */
export async function editSingleComponent(
    component: Block,
    prompt: string,
    context: Block[] = []
): Promise<{ success: boolean; component?: Block; error?: string }> {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const systemPrompt = `You are an expert web designer and content writer. Your task is to modify a single website component based on the user's request.

IMPORTANT RULES:
1. Return ONLY a valid JSON object representing the updated component
2. Maintain the component's structure and type
3. Only modify the properties (props) that are relevant to the user's request
4. Keep the component ID and type unchanged
5. Ensure all text is professional and well-written
6. No markdown formatting, no explanations, just the JSON object`;

        let contextInfo = "";
        if (context.length > 0) {
            contextInfo = `\n\nOther components on the page for context:\n${JSON.stringify(context.map(c => ({ type: c.type, props: c.props })), null, 2)}`;
        }

        const fullPrompt = `${systemPrompt}

Current component to edit:
\`\`\`json
${JSON.stringify(component, null, 2)}
\`\`\`
${contextInfo}

User Request: ${prompt}

Return ONLY the updated component as a JSON object with this structure:
{
  "id": "${component.id}",
  "type": "${component.type}",
  "componentFile": "${component.componentFile || component.type}",
  "props": { ...updated props... }
}`;

        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const text = response.text();

        // Parse the AI response
        const updatedComponent = parseComponentResponse(text);

        if (!updatedComponent) {
            return {
                success: false,
                error: "AI response was not in the expected format",
            };
        }

        // Ensure ID and type are preserved
        updatedComponent.id = component.id;
        updatedComponent.type = component.type;
        if (!updatedComponent.componentFile) {
            updatedComponent.componentFile = component.componentFile;
        }

        return {
            success: true,
            component: updatedComponent,
        };
    } catch (error) {
        console.error("Single component edit error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error occurred",
        };
    }
}

/**
 * Parse AI response to extract component
 */
function parseComponentResponse(text: string): Block | null {
    try {
        // Remove markdown code blocks if present
        let cleaned = text.trim();
        cleaned = cleaned.replace(/^```json\s*/i, "");
        cleaned = cleaned.replace(/^```\s*/i, "");
        cleaned = cleaned.replace(/```\s*$/i, "");

        const parsed = JSON.parse(cleaned);

        // Validate structure
        if (!parsed.id || !parsed.type || !parsed.props) {
            return null;
        }

        return parsed as Block;
    } catch (error) {
        console.error("Failed to parse component response:", error);
        return null;
    }
}

/**
 * Generate content for a new component based on project context
 */
export async function generateComponentContent(
    variant: string,
    projectDescription: string,
    existingComponents: Block[] = []
): Promise<{ success: boolean; props?: Record<string, any>; error?: string }> {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const componentType = variant.replace(/Modern|Minimal|Cards|Grid|Simple|Social|Transparent/g, '').trim() || variant;

        const systemPrompt = `You are an expert web content writer. Generate professional, engaging content for a ${variant} component.

PROJECT CONTEXT (CRITICAL):
"${projectDescription}"

IMPORTANT RULES:
1. Return ONLY a valid JSON object with component props
2. ALL content MUST be directly relevant to the project description above
3. Use specific terminology from the project description
4. Match the industry, tone, and style of the project
5. Keep content concise and professional
6. Use realistic, specific content (not generic placeholders)
7. No markdown formatting, no explanations, just the JSON object`;

        let contextInfo = "";
        if (existingComponents.length > 0) {
            contextInfo = `\n\nExisting components for context:\n${JSON.stringify(existingComponents.slice(0, 3).map(c => ({ type: c.type, title: c.props?.title })), null, 2)}`;
        }

        const componentGuidelines: Record<string, string> = {
            Hero: `{
  "title": "Main headline (5-8 words)",
  "subtitle": "Supporting text (10-15 words)",
  "ctaText": "Call to action button text",
  "ctaLink": "#",
  "secondaryCtaText": "Secondary button text (optional)",
  "secondaryCtaLink": "#"
}`,
            Features: `{
  "title": "Features section title",
  "subtitle": "Brief description",
  "features": [
    { "title": "Feature 1", "description": "Brief description", "icon": "check" },
    { "title": "Feature 2", "description": "Brief description", "icon": "star" },
    { "title": "Feature 3", "description": "Brief description", "icon": "zap" }
  ]
}`,
            Pricing: `{
  "title": "Pricing section title",
  "subtitle": "Brief description",
  "plans": [
    { "name": "Basic", "price": "$29", "period": "/month", "features": ["Feature 1", "Feature 2"], "cta": "Get Started" },
    { "name": "Pro", "price": "$99", "period": "/month", "features": ["Feature 1", "Feature 2", "Feature 3"], "cta": "Get Started", "highlighted": true }
  ]
}`,
            Navbar: `{
  "logo": "Company Name",
  "links": [
    { "label": "Home", "href": "#" },
    { "label": "About", "href": "#about" },
    { "label": "Services", "href": "#services" },
    { "label": "Contact", "href": "#contact" }
  ],
  "ctaText": "Get Started",
  "ctaLink": "#"
}`,
            Footer: `{
  "companyName": "Company Name",
  "description": "Brief company description",
  "links": [
    { "label": "About", "href": "#" },
    { "label": "Services", "href": "#" },
    { "label": "Contact", "href": "#" }
  ],
  "socialLinks": [
    { "platform": "twitter", "href": "#" },
    { "platform": "linkedin", "href": "#" }
  ]
}`
        };

        const guideline = componentGuidelines[componentType] || `{ "title": "Section title", "description": "Section description" }`;

        const fullPrompt = `${systemPrompt}

Project Description: "${projectDescription}"
Component Type: ${variant}
${contextInfo}

Generate content following this structure:
${guideline}

CRITICAL: Make ALL content specific to the project: "${projectDescription}". 
Use keywords and concepts from the project description.
Return ONLY the JSON object.`;

        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const text = response.text();

        // Parse the AI response
        const props = parsePropsResponse(text);

        if (!props) {
            return {
                success: false,
                error: "AI response was not in the expected format",
            };
        }

        return {
            success: true,
            props,
        };
    } catch (error) {
        console.error("Generate component content error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error occurred",
        };
    }
}

/**
 * Parse AI response to extract props
 */
function parsePropsResponse(text: string): Record<string, any> | null {
    try {
        // Remove markdown code blocks if present
        let cleaned = text.trim();
        cleaned = cleaned.replace(/^```json\s*/i, "");
        cleaned = cleaned.replace(/^```\s*/i, "");
        cleaned = cleaned.replace(/```\s*$/i, "");

        const parsed = JSON.parse(cleaned);
        return parsed;
    } catch (error) {
        console.error("Failed to parse props response:", error);
        return null;
    }
}

/**
 * Rewrite text using AI
 */
export async function rewriteTextWithAI(
    text: string,
    rewriteType: string,
    context: string
): Promise<{ success: boolean; text?: string; error?: string }> {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `You are an expert copywriter and editor. Your task is to rewrite the following text based on the request.

Original Text: "${text}"
Rewrite Request: ${rewriteType}
Project Context: "${context}"

Rules:
1. Return ONLY the rewritten text.
2. Do not add quotes around the text unless they are part of the content.
3. Do not add "Here is the rewritten text" or explain your changes.
4. Keep the length similar to the original unless asked to shorten/expand.
5. Ensure the tone matches the context.
`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        // Clean up any accidental wrapping quotes if the model adds them despite instructions
        let rewrittenText = response.text().trim();
        if (rewrittenText.startsWith('"') && rewrittenText.endsWith('"') && text.length > 2 && !text.startsWith('"')) {
            rewrittenText = rewrittenText.slice(1, -1);
        }

        return {
            success: true,
            text: rewrittenText
        };
    } catch (error) {
        console.error("Text rewrite error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error"
        };
    }
}
