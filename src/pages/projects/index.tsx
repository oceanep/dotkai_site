import type { GetStaticProps, InferGetStaticPropsType } from 'next'
import { useLiveQuery } from 'next-sanity/preview'
import { Bvh } from '@react-three/drei'

import { readToken } from '~/lib/sanity.api'
import { getClient } from '~/lib/sanity.client'
import { getPosts, type Post, postsQuery } from '~/lib/sanity.queries'

import type { SharedPageProps } from '~/pages/_app'
import LandingExperience from '~/components/LandingExperience'
import ComputerMesh from '~/components/ComputerMesh'
import Box from '~/components/Box'
import { useCallback } from 'react'
import CustomObject from '~/components/CustomObject'

export const getStaticProps: GetStaticProps<
  SharedPageProps & {
    posts: Post[]
  }
> = async ({ draftMode = false }) => {
  const client = getClient(draftMode ? { token: readToken } : undefined)
  const posts = await getPosts(client)

  return {
    props: {
      draftMode,
      token: draftMode ? readToken : '',
      posts,
      title: 'Projects'
    },
  }
}

export default function IndexPage(
  props: InferGetStaticPropsType<typeof getStaticProps>,
) {
    const [posts] = useLiveQuery<Post[]>(props.posts, postsQuery)

    // DOM elements here
    const DOM = () => {
    return <></>;
    };
    // Canvas/R3F components here
    const R3F = useCallback((posts) => {
        return (
            <Bvh>
                {posts.length ? (
                    posts.map((post) => <ComputerMesh />)
                ) : (
                    <ComputerMesh />
                )}
            </Bvh>
        );
    }, [posts]);

  return (
    <>
      <DOM/>
      <R3F/>
    </>
  )
}
