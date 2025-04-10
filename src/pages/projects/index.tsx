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
import { clamp } from 'three/src/math/MathUtils'

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
  //Map textures to array to iterate over for menu items
  const textures: Texture[] = projects.projects.map((project) => {
    const _texture = useTexture(`${project.mainImage.url}?w750&fm=webp&q=50`)
    _texture.colorSpace = SRGBColorSpace
    return _texture
  })
  
  // Conversion factor: how many world units equal one pixel
  const worldUnitsPerWidthPixel = width / window.innerWidth
  const worldUnitsPerHeightPixel = height/ window.innerHeight
  
  // ---------------------------
  // Mesh A (Left 40% of viewport)
  // ---------------------------
  // The left allocated area (in world units)
  const leftAreaWidth = width * 0.425
  
  // Desired margin (choose a value between 25 and 50 pixels; here we pick 25 for this example)
  const marginAX = 50 * worldUnitsPerWidthPixel
  const marginAY = 5 * worldUnitsPerHeightPixel
  
  // Compute the available width in the left area after subtracting left and right margins
  const availableWidthA = leftAreaWidth - 2 * marginAX
  
  // Clamp the width between 450px and 600px (converted to world units)
  const minWidthA = 450 * worldUnitsPerWidthPixel
  const maxWidthA = 550 * worldUnitsPerWidthPixel
  const meshAWidth = clamp(availableWidthA, minWidthA, maxWidthA)
  
  // Compute the height based on the height/width aspect ratio (ie. width:height is 19:34; so height = width * (34/19))
  const availableHeightA = meshAWidth * (26 / 19) - 2 * marginAY
  const minHeightA = minWidthA * (26 / 19) - 2 * marginAY
  const maxHeightA = maxWidthA * (26 / 19)
  const meshAHeight = clamp(availableHeightA, minHeightA, maxHeightA)
  
  // Position: the left area starts at x = -viewport.width/2.
  // Place the mesh so that its left edge is marginA from the left boundary.
  // Because the mesh is centered, its x position = left boundary + margin + half its width.
  const meshAX = -width / 2 + marginAX + meshAWidth / 2
  // Vertically, we’ll center it (y = 0), or you could adjust as needed.
  const meshAY = 0
  
  // ---------------------------
  // Mesh B (Right 60% of viewport)
  // ---------------------------
  // The right allocated area width in world units
  const rightAreaWidth = width * 0.575
  
  // Desired margin for Mesh B; here we pick 20px (you might choose a value between 20 and 40px)
  const marginBX = 30 * worldUnitsPerWidthPixel
  const marginBY = 50 * worldUnitsPerHeightPixel
  
  // Compute the available width in the right area after subtracting left and right margins
  const availableWidthB = rightAreaWidth - 2 * marginBX
  
  // Clamp the width between 650px and 900px (converted to world units)
  const minWidthB = 750 * worldUnitsPerWidthPixel
  const maxWidthB = 900 * worldUnitsPerWidthPixel
  const meshBWidth = clamp(availableWidthB, minWidthB, maxWidthB)
  
  // Compute the height based on the height/width aspect ratio (ie. width:height is 19:34; so height = width * (34/19))
  const avalibaleHeightB = meshBWidth * (62 / 59) - marginBY
  const minHeightB = minWidthB * (62 / 59) - marginBY
  const maxHeightB = maxWidthB * (62 / 59)
  const meshBHeight = clamp(avalibaleHeightB, minWidthB, maxHeightB)
  
  // For positioning Mesh B, the right area starts at:
  const rightAreaStartX = -width / 2 + leftAreaWidth
  // Place Mesh B so that its left edge is marginB from the start of the right area.
  // Don't add margin here to remove left margin and not double inner margins for both halves
  const bPosMin = -width /2 + meshAWidth + marginAX + meshBWidth / 2
  // To prevent overlapping, clamp mesh B position to mesh a's width and margin from the screen start
  const bPosMax = meshAWidth + meshBWidth
  const meshBPosBase = rightAreaStartX  + meshBWidth / 2
  const meshBX = clamp(meshBPosBase, bPosMin, bPosMax) 
  // Vertically, again center it
  const meshBY = 0
  
  // console.log('width x height: ', width, height)
  // console.log('client width x height: ', window.innerWidth, window.innerHeight)
  // console.log('world units height: ', worldUnitsPerHeightPixel)
  // console.log('world units width: ', worldUnitsPerWidthPixel)
  console.log('world start: ', -width/2)
  console.log('position X, Y: ', meshBPosBase, meshBY)
  // console.log('Mesh width and height: ', meshAWidth)
  console.log('b position minimum: ', bPosMin)

  //Event Handlers
  const handleProjectSelect = (projectIndex: number) => {
    setSelectedProject(projects.projects[projectIndex])
  }
  
  return (
    <>
      <Suspense fallback={null}>
        <ProjectsMenu 
          width={meshAWidth} 
          height={meshAHeight}
          position={[meshAX, meshAY, -0.2]}
          // rotation={[0,0,0]}
          rotation={[0, Math.PI / 4, 0]}
          projects={projects.projects} 
          textures={textures}
          clickHandler={handleProjectSelect}
        />
      </Suspense>
      <Suspense fallback={null}>
        <ProjectsDisplay
          width={meshBWidth}
          height={meshBHeight}
          position={[meshBX, meshBY, -0.25]}
          // rotation={[0,0,0]}
          rotation={[0, - Math.PI / 12, 0]}
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

