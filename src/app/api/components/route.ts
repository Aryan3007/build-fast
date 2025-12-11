import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
    try {
        const components = await prisma.component.findMany({
            orderBy: [
                { category: 'asc' },
                { name: 'asc' }
            ]
        })
        return NextResponse.json(components)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch components' }, { status: 500 })
    }
}
