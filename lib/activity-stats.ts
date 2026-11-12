export type ActivityJob = {
    createdAt: string; price: number; materialCost: number | null; cost: number;
    isPaid: boolean; isDone: boolean; isReturned: boolean; customerId: number;
    stringName: string | null; stringSource: string; stringReferenceId: number | null;
}

export function activityStats(jobs: ActivityJob[], year: number) {
    const selected = jobs.filter(j => new Date(j.createdAt).getUTCFullYear() === year)
    const months = Array.from({ length: 12 }, (_, month) => ({ month, volume: 0, revenue: 0 }))
    const reels = new Map<string, { name: string; volume: number; revenue: number; cost: number; unknown: number }>()
    let revenue = 0, costs = 0, unknown = 0, volume = 0, outstanding = 0, returnedUnpaid = 0
    for (const job of selected) {
        const month = months[new Date(job.createdAt).getUTCMonth()]
        const knownCost = job.materialCost ?? (job.stringSource === 'player' ? 0 : job.cost > 0 ? job.cost : null)
        const key = job.stringSource === 'player' ? 'player' : job.stringReferenceId !== null ? `ref-${job.stringReferenceId}` : `legacy-${job.stringName}`
        const reel = reels.get(key) ?? { name: job.stringSource === 'player' ? 'Bobine du joueur' : job.stringName ?? 'Cordage inconnu', volume: 0, revenue: 0, cost: 0, unknown: 0 }
        if (job.isPaid) { revenue += job.price; month.revenue += job.price; reel.revenue += job.price }
        else { outstanding += job.price; if (job.isReturned) returnedUnpaid += job.price }
        if (job.isDone) { volume++; month.volume++; reel.volume++ }
        // Materials are consumed once done; paid jobs also need their cost accounted for.
        if (job.isDone || job.isPaid) {
            if (knownCost === null) { unknown++; reel.unknown++ }
            else { costs += knownCost; reel.cost += knownCost }
        }
        reels.set(key, reel)
    }
    const paid = selected.filter(j => j.isPaid)
    return { revenue, costs, unknown, volume, outstanding, returnedUnpaid,
        margin: revenue - costs, average: paid.length ? revenue / paid.length : 0,
        customers: new Set(selected.map(j => j.customerId)).size,
        months, reels: [...reels.values()].sort((a, b) => b.volume - a.volume) }
}
