import { FlaskConical } from 'lucide-react'

export default function DemoNotice({ visible }: { visible: boolean }) {
  if (!visible) return null
  return <div className="demo-notice" role="status">
    <span className="demo-notice-icon"><FlaskConical size={15} /></span>
    <span><strong>Ambiente demonstrativo</strong><span className="demo-separator">·</span> Todos os dados exibidos são fictícios e não representam o quadro real.</span>
  </div>
}
