import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs"

export function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 max-w-screen-2xl items-center justify-between px-4 md:px-8">
                <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-black" />
                    <span className="font-bold">Nexuma</span>
                </div>
                <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                    <Link href="#features" className="transition-colors hover:text-foreground/80 text-foreground/60">Features</Link>
                    <Link href="#pricing" className="transition-colors hover:text-foreground/80 text-foreground/60">Pricing</Link>
                    <Link href="#about" className="transition-colors hover:text-foreground/80 text-foreground/60">About</Link>
                    <Link href="#blog" className="transition-colors hover:text-foreground/80 text-foreground/60">Blog</Link>
                    <Link href="#contact" className="transition-colors hover:text-foreground/80 text-foreground/60">Contact</Link>
                </nav>
                <div className="flex items-center gap-2">
                    <SignedOut>
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/sign-in">Log in</Link>
                        </Button>
                        <Button size="sm" className="rounded-full" asChild>
                            <Link href="/sign-up">Get Started</Link>
                        </Button>
                    </SignedOut>
                    <SignedIn>
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/projects">Dashboard</Link>
                        </Button>
                        <UserButton />
                    </SignedIn>
                </div>
            </div>
        </header>
    )
}
