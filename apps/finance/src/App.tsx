// apps/finance/src/App.tsx
import React from 'react'
import { SubAppShell } from '@/sso/SubAppShell'
import FinanceManager from '@/pages/applications/FinanceManager'

export default function App() {
  return (
    <SubAppShell appName="Finance Manager" appColor="from-emerald-400 to-emerald-600">
      {() => <FinanceManager />}
    </SubAppShell>
  )
}
