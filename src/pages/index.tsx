import type { GetStaticProps, InferGetStaticPropsType } from 'next'
import { useLiveQuery } from 'next-sanity/preview'
import { Bvh } from '@react-three/drei'

import { readToken } from '~/lib/sanity.api'
import { getClient } from '~/lib/sanity.client'
import { getPosts, type Post, postsQuery } from '~/lib/sanity.queries'

import type { SharedPageProps } from '~/pages/_app'
import LandingExperience from '~/components/LandingExperience'
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

const Canvas = dynamic(() => import("@/components/layout/CanvasWrapper"), {
  ssr: false,
});

// DOM elements here
const DOM = () => {
  return <></>;
};

// Canvas/R3F components here
const R3F = () => {

  return (
      <Bvh>
        <LandingExperience />
      </Bvh>
  );
};

export default function IndexPage(
  props: InferGetStaticPropsType<typeof getStaticProps>,
) {

  return (
      <DOM/>
  )
}

IndexPage.canvas = (props) => <R3F/>;
