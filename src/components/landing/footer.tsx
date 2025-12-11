interface FooterProps {
    companyName?: string
    copyright?: string
    blockId?: string
}

export function Footer({
    companyName = "Company",
    copyright = "© 2024 Company Inc. All rights reserved.",
    blockId
}: FooterProps) {
    if (blockId) {
        return (
            <footer className="bg-zinc-900 text-white py-12">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <h3 className="text-2xl font-bold mb-4">{companyName}</h3>
                        <p className="text-zinc-400">{copyright}</p>
                    </div>
                </div>
            </footer>
        )
    }

    return (
        <footer className="bg-zinc-900 text-white py-12">
            <div className="container mx-auto px-4">
                <div className="text-center">
                    <h3 className="text-2xl font-bold mb-4">{companyName}</h3>
                    <p className="text-zinc-400">{copyright}</p>
                </div>
            </div>
        </footer>
    )
}
