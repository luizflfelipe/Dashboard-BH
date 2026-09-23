import { useEffect, useState } from 'react'
import { AlertCircle, LoaderCircle, RefreshCw } from 'lucide-react'
import AppShell from './components/AppShell'
import OverviewPage from './pages/OverviewPage'
import RosterPage from './pages/RosterPage'
import MovementsPage from './pages/MovementsPage'
import HistoryPage from './pages/HistoryPage'
import { peopleRepository } from './data/peopleRepository'
import type { DashboardData } from './types/people'
import type { Page } from './types/ui'

const routePages: Record<string, Page> = {
  '#overview': 'overview', '#roster': 'roster', '#movements': 'movements', '#history': 'history',
}
const pageRoutes: Record<Page, string> = {
  overview: '#overview', roster: '#roster', movements: '#movements', history: '#history',
}

function getInitialPage(): Page {
  return routePages[window.location.hash] ?? 'overview'
}

export default function App() {
  const [page, setPage] = useState<Page>(getInitialPage)
  const [data, setData] = useState<DashboardData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [retryKey, setRetryKey] = useState(0)

  useEffect(() => {
    let mounted = true
    setError(null)
    peopleRepository.getDashboardData().then((result) => {
      if (mounted) setData(result)
    }).catch((reason: unknown) => {
      if (mounted) setError(reason instanceof Error ? reason.message : 'Não foi possível carregar os dados.')
    })
    return () => { mounted = false }
  }, [retryKey])

  useEffect(() => {
    const onHashChange = () => setPage(routePages[window.location.hash] ?? 'overview')
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const navigate = (next: Page) => {
    setPage(next)
    if (window.location.hash !== pageRoutes[next]) window.location.hash = pageRoutes[next]
  }

  const content = !data && !error ? <div className="state-card loading-state"><LoaderCircle size={22} className="spin" /><strong>Carregando dados</strong><span>Preparando a visão de pessoas...</span></div>
    : error ? <div className="state-card error-state"><span className="state-icon"><AlertCircle size={21} /></span><strong>Não foi possível carregar os dados</strong><span>{error}</span><button className="outline-button" onClick={() => setRetryKey((value) => value + 1)}><RefreshCw size={15} /> Tentar novamente</button></div>
      : data ? page === 'overview' ? <OverviewPage data={data} /> : page === 'roster' ? <RosterPage employees={data.employees} /> : page === 'movements' ? <MovementsPage data={data} /> : <HistoryPage history={data.history} /> : null

  return <AppShell page={page} onNavigate={navigate} isFictional={data?.isFictional ?? false}>
    {content}
  </AppShell>
}
