/**
 * Utility functions for subdomain handling
 */

/**
 * Generates a URL-safe subdomain from a project name
 * Example: "My Awesome Project!" -> "my-awesome-project"
 */
export function generateSubdomain(projectName: string): string {
    return projectName
        .toLowerCase()
        .trim()
        // Replace spaces and special characters with hyphens
        .replace(/[^a-z0-9]+/g, '-')
        // Remove leading/trailing hyphens
        .replace(/^-+|-+$/g, '')
        // Limit length to 63 characters (DNS subdomain limit)
        .substring(0, 63);
}

/**
 * Validates if a subdomain is in correct format
 */
export function isValidSubdomain(subdomain: string): boolean {
    // Must be 1-63 characters
    if (subdomain.length < 1 || subdomain.length > 63) {
        return false;
    }

    // Must contain only lowercase letters, numbers, and hyphens
    // Cannot start or end with a hyphen
    const subdomainRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;
    return subdomainRegex.test(subdomain);
}

/**
 * Builds the full published URL for a subdomain
 */
export function buildPublishedUrl(subdomain: string): string {
    const baseDomain = process.env.NEXT_PUBLIC_BASE_DOMAIN || 'localhost:3000';
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';

    return `${protocol}://${subdomain}.${baseDomain}`;
}

/**
 * Extracts subdomain from a hostname
 * Example: "my-project.quickwebsites.com" -> "my-project"
 */
export function extractSubdomain(hostname: string): string | null {
    const baseDomain = process.env.NEXT_PUBLIC_BASE_DOMAIN || 'localhost:3000';

    // Remove port if present
    const hostnameWithoutPort = hostname.split(':')[0];

    // Check if hostname ends with base domain
    if (!hostnameWithoutPort.endsWith(baseDomain)) {
        return null;
    }

    // Extract subdomain part
    const subdomain = hostnameWithoutPort.replace(`.${baseDomain}`, '');

    // If subdomain is same as hostname, it means there's no subdomain
    if (subdomain === hostnameWithoutPort || subdomain === baseDomain) {
        return null;
    }

    return subdomain;
}

/**
 * Generates a unique subdomain by appending a number if needed
 */
export function generateUniqueSubdomain(
    baseSubdomain: string,
    existingSubdomains: string[]
): string {
    let subdomain = baseSubdomain;
    let counter = 1;

    while (existingSubdomains.includes(subdomain)) {
        subdomain = `${baseSubdomain}-${counter}`;
        counter++;
    }

    return subdomain;
}
