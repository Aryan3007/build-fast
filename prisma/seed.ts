import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    // Clear existing data
    await prisma.component.deleteMany()
    await prisma.template.deleteMany()

    // ========================================
    // COMPONENTS - Hero Variations
    // ========================================
    const heroComponents = [
        {
            name: "Hero - Modern",
            category: "hero",
            type: "Hero",
            componentFile: "HeroModern",
            description: "Modern hero with gradient background and animated elements",
            thumbnail: "/components/hero-modern.png",
            props: JSON.stringify({
                title: "The New Era AI Command Center",
                subtitle: "Plan, launch and scale — in one glass-clear dashboard for modern founders.",
                ctaText: "Get Template",
                ctaLink: "#"
            })
        },
        {
            name: "Hero - Minimal",
            category: "hero",
            type: "Hero",
            componentFile: "HeroMinimal",
            description: "Clean minimal hero design with simple typography",
            thumbnail: "/components/hero-minimal.png",
            props: JSON.stringify({
                title: "Build Better. Ship Faster.",
                subtitle: "The simplest way to create beautiful landing pages.",
                ctaText: "Start Building",
                ctaLink: "#"
            })
        },
        {
            name: "Hero - Social Learning",
            category: "hero",
            type: "Hero",
            componentFile: "HeroSocialLearning",
            description: "Social learning platform hero with yellow accent and illustration",
            thumbnail: "/components/hero-social.png",
            props: JSON.stringify({
                tagline: "A social media for learners",
                title: "Connect & learn from the experts",
                subtitle: "Grow your career fast with right mentor.",
                ctaText: "Join for free",
                ctaLink: "#",
                secondaryText: "Already joined us?",
                secondaryLinkText: "Log in",
                secondaryLink: "#",
                heroImage: "https://cdn.rareblocks.xyz/collection/celebration/images/hero/1/hero-img.png",
                logo: "https://cdn.rareblocks.xyz/collection/celebration/images/logo.svg",
                menuItems: ["Features", "Solutions", "Resources", "Pricing"],
                bgColor: "#FCF8F1",
                accentColor: "#FCD34D"
            })
        }
    ];

    // ========================================
    // COMPONENTS - Features Variations
    // ========================================
    const featureComponents = [
        {
            name: "Features - Grid",
            category: "features",
            type: "Features",
            componentFile: "FeaturesGrid",
            description: "Clean grid layout with icons",
            thumbnail: "/components/features-grid.png",
            props: JSON.stringify({
                title: "Features that matter",
                subtitle: "Everything you need to build your next great product.",
                features: [
                    { title: "Fast Performance", description: "Lightning fast load times for better user experience.", icon: "Zap" },
                    { title: "Secure by Design", description: "Bank-level security to keep your data safe.", icon: "Shield" },
                    { title: "Easy to Use", description: "Intuitive interface that anyone can master.", icon: "Sparkles" }
                ]
            })
        },
        {
            name: "Features - Cards",
            category: "features",
            type: "Features",
            componentFile: "FeaturesCards",
            description: "Card-style with gradient background",
            thumbnail: "/components/features-cards.png",
            props: JSON.stringify({
                title: "Why Choose Us",
                subtitle: "Discover the features that make us stand out from the competition.",
                features: [
                    { title: "Lightning Fast", description: "Optimized for speed and performance at every level.", icon: "Zap" },
                    { title: "Ultra Secure", description: "Enterprise-grade security protecting your data 24/7.", icon: "Shield" },
                    { title: "Delightful UX", description: "Beautiful interfaces designed for maximum productivity.", icon: "Sparkles" }
                ]
            })
        }
    ];

    // ========================================
    // COMPONENTS - Pricing Variations
    // ========================================
    const pricingComponents = [
        {
            name: "Pricing - Simple",
            category: "pricing",
            type: "Pricing",
            componentFile: "PricingSimple",
            description: "Simple responsive pricing cards",
            thumbnail: "/components/pricing-simple.png",
            props: JSON.stringify({
                title: "Simple, transparent pricing",
                subtitle: "Choose the plan that's right for you.",
                tiers: [
                    {
                        name: "Starter",
                        price: "$19",
                        features: ["5 Projects", "Basic Support", "1GB Storage"],
                    },
                    {
                        name: "Pro",
                        price: "$49",
                        features: ["Unlimited Projects", "Priority Support", "10GB Storage", "Advanced Analytics"],
                        highlighted: true,
                    },
                    {
                        name: "Enterprise",
                        price: "$99",
                        features: ["Unlimited Everything", "24/7 Support", "100GB Storage", "Custom Integration"],
                    },
                ]
            })
        }
    ];

    // ========================================
    // COMPONENTS - Navbar Variations
    // ========================================
    const navbarComponents = [
        {
            name: "Navbar - Modern",
            category: "navbar",
            type: "Navbar",
            componentFile: "NavbarModern",
            description: "Modern navbar with gradient background",
            thumbnail: "/components/navbar-modern.png",
            props: JSON.stringify({
                siteName: "YourBrand",
                menuItems: ["Features", "Pricing", "About", "Contact"],
                ctaText: "Get Started",
                ctaLink: "#"
            })
        },
        {
            name: "Navbar - Minimal",
            category: "navbar",
            type: "Navbar",
            componentFile: "NavbarMinimal",
            description: "Clean minimal navbar with border",
            thumbnail: "/components/navbar-minimal.png",
            props: JSON.stringify({
                siteName: "Brand",
                menuItems: ["Home", "About", "Services", "Contact"]
            })
        },
        {
            name: "Navbar - Transparent",
            category: "navbar",
            type: "Navbar",
            componentFile: "NavbarTransparent",
            description: "Glassmorphism navbar with backdrop blur",
            thumbnail: "/components/navbar-transparent.png",
            props: JSON.stringify({
                siteName: "Logo",
                menuItems: ["Product", "Features", "Pricing", "Blog"],
                ctaText: "Sign Up"
            })
        }
    ];

    // ========================================
    // COMPONENTS - Footer Variations
    // ========================================
    const footerComponents = [
        {
            name: "Footer - Modern",
            category: "footer",
            type: "Footer",
            componentFile: "FooterModern",
            description: "Modern dark footer with multiple columns",
            thumbnail: "/components/footer-modern.png",
            props: JSON.stringify({
                companyName: "YourCompany",
                description: "Building amazing products for the modern web.",
                columns: [
                    { title: "Product", links: ["Features", "Pricing", "Security", "Roadmap"] },
                    { title: "Company", links: ["About", "Blog", "Careers", "Press"] },
                    { title: "Resources", links: ["Documentation", "Help Center", "Community", "Contact"] }
                ]
            })
        },
        {
            name: "Footer - Minimal",
            category: "footer",
            type: "Footer",
            componentFile: "FooterMinimal",
            description: "Simple minimal footer with basic links",
            thumbnail: "/components/footer-minimal.png",
            props: JSON.stringify({
                companyName: "Company",
                links: ["Privacy", "Terms", "Contact"]
            })
        },
        {
            name: "Footer - Social",
            category: "footer",
            type: "Footer",
            componentFile: "FooterSocial",
            description: "Social-focused footer with contact information",
            thumbnail: "/components/footer-social.png",
            props: JSON.stringify({
                companyName: "BrandName",
                tagline: "Building the future, one line at a time.",
                email: "hello@company.com",
                phone: "+1 (555) 123-4567",
                address: "123 Main St, City, State 12345"
            })
        }
    ];

    // Insert all components
    const allComponents = [...heroComponents, ...featureComponents, ...pricingComponents, ...navbarComponents, ...footerComponents]

    for (const component of allComponents) {
        await prisma.component.create({
            data: component
        })
    }

    console.log(`✅ Seeded ${allComponents.length} components`)

    // ========================================
    // TEMPLATES - Using New Responsive Components
    // ========================================
    const templates = [
        {
            name: "Modern SaaS",
            description: "Modern gradient hero with feature cards and simple pricing",
            thumbnail: "/templates/modern-saas.png",
            content: JSON.stringify([
                {
                    type: "Hero",
                    componentFile: "HeroModern",
                    props: {
                        title: "The New Era AI Command Center",
                        subtitle: "Plan, launch and scale — in one glass-clear dashboard for modern founders.",
                        ctaText: "Get Started",
                        ctaLink: "#"
                    }
                },
                {
                    type: "Features",
                    componentFile: "FeaturesCards",
                    props: {
                        title: "Why Choose Us",
                        subtitle: "Discover the features that make us stand out from the competition.",
                        features: [
                            { title: "Lightning Fast", description: "Optimized for speed and performance at every level.", icon: "Zap" },
                            { title: "Ultra Secure", description: "Enterprise-grade security protecting your data 24/7.", icon: "Shield" },
                            { title: "Delightful UX", description: "Beautiful interfaces designed for maximum productivity.", icon: "Sparkles" }
                        ]
                    }
                },
                {
                    type: "Pricing",
                    componentFile: "PricingSimple",
                    props: {
                        title: "Simple, transparent pricing",
                        subtitle: "Choose the plan that's right for you.",
                        tiers: [
                            { name: "Starter", price: "$19", features: ["5 Projects", "Basic Support", "1GB Storage"] },
                            { name: "Pro", price: "$49", features: ["Unlimited Projects", "Priority Support", "10GB Storage", "Advanced Analytics"], highlighted: true },
                            { name: "Enterprise", price: "$99", features: ["Unlimited Everything", "24/7 Support", "100GB Storage", "Custom Integration"] }
                        ]
                    }
                }
            ])
        },
        {
            name: "Minimal Landing",
            description: "Clean minimal design with grid features",
            thumbnail: "/templates/minimal-landing.png",
            content: JSON.stringify([
                {
                    type: "Hero",
                    componentFile: "HeroMinimal",
                    props: {
                        title: "Build Better. Ship Faster.",
                        subtitle: "The simplest way to create beautiful landing pages.",
                        ctaText: "Start Building",
                        ctaLink: "#"
                    }
                },
                {
                    type: "Features",
                    componentFile: "FeaturesGrid",
                    props: {
                        title: "Features that matter",
                        subtitle: "Everything you need to build your next great product.",
                        features: [
                            { title: "Fast Performance", description: "Lightning fast load times for better user experience.", icon: "Zap" },
                            { title: "Secure by Design", description: "Bank-level security to keep your data safe.", icon: "Shield" },
                            { title: "Easy to Use", description: "Intuitive interface that anyone can master.", icon: "Sparkles" }
                        ]
                    }
                }
            ])
        },
        {
            name: "Social Learning Platform",
            description: "Warm design perfect for education and community platforms",
            thumbnail: "/templates/social-learning.png",
            content: JSON.stringify([
                {
                    type: "Hero",
                    componentFile: "HeroSocialLearning",
                    props: {
                        tagline: "A social media for learners",
                        title: "Connect & learn from the experts",
                        subtitle: "Grow your career fast with right mentor.",
                        ctaText: "Join for free",
                        ctaLink: "#",
                        secondaryText: "Already joined us?",
                        secondaryLinkText: "Log in",
                        secondaryLink: "#",
                        heroImage: "https://cdn.rareblocks.xyz/collection/celebration/images/hero/1/hero-img.png",
                        bgColor: "#FCF8F1",
                        accentColor: "#FCD34D"
                    }
                },
                {
                    type: "Features",
                    componentFile: "FeaturesCards",
                    props: {
                        title: "Learn Better Together",
                        subtitle: "Everything you need to succeed in your learning journey.",
                        features: [
                            { title: "Expert Mentors", description: "Learn from industry professionals with real-world experience.", icon: "Zap" },
                            { title: "Community Support", description: "Join a vibrant community of learners helping each other.", icon: "Shield" },
                            { title: "Track Progress", description: "Monitor your growth with detailed analytics and insights.", icon: "Sparkles" }
                        ]
                    }
                }
            ])
        }
    ];

    for (const template of templates) {
        await prisma.template.create({
            data: template
        })
    }

    console.log(`✅ Seeded ${templates.length} templates`)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
