import type { AppProps } from 'next/app'

import React, { lazy, StrictMode, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { IBM_Plex_Mono, Inter, PT_Serif } from 'next/font/google'

import '~/styles/global.css'
import Dom from '~/components/layout/DomWrapper'


export interface SharedPageProps {
  draftMode: boolean
  token: string
}

const PreviewProvider = lazy(() => import('~/components/PreviewProvider'));

const Canvas = dynamic(() => import("@/components/layout/CanvasWrapper"), {
  ssr: false,
});

const mono = IBM_Plex_Mono({
  variable: '--font-family-mono',
  subsets: ['latin'],
  weight: ['500', '700'],
})

const sans = Inter({
  variable: '--font-family-sans',
  subsets: ['latin'],
  weight: ['500', '700', '800'],
})

const serif = PT_Serif({
  variable: '--font-family-serif',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  weight: ['400', '700'],
})

const AppLayout = ({ children }) => {
  //Follow convention of declaring DOM then CANVAS on new pages
  const newChildren = React.Children.map(children, (child, index) => 
    index % 2 === 0 ? <Dom>{child}</Dom> : <Canvas>{child}</Canvas>
  );

  return newChildren
}

export default function App({
  Component,
  pageProps,
}: AppProps<SharedPageProps>) {
  const { draftMode, token } = pageProps

  // Get the children from each page so we can split them
  //@ts-ignore
  const children = Component(pageProps).props.children;

  return (
    <>
      <StrictMode>
        <style jsx global>
          {`
            :root {
              --font-family-sans: ${sans.style.fontFamily};
              --font-family-serif: ${serif.style.fontFamily};
              --font-family-mono: ${mono.style.fontFamily};
            }
          `}
        </style>
        {draftMode ? (
          <PreviewProvider token={token}>
            <AppLayout>
              {children}
            </AppLayout>
          </PreviewProvider>
        ) : (
          <AppLayout>
              {children}
            </AppLayout>
        )}
      </StrictMode>
    </>
  )
}
