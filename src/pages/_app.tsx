import type { AppProps } from 'next/app'

import React, { lazy, StrictMode, useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { IBM_Plex_Mono, Inter, PT_Serif } from 'next/font/google'

import DomWrapper from '@/components/layout/DomWrapper'
import { SharedPageProps } from '@/utils/types'

import '@/styles/global.css'
import { useRouter } from 'next/router'
import Head from 'next/head'

export interface CustomNextPage {
  (props: any): JSX.Element;
  canvas?: React.ComponentType<any>;
}

interface CustomAppProps<P = any> extends AppProps {
  Component: CustomNextPage;
}

const PreviewProvider = lazy(() => import('~/components/PreviewProvider'));

const CanvasWrapper = dynamic(() => import("@/components/layout/CanvasWrapper"), {
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

export default function App({
  Component,
  pageProps,
}: CustomAppProps<SharedPageProps>) {
  const [hasPrevPage, setHasPrevPage] = useState<boolean>(false)

  const { draftMode, token } = pageProps
  const router = useRouter()
  const { pathname } = router

  const ref = useRef();

  useEffect(() => {
    const handleRouteChange = (url) => {
      setHasPrevPage(true)
    };

    router.events.on('routeChangeStart', handleRouteChange);

    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
      setHasPrevPage(false);
    };
  }, [router.events])

  return (
    <>
    <Head>
      <meta name="mobile-web-app-capable" content="yes"/>
    </Head>
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
            <div ref={ref}>
              <DomWrapper studio={pathname.includes('studio')} initialLoad={!hasPrevPage}>
                <Component {...pageProps} />
              </DomWrapper>
              {
                /**
                 * Assign canvas items to canvas property of components
                 * Check if property exist here and render conditionally
                 * This assures a persistent 3d canvas that doesn't rerender every
                 * Page load
                 */
                Component?.canvas && (
                  <CanvasWrapper eventSource={ref} initialLoad={!hasPrevPage}>
                    <Component.canvas {...pageProps} />
                  </CanvasWrapper>
                )
              }
            </div>
          </PreviewProvider>
        ) : (
          <div ref={ref}>
            <DomWrapper studio={pathname.includes('studio')} initialLoad={!hasPrevPage}>
              <Component {...pageProps} />
            </DomWrapper>
            {
              Component?.canvas && (
                <CanvasWrapper eventSource={ref} initialLoad={!hasPrevPage}>
                  <Component.canvas {...pageProps} /> 
                </CanvasWrapper>
              )
            }
          </div>
        )}
      </StrictMode>
    </>
  )
}
