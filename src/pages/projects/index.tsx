import type { GetStaticProps, InferGetStaticPropsType } from 'next'
import Image from 'next/image'

import { useLiveQuery } from 'next-sanity/preview'
import {getImageDimensions} from '@sanity/asset-utils'

import { Bvh, Html, Plane, useTexture } from '@react-three/drei'

import { readToken } from '~/lib/sanity.api'
import { getClient } from '~/lib/sanity.client'
import { getProjects, type Project, projectsQuery } from '~/lib/sanity.queries'

import type { SharedPageProps } from '~/pages/_app'
import ComputerMesh from '~/components/ComputerMesh'
import { Box, Flex } from '@react-three/flex'
import { useThree } from '@react-three/fiber'
import styles from './index.module.scss'
import { urlForImage } from '~/lib/sanity.image'
import { Texture } from 'three'
import { PortableText } from '@portabletext/react'
import { customMarks } from '~/components/portableText/CustomMarks'
import { Suspense } from 'react'

export const getStaticProps: GetStaticProps<
  SharedPageProps & {
    projects: Project[]
  }
> = async ({ draftMode = false }) => {
  const client = getClient(draftMode ? { token: readToken } : undefined)
  const projects = await getProjects(client)

  return {
    props: {
      draftMode,
      token: draftMode ? readToken : '',
      projects,
      title: 'Projects'
    },
  }
}

// DOM elements here
const DOM = () => {
    return <></>;
};
// Canvas/R3F components here
const R3F = ({projects}) => {
    // const [projects] = useLiveQuery<Project[]>(props.projects, projectsQuery)
    const { height, width } = useThree((state) => state.viewport)
    const textures: Texture[] = projects.projects.map((project) => useTexture(`${project.mainImageUrl}?w750&fm=webp&q=50`) )
    console.log('projects: ', projects.projects)
    console.log('height: ', height)
    console.log('width: ', width)
    
    const imgWidth = 200
    const imageUrl = urlForImage(projects.projects[0].mainImage).width(imgWidth).quality(70).url()
    const blurImageUrl = urlForImage(projects.projects[0].mainImage).width(20).format('webp').quality(20).url()
    
    const { aspectRatio} = getImageDimensions(imageUrl)
    const imgHeight = Math.round(imgWidth / aspectRatio)
    
    return (
        // <Bvh>
            <>
            <Plane
              args={[width * 0.4, height * 0.8]}
              position={[-width / 4, height / 4 - 0.25, 0]}
              rotation={[0, Math.PI / 4, 0]}
            >
              <meshBasicMaterial attach="material" transparent wireframe />
            </Plane>
            
                <Flex
                  size={[width * 0.4, height * 0.8, 0]}
                  position={[-width / 2 + 0.2, height / 2 + 0.25, 0]}
                  rotation={[0, Math.PI / 4, 0]}
                  plane='xy'
                  justifyContent='flex-start'
                  alignContent='flex-start'
                  alignItems='center'
                  flexDir='row'
                  flexWrap='wrap'
                >
                {projects.projects.length > 0 ? (
                  projects.projects.map((project, i) => 
                    <Box 
                      margin={0.05}
                      centerAnchor
                      key={`${project.slug}-${i}`}
                    >
                      <mesh>
                        <Plane 
                          args={[.35, .35]}
                        >
                          <meshBasicMaterial attach="material" map={textures[i]} />
                        </Plane>    
                      </mesh>
                    </Box>)
                ) : (
                  <ComputerMesh scale={0.2} />
                )}
              </Flex>
              <group>
                <mesh
                  position={[0.9, .5, 0]}
                >
                  <planeGeometry
                    args={[width * 0.5, height * 0.9]}
                  />
                  <meshBasicMaterial attach="material" transparent wireframe />
                    <Html
                      // position={[- (width * 0.5) / 2, (height * 0.9) / 2, 0]}
                      wrapperClass={styles['html-content']}
                      transform
                      distanceFactor={1}
                    >
                    <div className={styles['preview-wrapper']}>
                      <div className={styles['grid']}>
                        <div className={styles['title-wrapper']}>
                          <div className={styles['title-card']}>
                            <h1>{projects.projects[0].title.toUpperCase()}</h1>
                          </div>
                        </div>
                        <div className={`${styles['image-wrapper']} ${styles['main-image']}`}>
                          <Image
                            width={imgWidth}
                            height={imgHeight}
                            src={imageUrl}
                            blurDataURL={blurImageUrl}
                            alt={projects.projects[0].title}
                            priority
                            loader={() => urlForImage(projects.projects[0].mainImage).width(200).format('webp').quality(70).url()}
                          />
                        </div>
                        <div className={styles['description-wrapper']}>
                          <div className={styles['description-card']}>
                            <PortableText
                              value={projects.projects[0].desc}
                              components={customMarks}
                            />
                          </div>
                        </div>
                        {projects.projects[0].gallery.images.length > 0 &&
                          projects.projects[0].gallery.images.map((image, i) => {
                            const width = 200
                            const url = urlForImage(image).width(width).quality(70).url()
                            const blurUrl = urlForImage(image).width(20).format('webp').quality(20).url()
                            const { aspectRatio } = getImageDimensions(url)
                            const height = Math.round(width / aspectRatio)
                            return (
                              <div className={`${styles['image-wrapper']} ${styles[`item-${i + 1}`]}`} key={`${image._key}-${i}`}>
                                <Image
                                  width={width}
                                  height={height}
                                  src={url}
                                  blurDataURL={blurUrl}
                                  alt={projects.projects[0].title}
                                  priority
                                  loader={() => urlForImage(image).width(width).format('webp').quality(70).url()}
                                />
                              </div>
                            )
                          })
                        }
                        {projects.projects[0].gallery.videos.length > 0 &&
                          projects.projects[0].gallery.videos.map((video, i) => {
                            const vidAspectRatio = video.width / video.height
                            const vidWidth = 400 * vidAspectRatio
                            const imgLength = projects.projects[0].gallery.images.length
                            return (
                              <div className={`${styles['video-wrapper']} ${styles[`item-${imgLength + i + 1}`]}`} key={`${video._key}-${i}`}>
                                <Suspense fallback={<div>Loading...</div>}>
                                  <video
                                    muted
                                    autoPlay
                                    loop
                                    preload='auto'
                                    playsInline
                                    poster={blurImageUrl}
                                    width={vidWidth}
                                    src={video.url}
                                  />
                                </Suspense>
                              </div>
                            )
                          }
                        )}
                      </div>
                    </div>
                    </Html>
                </mesh>
              </group>
            </>
        // </Bvh> 
    );
};

export default function IndexPage(
  props: InferGetStaticPropsType<typeof getStaticProps>,
) {
    const [projects] = useLiveQuery<Project[]>(props.projects, projectsQuery)

  return (
    <DOM/>
  )
}

IndexPage.canvas = (projects) => <R3F projects={projects} />

