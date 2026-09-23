import type { ReactNode } from 'react'
import { Activity, ArrowLeftRight, History, UsersRound } from 'lucide-react'
import DemoNotice from './DemoNotice'
import Dock from './ui/Dock'
import type { Page } from '../types/ui'

interface AppShellProps {
  page: Page
  onNavigate: (page: Page) => void
  children: ReactNode
  isFictional: boolean
}

const dockPages: { page: Page; label: string; icon: ReactNode }[] = [
  { page: 'overview', label: 'Visão geral', icon: <Activity size={18} /> },
  { page: 'roster', label: 'Quadro atual', icon: <UsersRound size={18} /> },
  { page: 'movements', label: 'Movimentações', icon: <ArrowLeftRight size={18} /> },
  { page: 'history', label: 'Histórico', icon: <History size={18} /> },
]

export default function AppShell({ page, onNavigate, children, isFictional }: AppShellProps) {
  return <div className="app-layout">
    <div className="app-dock"><Dock
      items={dockPages.map(({ page: target, label, icon }) => ({ icon, label, className: page === target ? 'dock-item-active' : '', onClick: () => onNavigate(target) }))}
      panelHeight={68}
      baseItemSize={50}
      magnification={70}
    /></div>
    <main className="main-area">
      <header className="topbar">
        <div className="topbar-inner"><div className="topbar-brand"><span className="topbar-logo"><img src="/dafiti-logo.png" alt="Dafiti" /></span><strong className="app-name">Dashboard-BH</strong></div></div>
      </header>
      <div className="page-area">
        <DemoNotice visible={isFictional} />
        {children}
      </div>
    </main>
  </div>
}
