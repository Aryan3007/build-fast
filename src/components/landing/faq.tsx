import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

interface FAQItem {
    question: string
    answer: string
}

interface FAQProps {
    title?: string
    subtitle?: string
    items?: FAQItem[]
    blockId?: string
}

export function FAQ({
    title = "Frequently Asked Questions",
    subtitle = "Everything you need to know",
    items = [
        { question: "How does it work?", answer: "It's simple! Just sign up and get started." },
        { question: "Is it free?", answer: "Yes, we have a free plan." },
        { question: "Can I upgrade later?", answer: "Yes, you can upgrade anytime." }
    ],
    blockId
}: FAQProps) {
    if (blockId) {
        return (
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4 max-w-3xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-zinc-900">{title}</h2>
                        <p className="mt-2 text-lg text-zinc-600">{subtitle}</p>
                    </div>
                    <Accordion type="single" collapsible className="w-full">
                        {items.map((item, index) => (
                            <AccordionItem key={index} value={`item-${index}`}>
                                <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                                <AccordionContent>{item.answer}</AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </section>
        )
    }

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4 max-w-3xl">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-zinc-900">{title}</h2>
                    <p className="mt-2 text-lg text-zinc-600">{subtitle}</p>
                </div>
                <Accordion type="single" collapsible className="w-full">
                    {items.map((item, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                            <AccordionContent>{item.answer}</AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    )
}
