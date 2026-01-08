import { Suspense } from 'react'
import DashboardClientPage from './DashboardClientPage'

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-white">Loading…</div>
      </div>
    }>
      <DashboardClientPage />
    </Suspense>
  )
}