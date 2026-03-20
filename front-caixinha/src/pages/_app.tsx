import '../styles/global.css'
import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'

import '@/locales/i18n'
import { CaixinhaProvider } from '@/features/caixinha/context/CaixinhaContext'

export default function App({
  Component,
  pageProps: { session, ...pageProps }, }: AppProps) {
  return (
    <SessionProvider session={session}>
      <CaixinhaProvider>
        <Component {...pageProps} />
      </CaixinhaProvider>
    </SessionProvider>
  )
}
