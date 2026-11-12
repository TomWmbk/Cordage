import { db } from './db'
import { RACKET_BRANDS } from './domain'

export async function getRacketBrands(userId: number) {
    const custom = await db.racketBrand.findMany({ where: { userId }, orderBy: { name: 'asc' } })
    const existing = await db.racketJob.findMany({ where: { userId }, distinct: ['racketBrand'], select: { racketBrand: true } })
    const brands = new Map<string, string>()
    for (const name of [...RACKET_BRANDS, ...custom.map(b => b.name), ...existing.map(j => j.racketBrand)]) {
        if (name !== 'Non renseignée') brands.set(name.toLocaleLowerCase('fr'), name)
    }
    return [...brands.values()].sort((a, b) => a.localeCompare(b, 'fr'))
}
