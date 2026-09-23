interface DistributionBarsProps {
  title: string
  subtitle: string
  entries: Array<{ label: string; count: number }>
  color: 'blue' | 'violet'
}

export default function DistributionBars({ title, subtitle, entries, color }: DistributionBarsProps) {
  const max = Math.max(...entries.map((entry) => entry.count), 1)
  return <article className="panel distribution-bars-panel">
    <div className="panel-header"><div><h2>{title}</h2><p>{subtitle}</p></div><span className="distribution-total">{entries.reduce((sum, item) => sum + item.count, 0)} <span>pessoas</span></span></div>
    <div className="distribution-bars">{entries.map((entry) => <div className="distribution-bar-row" key={entry.label}>
      <div className="distribution-bar-copy"><span>{entry.label}</span><strong>{entry.count}</strong></div>
      <div className="distribution-bar-track"><span className={`distribution-bar-fill distribution-${color}`} style={{ width: `${entry.count / max * 100}%` }} /></div>
    </div>)}</div>
  </article>
}
