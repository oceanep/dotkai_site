import type { GetStaticProps, InferGetStaticPropsType } from 'next'
import { useLiveQuery } from 'next-sanity/preview'
import { Bvh } from '@react-three/drei'

import { readToken } from '~/lib/sanity.api'
import { getClient } from '~/lib/sanity.client'
import { getPosts, type Post, postsQuery } from '~/lib/sanity.queries'

import type { SharedPageProps } from '~/pages/_app'
import LandingExperience from '~/components/LandingExperience'

export const getStaticProps: GetStaticProps<SharedPageProps> = async ({ draftMode = false }) => {

  return {
    props: {
      draftMode,
      token: draftMode ? readToken : '',
      title: "Landing Page"
    },
  }
}

export default function IndexPage(
  props: InferGetStaticPropsType<typeof getStaticProps>,
) {
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

  return (
    <>
      <DOM/>
      <R3F/>
    </>
  )
}
