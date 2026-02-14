
import React from 'react';

/**
 * Generates a unique CSS selector for an element relative to a root element
 */
export function generateUniqueSelector(element: HTMLElement, root: HTMLElement): string {
    if (element === root) return '';

    const path: string[] = [];
    let current = element;

    while (current && current !== root) {
        let selector = current.tagName.toLowerCase();

        // Add specific classes if they exist and are relevant (optional, but helps specificity)
        // Ignoring generic utility classes might be better, but let's stick to simple nth-child for stability

        const parent = current.parentElement;
        if (parent) {
            const siblings = Array.from(parent.children).filter(c => c.tagName === current.tagName);
            if (siblings.length > 1) {
                const index = Array.from(parent.children).indexOf(current) + 1;
                selector += `:nth-child(${index})`;
            }
        }

        path.unshift(selector);
        current = current.parentElement as HTMLElement;
    }

    return path.join(' > ');
}

/**
 * Converts a React CSSProperties object to a CSS string
 */
export function styleObjectToCssString(styles: React.CSSProperties): string {
    return Object.entries(styles)
        .map(([key, value]) => {
            const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
            // Handle numeric values that might need units, simplistic for now
            return `${cssKey}: ${value};`;
        })
        .join(' ');
}

/**
 * Generates the full <style> content for a block
 */
export function generateBlockCss(blockId: string, styles: Record<string, React.CSSProperties> = {}): string {
    return Object.entries(styles)
        .map(([selector, rules]) => {
            const cssRules = styleObjectToCssString(rules);
            // Scope to the block ID
            // If selector is empty/root, apply to block wrapper? No, styles usually for children
            if (!selector) return `.${blockId} { ${cssRules} }`;
            return `.${blockId} ${selector} { ${cssRules} }`;
        })
        .join('\n');
}
