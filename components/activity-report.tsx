'use client'

import { useState } from 'react'
import { activityStats, type ActivityJob } from '@/lib/activity-stats'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { ChevronDown } from 'lucide-react'

const euro = (value: number) => value.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })

export function ActivityReport({ jobs }: { jobs: ActivityJob[] }) {
    const currentYear = new Date().getFullYear()
    const [year, setYear] = useState<number | 'all'>(currentYear)
    const [metric, setMetric] = useState<'revenue' | 'volume'>('revenue')
    const years = [...new Set([currentYear, ...jobs.map(j => new Date(j.createdAt).getUTCFullYear())])].sort((a,b) => b-a)
    const annual = years.map(y => activityStats(jobs, y))
    const stats = year === 'all' ? {
        ...annual[0],
        revenue: annual.reduce((a,s)=>a+s.revenue,0),
        costs: annual.reduce((a,s)=>a+s.costs,0),
        margin: annual.reduce((a,s)=>a+s.margin,0),
        unknown: annual.reduce((a,s)=>a+s.unknown,0),
        volume: annual.reduce((a,s)=>a+s.volume,0),
        outstanding: annual.reduce((a,s)=>a+s.outstanding,0),
        returnedUnpaid: annual.reduce((a,s)=>a+s.returnedUnpaid,0),
    } : activityStats(jobs,year)
    // The chart and reel breakdown always share the selected period.
    const chart = year === 'all'
        ? years.slice().reverse().map(y=>({label:String(y),...activityStats(jobs,y)}))
        : stats.months.map(m=>({...m,label:new Date(Date.UTC(year,m.month,1)).toLocaleDateString('fr-FR',{month:'short',timeZone:'UTC'})}))
    const reels = year === 'all' ? [...annual.reduce((map,s)=>{
        for(const r of s.reels) {
            const previous=map.get(r.name)
            map.set(r.name,previous ? {name:r.name,volume:previous.volume+r.volume,revenue:previous.revenue+r.revenue,cost:previous.cost+r.cost,unknown:previous.unknown+r.unknown} : {...r})
        }
        return map
    },new Map<string, typeof stats.reels[number]>()).values()].sort((a,b)=>b.volume-a.volume) : stats.reels

    return <section className="mb-8 space-y-4">
        <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-xl font-bold uppercase">Vue d’ensemble</h2>
            <select aria-label="Période des statistiques" value={year} onChange={e=>setYear(e.target.value==='all' ? 'all' : Number(e.target.value))} className="h-9 border border-line bg-surface px-3 text-sm">
                {years.map(y=><option key={y} value={y}>{y}</option>)}<option value="all">Toutes les années</option>
            </select>
        </div>
        <div className="grid grid-cols-2 divide-x divide-line border border-line bg-surface lg:grid-cols-4">
            {[
                ['CA encaissé',euro(stats.revenue)],
                [stats.unknown ? 'Marge partielle*' : 'Marge après matière',euro(stats.margin)],
                ['Poses réalisées',stats.volume],
                ['À encaisser',euro(stats.outstanding)],
            ].map(([label,value])=><div key={label} className="px-4 py-3 sm:px-5"><p className="text-xs text-muted">{label}</p><p className="mt-1 font-display text-3xl font-bold tabular-nums">{value}</p></div>)}
        </div>
        <div className="border border-line bg-surface px-3 pt-4 sm:px-5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-sm font-semibold">{year === 'all' ? 'Évolution annuelle' : 'Évolution mensuelle'}</h3>
                <div className="flex gap-1 bg-surface-strong p-1">{([['revenue','CA (€)'],['volume','Poses']] as const).map(([key,label])=><button key={key} type="button" aria-pressed={metric===key} onClick={()=>setMetric(key)} className={`px-3 py-1 text-xs transition-colors ${metric===key ? 'bg-ink text-white dark:bg-acid dark:text-acid-ink' : 'text-muted'}`}>{label}</button>)}</div>
            </div>
            <div className="h-48 w-full sm:h-56" role="img" aria-label={`Évolution du ${metric === 'revenue' ? 'CA' : 'nombre de poses'} en ${year === 'all' ? 'toutes années' : year}`}>
                <ResponsiveContainer width="100%" height="100%" minWidth={0} initialDimension={{width:320,height:192}}>
                    <BarChart data={chart} margin={{top:8,right:4,bottom:0,left:-18}}>
                        <CartesianGrid stroke="var(--line)" strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{fill:'var(--muted)',fontSize:11}} minTickGap={12} />
                        <YAxis axisLine={false} tickLine={false} allowDecimals={metric==='revenue'} tick={{fill:'var(--muted)',fontSize:11}} />
                        <Tooltip cursor={{fill:'var(--surface-strong)'}} contentStyle={{background:'var(--surface)',border:'1px solid var(--line)',color:'var(--foreground)'}} formatter={value=>metric==='revenue' ? euro(Number(value)) : `${value} poses`} />
                        <Bar dataKey={metric} name={metric==='revenue' ? 'CA' : 'Poses'} fill="#a7cb17" maxBarSize={36} radius={[2,2,0,0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            {stats.volume===0 && stats.revenue===0 && <p className="pb-3 text-center text-xs text-muted">Aucune activité sur cette période.</p>}
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted">
            <span>Matière connue : {euro(stats.costs)}</span><span>Rendu non payé : {euro(stats.returnedUnpaid)}</span>
            {stats.unknown>0 && <span className="text-amber-700 dark:text-amber-400">* {stats.unknown} coût(s) inconnu(s)</span>}
        </div>
        <details className="group border border-line bg-surface">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-acid">
                Détail par bobine <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
            </summary>
            <div className="border-t border-line px-4 pb-4">
                <p className="py-3 text-xs text-muted">Recettes avec main-d’œuvre. Regroupement par référence de bobine.</p>
                <div className="overflow-x-auto"><table className="w-full min-w-[540px] text-left text-sm"><thead><tr>{['Bobine','Poses','Recettes','Matière','Marge'].map(h=><th className="border-b border-line px-2 py-2 font-medium text-muted" key={h}>{h}</th>)}</tr></thead><tbody>{reels.map((r,i)=><tr key={i}><td className="px-2 py-3">{r.name}</td><td className="px-2 py-3">{r.volume}</td><td className="px-2 py-3">{euro(r.revenue)}</td><td className="px-2 py-3">{euro(r.cost)}{r.unknown>0 && '*'}</td><td className="px-2 py-3 font-semibold">{euro(r.revenue-r.cost)}{r.unknown>0 && '*'}</td></tr>)}</tbody></table></div>
                {!reels.length && <p className="py-4 text-sm text-muted">Aucune pose sur cette période.</p>}
            </div>
        </details>
        <p className="text-[11px] text-muted">Période basée sur la date d’ajout des poses. Marge avant charges, impôts et temps de travail ; coûts inconnus exclus.</p>
    </section>
}
