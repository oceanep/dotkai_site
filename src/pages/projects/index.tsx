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
import { Suspense, useMemo, useState } from 'react'
import ProjectsMenu from '~/components/projectsPage/projectsMenu/ProjectsMenu'

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
    const [ selectedProject, setSelectedProject ] = useState<Project>(projects.projects[0])

    //Prepare three variables like diimension, textures, etc
    const { height, width } = useThree((state) => state.viewport)
    const textures: Texture[] = projects.projects.map((project) => useTexture(`${project.mainImageUrl}?w750&fm=webp&q=50`) )
    // console.log('projects: ', projects.projects)
    
    //Prepare image variables
    const imgWidth = 250
    const imageUrl = useMemo(() => urlForImage(selectedProject.mainImage).width(imgWidth).quality(70).url(), [selectedProject])
    const blurImageUrl = useMemo(() => urlForImage(selectedProject.mainImage).width(20).format('webp').quality(20).url(), [selectedProject])
    
    const { aspectRatio} = getImageDimensions(imageUrl)
    const imgHeight = Math.round(imgWidth / aspectRatio)

    const displayType = useMemo(() => selectedProject.gallery.display, [selectedProject])

    //State management callbacks
    const handleProjectSelect = (projectIndex: number) => {
        setSelectedProject(projects.projects[projectIndex])
    }
    
    return (
        // <Bvh>
            <>
              <Suspense fallback={null}>
                <ProjectsMenu 
                  width={width} 
                  height={height} 
                  projects={projects.projects} 
                  textures={textures}
                  clickHandler={handleProjectSelect}
                />
              </Suspense>
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
                            <h1>{selectedProject.title.toUpperCase()}</h1>
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
                            loader={() => urlForImage(selectedProject.mainImage).width(200).format('webp').quality(70).url()}
                          />
                        </div>
                        <div className={styles['description-wrapper']}>
                          <div className={styles['description-card']}>
                            <PortableText
                              value={selectedProject.desc}
                              components={customMarks}
                            />
                          </div>
                        </div>
                        {selectedProject.gallery.images?.length > 0 &&
                          selectedProject.gallery.images.map((image, i) => {
                            const width = 200
                            const url = urlForImage(image).width(width).quality(70).url()
                            const blurUrl = urlForImage(image).width(20).format('webp').quality(20).url()
                            const { aspectRatio } = getImageDimensions(url)
                            const height = Math.round(width / aspectRatio)
                            return (
                              <div className={`${styles['image-wrapper']} ${styles[`item-${i + 1}`]} ${styles[displayType]}`} key={`${image._key}-${i}`}>
                                <Image
                                  width={width}
                                  height={height}
                                  src={url}
                                  blurDataURL={blurUrl}
                                  alt={selectedProject.title}
                                  priority
                                  loader={() => urlForImage(image).width(width).format('webp').quality(70).url()}
                                />
                              </div>
                            )
                          })
                        }
                        {selectedProject.gallery.videos?.length > 0 &&
                          selectedProject.gallery.videos.map((video, i) => {
                            const vidAspectRatio = Number(video.width) / Number(video.height)
                            const vidWidth = 450 * vidAspectRatio
                            const imgArrLength = selectedProject.gallery.images.length
                            return (
                              <div className={`${styles['video-wrapper']} ${styles[`item-${imgArrLength + i + 1}`]} ${styles[displayType]}`} key={`${video._key}-${i}`}>
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

