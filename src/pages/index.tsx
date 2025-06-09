import type { GetStaticProps, InferGetStaticPropsType } from 'next'

import { readToken } from '~/lib/sanity.api'

import type { SharedPageProps } from '~/pages/_app'
import dynamic from 'next/dynamic'
import Loader from '~/components/Loader'

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
  loading: () => <Loader/>
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
