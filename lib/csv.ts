type ExportJob = {
    id: number; createdAt: Date | string; racketBrand: string; racketModel: string | null;
    tension: string; stringName: string | null; stringSource: string; price: number;
    materialCost: number | null; cost: number; isDone: boolean; isPaid: boolean; isReturned: boolean;
}

export function csvCell(value: string | number | null): string {
    let text = String(value ?? '')
    if (/^[\s]*[=+@\-]/.test(text) || /^[\t\r\n]/.test(text)) text = "'" + text
    return /[;"\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text
}

export function jobsCsv(customers: {firstName: string; sport: string; jobs: ExportJob[]}[]): string {
    const rows: (string | number | null)[][] = [['ID','Date','Client','Sport','Marque','Modèle','Tension (kg)','Cordage','Provenance','Prix (€)','Coût matière (€)','Fait','Payé','Rendu']]
    for (const customer of customers) for (const job of customer.jobs) {
        const cost = job.materialCost ?? (job.stringSource === 'player' ? 0 : job.cost > 0 ? job.cost : null)
        rows.push([job.id,new Date(job.createdAt).toISOString(),customer.firstName,customer.sport,job.racketBrand,job.racketModel,job.tension,job.stringName,job.stringSource === 'player' ? 'Joueur' : 'Atelier',job.price.toFixed(2).replace('.',','),cost === null ? null : cost.toFixed(2).replace('.',','),job.isDone ? 'Oui' : 'Non',job.isPaid ? 'Oui' : 'Non',job.isReturned ? 'Oui' : 'Non'])
    }
    return '\uFEFF' + rows.map(row => row.map(csvCell).join(';')).join('\r\n')
}
