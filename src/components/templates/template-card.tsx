import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, ArrowRight } from "lucide-react"

interface TemplateCardProps {
    id: string
    name: string
    description: string
    thumbnail?: string | null
}

export function TemplateCard({ id, name, description, thumbnail }: TemplateCardProps) {
    return (
        <Card className="overflow-hidden flex flex-col h-full transition-all hover:shadow-md">
            <div className="aspect-video w-full bg-zinc-100 relative overflow-hidden group">
                {thumbnail ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={thumbnail} alt={name} className="object-cover w-full h-full transition-transform group-hover:scale-105" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-400 bg-zinc-50">
                        No Thumbnail
                    </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button variant="secondary" size="sm" asChild>
                        <Link href={`/preview/${id}`} target="_blank">
                            <Eye className="w-4 h-4 mr-2" /> Preview
                        </Link>
                    </Button>
                </div>
            </div>
            <CardHeader>
                <CardTitle className="text-lg">{name}</CardTitle>
                <CardDescription className="line-clamp-2">{description}</CardDescription>
            </CardHeader>
            <CardFooter className="mt-auto pt-0">
                <Button className="w-full" asChild>
                    <Link href={`/templates/${id}`}>
                        Use Template <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    )
}
