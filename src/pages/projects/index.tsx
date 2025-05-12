import type { GetStaticProps, InferGetStaticPropsType } from 'next'

import { useLiveQuery } from 'next-sanity/preview'
import {getImageDimensions} from '@sanity/asset-utils'

import { readToken } from '~/lib/sanity.api'
import { getClient } from '~/lib/sanity.client'
import { getProjects, type Project, projectsQuery, getPages, type Page, pagesQuery } from '~/lib/sanity.queries'

import type { SharedPageProps } from '~/pages/_app'
import { useFrame, useThree } from '@react-three/fiber'
import { urlForImage } from '~/lib/sanity.image'
import { Color, Euler, LinearSRGBColorSpace, Mesh, SRGBColorSpace, Texture, Vector3 } from 'three'

import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import ProjectsMenu from '~/components/projectsPage/projectsMenu/ProjectsMenu'
import ProjectsDisplay from '~/components/projectsPage/projectsDisplay/ProjectsDisplay'
import { useTexture } from '@react-three/drei'
import { clamp } from 'three/src/math/MathUtils'
import { useDebouncedResize, useMediaQuery } from '~/utils/hooks'
import { EMediaType, ESideMenuItem, ISideMenuItem } from '~/utils/types'
import EffectPass from '~/components/EffectPass'
import ProjectsContent from '~/components/projectsPage/projectsDisplay/ProjectsContent'
import siteContent from '~/constants/siteContent'
import SideMenu from '~/components/projectsPage/sideMenu/sideMenu'
import PagesContent from '~/components/projectsPage/projectsDisplay/PagesContent'

export const getStaticProps: GetStaticProps<
  SharedPageProps & {
    projects: Project[];
    pages: Page[];
  }
> = async ({ draftMode = false }) => {
  const client = getClient(draftMode ? { token: readToken } : undefined);
  const projects = await getProjects(client);
  const pages = await getPages(client);

  return {
    props: {
      draftMode,
      token: draftMode ? readToken : '',
      projects,
      pages,
      title: 'Projects',
    },
  };
};

// DOM elements here
const DOM = () => {
    return <></>;
};
// Canvas/R3F components here
const R3F = ({ projects, pages }: { projects: Project[]; pages: Page[] }) => {
  //State Logic
  const [selectedProject, setSelectedProject] = useState<Project>(projects[0])
  const [selectedMenuItem, setSelectedMenuItem] = useState<Page>(pages.find((page) => page.slug === "about") || pages[0])
  const [showDisplay, setShowDisplay] = useState<boolean>(false)
  const [isProject, setIsProject] = useState<boolean>(false)

  const { sideMenuItems: menuItems } = siteContent['en'].sideMenu

  //Ref for ProjectsDisplay component
  const displayRef = useRef<Mesh>(null)

  //Prepare three related data
  const { height, width } = useThree((state) => state.viewport)

  //Get debounced window size
  const [windowWidth, windowHeight] = useDebouncedResize();

  //Map textures to array to iterate over for menu items
  const textures: Texture[] = projects.map((project) => {
    const _texture = useTexture(`${project.mainImage.url}?w750&fm=webp&q=50`)
    _texture.colorSpace = SRGBColorSpace
    return _texture
  })

  //Media queries
  const isMobile = useMediaQuery(EMediaType.SMARTPHONE)
  const isTablet = useMediaQuery(EMediaType.TABLET)
  const isNormalDesktop = useMediaQuery(EMediaType.DESKTOP)
  const isLargeDesktop = useMediaQuery(EMediaType.LARGE_DESKTOP)

  const isDesktop = isNormalDesktop || isLargeDesktop
  
  // Conversion factor: how many world units equal one pixel
  const worldUnitsPerWidthPixel = width / windowWidth
  const worldUnitsPerHeightPixel = height/ windowHeight
  
  // base variables for size, margins etc
  
  const baseAreaLeft = isMobile ? 1 : isTablet || isDesktop ? 0.425 : 0.425
  const baseAreaRight = isMobile ? 1 : isTablet || isDesktop ? 0.575 : 0.575
  
  const baseMinWidthA = isMobile ? 370 : isTablet ? 450 : isDesktop ? 450 : 450
  const baseMaxWidthA = isMobile ? 370 : isTablet ? 550 : isDesktop ? 550: 550
  
  const baseMinWidthB = isMobile ? 370 : isTablet ? 750 : isDesktop ? 750 : 750
  const baseMaxWidthB = isMobile ? 370 : isTablet ? 900 : isDesktop ? 900 : 900
  
  const mobileBaseHeight = 844

  const baseMarginAX = isMobile 
    ? (windowWidth - baseMaxWidthA) / 2
    : isTablet 
      ? 50 
      : isDesktop 
        ? 75 
        : 75

  const baseMarginAY = isMobile
    ? (windowHeight - mobileBaseHeight) / 2 
    : isTablet 
      ? 5 
      : isDesktop 
        ? 10 
        : 10

  const baseMarginBX = isMobile
    ? (windowWidth - baseMaxWidthB) / 2
    : isTablet 
      ? 30 
      : isDesktop 
        ? 50 
        : 50

  //Mesh texture is bigger so add some vertical padding manually
  const baseMarginBY = isMobile
    ? (windowHeight - mobileBaseHeight) / 2 + 20
    : isTablet 
      ? 50 
      : isDesktop 
        ? 75 
        : 75

  const aspectRatioA = 26/19
  const aspectRatioB = 62/59

  const rotationA = isMobile 
    ? new Euler(0, 0, 0) 
    : isTablet || isDesktop 
      ? new Euler(0, Math.PI / 4, 0) 
      : new Euler(0, Math.PI / 12, 0)

  const rotationB = isMobile
    ? new Euler(0, 0, 0)
    : isTablet || isDesktop 
      ? new Euler(0, - Math.PI / 12, 0)
      : new Euler(0, - Math.PI / 12, 0)

  // ---------------------------
  // Mesh A (Left 40% of viewport)
  // ---------------------------
  // The left allocated area (in world units)
  const leftAreaWidth = width * baseAreaLeft
  
  // Desired margin (choose a value between 25 and 50 pixels; here we pick 25 for this example)
  const marginAX = baseMarginAX * worldUnitsPerWidthPixel
  const marginAY = baseMarginAY * worldUnitsPerHeightPixel
  
  // Compute the available width in the left area after subtracting left and right margins
  const availableWidthA = leftAreaWidth - 2 * marginAX
  
  // Clamp the width between 450px and 600px (converted to world units)
  const minWidthA = baseMinWidthA * worldUnitsPerWidthPixel
  const maxWidthA = baseMaxWidthA * worldUnitsPerWidthPixel
  const meshAWidth = clamp(availableWidthA, minWidthA, maxWidthA)
  
  // Compute the height based on the height/width aspect ratio (ie. width:height is 19:34; so height = width * (34/19))
  const availableHeightA = meshAWidth * aspectRatioA - 2 * marginAY
  const minHeightA = isMobile 
    ? (mobileBaseHeight * worldUnitsPerHeightPixel) - 2 * marginAY
    : minWidthA * aspectRatioA - 2 * marginAY
  const maxHeightA = isMobile
    ? (mobileBaseHeight * worldUnitsPerHeightPixel) - 2 * marginAY
    : maxWidthA * aspectRatioA
  const meshAHeight = clamp(availableHeightA, minHeightA, maxHeightA)
  
  // Position: the left area starts at x = -viewport.width/2.
  // Place the mesh so that its left edge is marginA from the left boundary.
  // Because the mesh is centered, its x position = left boundary + margin + half its width.
  const meshAX = isMobile ? 0 : -width / 2 + marginAX + meshAWidth / 2
  // Vertically, we’ll center it (y = 0), or you could adjust as needed.
  const meshAY = 0
  
  // ---------------------------
  // Mesh B (Right 60% of viewport)
  // ---------------------------
  // The right allocated area width in world units
  const rightAreaWidth = width * baseAreaRight
  
  // Desired margin for Mesh B; here we pick 20px (you might choose a value between 20 and 40px)
  const marginBX = baseMarginBX * worldUnitsPerWidthPixel
  const marginBY = baseMarginBY * worldUnitsPerHeightPixel
  
  // Compute the available width in the right area after subtracting left and right margins
  const availableWidthB = rightAreaWidth - 2 * marginBX
  
  // Clamp the width between 650px and 900px (converted to world units)
  const minWidthB = baseMinWidthB * worldUnitsPerWidthPixel
  const maxWidthB = baseMaxWidthB * worldUnitsPerWidthPixel
  const meshBWidth = clamp(availableWidthB, minWidthB, maxWidthB)
  
  // Compute the height based on the height/width aspect ratio (ie. width:height is 19:34; so height = width * (34/19))
  const avalibaleHeightB = meshBWidth * aspectRatioB - marginBY
  const minHeightB = isMobile
    ? (mobileBaseHeight * worldUnitsPerHeightPixel) - 2 * marginBY
    : minWidthB * aspectRatioB - marginBY
  const maxHeightB = isMobile
    ? (mobileBaseHeight * worldUnitsPerHeightPixel) - 2 * marginBY
    : minWidthB * aspectRatioB 
  const meshBHeight = clamp(avalibaleHeightB, minHeightB, maxHeightB)
  
  // For positioning Mesh B, the right area starts at:
  const rightAreaStartX = -width / 2 + leftAreaWidth
  // To prevent overlapping, clamp mesh B position to mesh a's width and margin from the screen start
  // Don't add mesh b margin here to remove left margin and not double inner margins for both halves
  const bPosMin = -width /2 + meshAWidth + marginAX + meshBWidth / 2
  const bPosMax = width / 2 * worldUnitsPerWidthPixel - marginBX
  const meshBPosBase = rightAreaStartX  + meshBWidth / 2
  const meshBX = isMobile 
    ? width / 2 + meshBWidth / 2 + marginBX
    : clamp(meshBPosBase, bPosMin, bPosMax) 
  // Vertically, again center it
  const meshBY = 0
  
  // console.log('width x height: ', width, height)
  // console.log('client width x height: ', window.innerWidth, window.innerHeight)
  // console.log('world units height: ', worldUnitsPerHeightPixel)
  // console.log('world units width: ', worldUnitsPerWidthPixel)
  // console.log('world start: ', -width/2)
  // console.log('position X, Y: ', meshBPosBase, meshBY)
  // console.log('Mesh width and height: ', meshAWidth)
  // console.log('b position minimum: ', bPosMin)

  //Event Handlers
  const handleProjectSelect = useCallback((projectIndex: number) => {
    setIsProject(true)
    setSelectedProject(projects[projectIndex])
    if (!!isMobile) {
      setShowDisplay(true)
    }
  }, [projects, isMobile])

  const handleMenuItemSelect = useCallback((slug: ESideMenuItem) => {
    const selected = pages.find((item) => item.slug === slug)
    setIsProject(false)
    setSelectedMenuItem(selected)
    if (!!isMobile) {
      setShowDisplay(true)
    }
  }, [pages, isMobile])

  const handleBackButtonClick = () => {
    setShowDisplay(false)
  }

  useEffect(() => {
    if (!isMobile) setShowDisplay(false)
  }, [isMobile])

  //3D state management
  //move camera between menu and information display
  useFrame((state, delta) => {
    if (showDisplay && displayRef.current) {
      state.camera.position.lerp(displayRef.current.position.clone().add(new Vector3(0, 0, 3.5)), delta * 5)
      state.camera.lookAt(state.camera.position.clone().lerp(displayRef.current.position, delta * 5))
    }
    if (!showDisplay && displayRef.current) {
      state.camera.position.lerp(new Vector3(0, 0, 3.5), delta * 5)
      state.camera.lookAt(state.camera.position.clone().lerp(new Vector3(0, 0, 0), delta * 5))
    }
  })

  // temporary fix to persist background color across pages
  const scene = useThree((state) => state.scene)
  useEffect(() => {
        scene.background = new Color('#ffffff');
    }, []);
  
  return (
    <>
      <EffectPass />
      <Suspense fallback={null}>
        <ProjectsMenu 
          width={meshAWidth} 
          height={meshAHeight}
          position={[meshAX, meshAY, -0.2]}
          // rotation={[0,0,0]}
          rotation={rotationA}
          projects={projects} 
          textures={textures}
          isProject={isProject}
          projectClickHandler={handleProjectSelect}
          sideMenuClickHandler={handleMenuItemSelect}
        />
      </Suspense>
      <Suspense fallback={null}>
        <ProjectsDisplay
          ref={displayRef}
          width={meshBWidth}
          height={meshBHeight}
          position={[meshBX, meshBY, -0.25]}
          // rotation={[0,0,0]}
          rotation={rotationB}
          backClick={handleBackButtonClick}
        >
          {!!isProject 
            ? 
              <ProjectsContent
                selectedProject={selectedProject}
                imgWidth={250}
              />
            :
              <PagesContent
                selectedPage={selectedMenuItem}
              />
          }
        </ProjectsDisplay>
      </Suspense>
    </>
  )
}

export default function IndexPage(
  props: InferGetStaticPropsType<typeof getStaticProps>,
) {
  const [projects] = useLiveQuery<Project[]>(props.projects, projectsQuery)
  const [pages] = useLiveQuery<Page[]>(props.pages, pagesQuery)

  return (
    <DOM/>
  )
}

IndexPage.canvas = (props) => <R3F projects={props.projects} pages={props.pages}/>

