import { Activity, ArrowLeftRight, LayoutDashboard, UsersRound, Menu, X } from 'lucide-react'
import type { Page } from '../types/ui'

const items = [
  { id: 'overview', label: 'Visão geral', icon: LayoutDashboard },
  { id: 'roster', label: 'Quadro atual', icon: UsersRound },
  { id: 'movements', label: 'Movimentações', icon: ArrowLeftRight },
  { id: 'history', label: 'Histórico', icon: Activity },
] as const

interface SidebarProps {
  page: Page
  onNavigate: (page: Page) => void
  mobileOpen: boolean
  onToggleMobile: () => void
}

export default function Sidebar({ page, onNavigate, mobileOpen, onToggleMobile }: SidebarProps) {
  return <>
    <button className="mobile-menu" onClick={onToggleMobile} aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}>
      {mobileOpen ? <X size={19} /> : <Menu size={19} />}
    </button>
    {mobileOpen && <button className="mobile-scrim" aria-label="Fechar menu" onClick={onToggleMobile} />}
    <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
      <a className="brand" href="#overview" onClick={() => onNavigate('overview')}>
        <span className="brand-mark"><Activity size={19} strokeWidth={2.5} /></span>
        <span className="brand-copy"><strong>pessoas<span>.</span></strong><small>PEOPLE ANALYTICS</small></span>
      </a>
      <div className="workspace-label">ESPAÇO DE TRABALHO</div>
      <nav className="side-nav" aria-label="Navegação principal">
        {items.map(({ id, label, icon: Icon }) => <button
          className={`nav-item ${page === id ? 'nav-item-active' : ''}`} key={id}
          onClick={() => { onNavigate(id); onToggleMobile() }} aria-current={page === id ? 'page' : undefined}>
          <Icon size={18} strokeWidth={1.8} /><span>{label}</span>
        </button>)}
      </nav>
      <div className="sidebar-bottom">
        <div className="workspace-avatar">BH</div>
        <div className="workspace-person"><strong>Operação Brasil</strong><span>Ambiente demonstrativo</span></div>
        <span className="online-dot" aria-label="Ambiente disponível" />
      </div>
    </aside>
  </>
}
