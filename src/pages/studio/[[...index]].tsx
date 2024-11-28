import Head from 'next/head'
import { NextStudio } from 'next-sanity/studio'
import { metadata } from 'next-sanity/studio/metadata'
import config from 'sanity.config'
import { useMemo } from 'react'

export default function StudioPage() {
  const DOM = () => 
    <>
      <Head>
        {Object.entries(metadata).map(([key, value]) => (
          <meta key={key} name={key} content={value} />
        ))}
      </Head>
      <NextStudio config={config} unstable_globalStyles />
    </>
  ;

  const R3F = () => <></>;

  return (
    <>
      <DOM/>
      <R3F/> 
    </>  
  )
}
