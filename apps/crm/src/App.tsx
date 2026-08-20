// apps/crm/src/App.tsx
import React from 'react'
import { SubAppShell } from '@/sso/SubAppShell'
import { CRM } from '@/pages/applications/CRM'

export default function App() {
  return (
    <SubAppShell appName="CRM" appColor="from-sky-500 to-blue-600">
      {() => <CRM />}
    </SubAppShell>
  )
}
