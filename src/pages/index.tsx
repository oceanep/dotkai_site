import { Canvas } from '@react-three/fiber'
import { ACESFilmicToneMapping, LinearSRGBColorSpace, SRGBColorSpace } from 'three'
import type { GetStaticProps, InferGetStaticPropsType } from 'next'
import { useLiveQuery } from 'next-sanity/preview'

import { readToken } from '~/lib/sanity.api'
import { getClient } from '~/lib/sanity.client'
import { getPosts, type Post, postsQuery } from '~/lib/sanity.queries'
import type { SharedPageProps } from '~/pages/_app'
import { SceneContainer } from '~/styles/styled'
import LandingExperience from '~/components/LandingExperience'

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
  

  return (
    <SceneContainer>
      <Canvas
        shadows
        dpr={ [1, 3] }
        gl={{
          antialias: false,
          toneMapping: ACESFilmicToneMapping,
          outputColorSpace: SRGBColorSpace
        }}
        camera={{
          fov: 45,
          near: 0.1,
          far: 200,
          position: [3, 2, 6]
        }}
      >
        <LandingExperience />
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
