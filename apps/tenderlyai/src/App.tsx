// apps/tenderlyai/src/App.tsx
import React from 'react'
import { SubAppShell } from '@/sso/SubAppShell'
import { TenderlyAI } from '@/pages/applications/TenderlyAI'

export default function App() {
  return (
    <SubAppShell appName="TenderlyAI" appColor="from-violet-500 to-fuchsia-600">
      {() => <TenderlyAI />}
    </SubAppShell>
  )
}
