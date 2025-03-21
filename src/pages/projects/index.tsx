import type { GetStaticProps, InferGetStaticPropsType } from 'next'

import { useLiveQuery } from 'next-sanity/preview'
import {getImageDimensions} from '@sanity/asset-utils'

import { readToken } from '~/lib/sanity.api'
import { getClient } from '~/lib/sanity.client'
import { getProjects, type Project, projectsQuery } from '~/lib/sanity.queries'

import type { SharedPageProps } from '~/pages/_app'
import { useThree } from '@react-three/fiber'
import { urlForImage } from '~/lib/sanity.image'
import { LinearSRGBColorSpace, SRGBColorSpace, Texture } from 'three'

import { Suspense, useMemo, useState } from 'react'
import ProjectsMenu from '~/components/projectsPage/projectsMenu/ProjectsMenu'
import ProjectsDisplay from '~/components/projectsPage/projectsDisplay/ProjectsDisplay'
import { useTexture } from '@react-three/drei'

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
const R3F = ({ projects }) => {
  //State Logic
  const [selectedProject, setSelectedProject] = useState<Project>(projects.projects[0])

  //Prepare three related data
  const { height, width } = useThree((state) => state.viewport)
  const textures: Texture[] = projects.projects.map((project) => {
    const _texture = useTexture(`${project.mainImage.url}?w750&fm=webp&q=50`)
    _texture.colorSpace = SRGBColorSpace
    return _texture
  })

  //Event Handlers
  const handleProjectSelect = (projectIndex: number) => {
    setSelectedProject(projects.projects[projectIndex])
  }

  return (
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
      <Suspense fallback={null}>
        <ProjectsDisplay
          width={width}
          height={height}
          selectedProject={selectedProject}
          imgWidth={250}
        />
      </Suspense>
    </>
  )
}

export default function IndexPage(
  props: InferGetStaticPropsType<typeof getStaticProps>,
) {
  const [projects] = useLiveQuery<Project[]>(props.projects, projectsQuery)

  return (
    <DOM/>
  )
}

IndexPage.canvas = (projects) => <R3F projects={projects} />

