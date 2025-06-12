import type { GetStaticProps, InferGetStaticPropsType } from 'next'

import { readToken } from '@/lib/sanity.api'

import type { SharedPageProps } from '@/utils/types'
import dynamic from 'next/dynamic'

export const getStaticProps: GetStaticProps<SharedPageProps> = async ({ draftMode = false }) => {

  return {
    props: {
      draftMode,
      token: draftMode ? readToken : '',
      title: "Landing Page"
    },
  }
}

// Canvas/R3F components here
const R3F = dynamic(() => import("@/components/LandingExperience"), {
  ssr: false,
});

// DOM elements here
const DOM = () => {
  return <></>;
};


export default function IndexPage(
  props: InferGetStaticPropsType<typeof getStaticProps>,
) {

  return (
      <DOM/>
  )
}

IndexPage.canvas = (props) => <R3F/>;
