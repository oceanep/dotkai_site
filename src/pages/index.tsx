import { DragControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import type { GetStaticProps, InferGetStaticPropsType } from 'next'
import { useLiveQuery } from 'next-sanity/preview'
import { useState } from 'react'
import Box from '~/components/Box'

import Card from '~/components/Card'
import Container from '~/components/Container'
import Floor from '~/components/Floor'
import LightBulb from '~/components/LightBulb'
import Controls from '~/components/OrbitControls'
import Welcome from '~/components/Welcome'
import { readToken } from '~/lib/sanity.api'
import { getClient } from '~/lib/sanity.client'
import { getPosts, type Post, postsQuery } from '~/lib/sanity.queries'
import type { SharedPageProps } from '~/pages/_app'
import { SceneContainer } from '~/styles/styled'

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
    },
  }
}

export default function IndexPage(
  props: InferGetStaticPropsType<typeof getStaticProps>,
) {
  const [posts] = useLiveQuery<Post[]>(props.posts, postsQuery)
  const [orbActive, setOrbActive] = useState<boolean>(true);
  return (
    <SceneContainer>
      <Canvas
        shadows
        camera={{
          position: [-6, 7, 7]
        }}
      >
        <ambientLight color={"white"} intensity={0.3} />
        <LightBulb position={[0, 3, 0]} />
        <DragControls
          onDragStart={() => setOrbActive(false)}
          onDragEnd={() => setOrbActive(true)}
        >
          <Box rotateX={3} rotateY={0.2} />
        </DragControls>
        <Controls
          active={orbActive}
        />
        <Floor position={[0, -1, 0]}/>
      </Canvas>
    </SceneContainer>
    // <Container>
    //   <section>
    //     {posts.length ? (
    //       posts.map((post) => <Card key={post._id} post={post} />)
    //     ) : (
    //       <Welcome />
    //     )}
    //   </section>
    // </Container>
  )
}
