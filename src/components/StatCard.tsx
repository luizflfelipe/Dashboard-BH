import type { LucideIcon } from 'lucide-react'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'

interface StatCardProps {
  label: string
  value: number
  icon: LucideIcon
  tone: 'blue' | 'green' | 'amber' | 'violet' | 'red' | 'slate'
  delta?: string
  deltaDirection?: 'up' | 'down'
  detail?: string
}

export default function StatCard({ label, value, icon: Icon, tone, delta, deltaDirection = 'up', detail }: StatCardProps) {
  return <article className="stat-card">
    <div className="stat-top"><span className="stat-label">{label}</span><span className={`stat-icon stat-${tone}`}><Icon size={17} strokeWidth={1.9} /></span></div>
    <div className="stat-value">{value.toLocaleString('pt-BR')}</div>
    <div className="stat-footer">{delta ? <><span className={`stat-delta ${deltaDirection}`}>
      {deltaDirection === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}{delta}</span><span>{detail}</span></> : <span>{detail ?? 'pessoas'}</span>}</div>
  </article>
}
