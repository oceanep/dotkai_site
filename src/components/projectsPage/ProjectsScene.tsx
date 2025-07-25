import { Suspense, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

import dynamic from 'next/dynamic'
import { type Project, type Page } from '~/lib/sanity.queries'

import { useFrame, useThree } from '@react-three/fiber'

import { Mesh } from 'three/src/objects/Mesh'
import { Euler } from 'three/src/math/Euler'
import { Vector3 } from 'three/src/math/Vector3'

import { clamp } from 'three/src/math/MathUtils'
import { useDebouncedResize, useMediaQuery } from '@/utils/hooks'
import { EMediaType, ESideMenuItem } from '@/utils/types'

import ProjectsMenu from '@/components/projectsPage/projectsMenu/ProjectsMenu'
import ProjectsDisplay from '@/components/projectsPage/projectsDisplay/ProjectsDisplay'
import PagesContent from '@/components/projectsPage/projectsDisplay/PagesContent'
import PanelSkeleton from '@/components//skeleton/PanelSkeleton'
import DisplaySkeleton from '@/components/skeleton/DisplaySkeleton'
import Parallax from '../Parallax'
import { Perf } from 'r3f-perf'
import { useLanguage } from '~/utils/contexts/LanguageContext'

const ProjectsContent = dynamic(
  () => import('@/components/projectsPage/projectsDisplay/ProjectsContent'), { 
    ssr: false,
    loading: () => <DisplaySkeleton/>
  }
)

// Canvas/R3F components here
const ProjectsScene = ({
  projects,
  pages,
}: {
  projects: Project[]
  pages: Page[]
}) => {
  // Context
  const { language } = useLanguage()

  //State Logic
  const [selectedProject, setSelectedProject] = useState<Project>(projects[0])
  const [selectedMenuItem, setSelectedMenuItem] = useState<Page>(
    pages.find((page) => page.slug === 'about') || pages[0],
  )
  const [showDisplay, setShowDisplay] = useState<boolean>(false)
  const [isProject, setIsProject] = useState<boolean>(false)

  //Ref for ProjectsDisplay component
  const displayRef = useRef<Mesh>(null)

  //Prepare three related data
  const { height, width } = useThree((state) => state.viewport)

  //Get debounced window size
  const [windowWidth, windowHeight] = useDebouncedResize()

  //Map textures to array to iterate over for menu items
  const textureUrls = projects.map(
    (project) => `${project.mainImage.url}?w750&fm=webp&q=50`,
  )

  //Media queries
  const isMobile = useMediaQuery(EMediaType.SMARTPHONE)
  const isTablet = useMediaQuery(EMediaType.TABLET)
  const isNormalDesktop = useMediaQuery(EMediaType.DESKTOP)
  const isLargeDesktop = useMediaQuery(EMediaType.LARGE_DESKTOP)

  const isDesktop = isNormalDesktop || isLargeDesktop

  // Conversion factor: how many world units equal one pixel
  const worldUnitsPerWidthPixel = width / windowWidth
  const worldUnitsPerHeightPixel = height / windowHeight

  // base variables for size, margins etc

  const baseAreaLeft = isMobile 
    ? 1 
    : isTablet || isNormalDesktop
      ? 0.45 
      : 0.425
  const baseAreaRight = isMobile
    ? 1 
    : isTablet || isNormalDesktop
      ? 0.55 
      : 0.575

  const baseMinWidthA = isMobile ? 370 : isTablet ? 350 : isDesktop ? 400 : 450
  const baseMaxWidthA = isMobile ? 370 : isTablet ? 400 : isDesktop ? 500 : 550

  const baseMinWidthB = isMobile ? 370 : isTablet ? 500 : isDesktop ? 750 : 750
  const baseMaxWidthB = isMobile ? 370 : isTablet ? 650 : isDesktop ? 900 : 900

  const mobileBaseHeight = 844

  const baseMarginAX = isMobile
    ? (windowWidth - baseMaxWidthA) / 2
    : isTablet
      ? 15
      : isDesktop
        ? 40
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
      ? 10
      : isDesktop
        ? 30
        : 70

  //Mesh texture is bigger so add some vertical padding manually
  const baseMarginBY = isMobile
    ? (windowHeight - mobileBaseHeight) / 2 + 20
    : isTablet
      ? 50
      : isDesktop
        ? 75
        : 75

  const aspectRatioA = 26 / 19
  const aspectRatioB = isTablet ? 17 / 13 : 62 / 59

  const rotationA = isMobile
    ? new Euler(0, 0, 0)
    : isTablet || isDesktop
      ? new Euler(0, Math.PI / 4, 0)
      : new Euler(0, Math.PI / 12, 0)

  const rotationB = isMobile
    ? new Euler(0, 0, 0)
    : isTablet || isDesktop
      ? new Euler(0, -Math.PI / 12, 0)
      : new Euler(0, -Math.PI / 12, 0)

  // ---------------------------
  // Mesh A (Left 40% of viewport)
  // ---------------------------
  // The left allocated area (in world units)
  const leftAreaWidth = width * baseAreaLeft

  // Desired margin 
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
  ? mobileBaseHeight * worldUnitsPerHeightPixel - 2 * marginAY
  : minWidthA * aspectRatioA - 2 * marginAY
  const maxHeightA = isMobile
  ? mobileBaseHeight * worldUnitsPerHeightPixel - 2 * marginAY
  : maxWidthA * aspectRatioA
  const meshAHeight = clamp(availableHeightA, minHeightA, maxHeightA)
  
  // Position: the left area starts at x = -viewport.width/2.
  // Place the mesh so that its left edge is marginA from the left boundary.
  // Because the mesh is centered, its x position = reset to left of space + total left area then move left by - margin + half its width.
  const meshAX = isMobile ? 0 : (-width / 2 + leftAreaWidth) - (marginAX + meshAWidth / 2)
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
  ? mobileBaseHeight * worldUnitsPerHeightPixel - 2 * marginBY
  : minWidthB * aspectRatioB - marginBY
  const maxHeightB = isMobile
  ? mobileBaseHeight * worldUnitsPerHeightPixel - 2 * marginBY
  : minWidthB * aspectRatioB
  const meshBHeight = clamp(avalibaleHeightB, minHeightB, maxHeightB)
  
  // For positioning Mesh B, the right area starts at:
  const rightAreaStartX = width - rightAreaWidth
  // To prevent overlapping, clamp mesh B position to mesh a's width and margin from the screen start
  // Don't add mesh b margin here to remove left margin and not double inner margins for both halves
  const bPosMin = -width / 2 + meshAWidth + marginAX + meshBWidth / 2
  const bPosMax = rightAreaStartX + marginBX + meshBWidth / 2
  const meshBPosBase = (meshAX + meshAWidth/2) + marginBX + meshBWidth / 2
  const meshBX = isMobile
    ? width / 2 + meshBWidth / 2 + marginBX
    : clamp(meshBPosBase, bPosMin, bPosMax)
  // Vertically, again center it
  const meshBY = 0

  //Event Handlers
  const handleProjectSelect = useCallback(
    (projectIndex: number) => {
      setIsProject(true)
      setSelectedProject(projects[projectIndex])
      if (!!isMobile) {
        setShowDisplay(true)
      }
    },
    [projects, isMobile],
  )

  const handleMenuItemSelect = useCallback(
    (slug: ESideMenuItem) => {
      const selected = pages.find((item) => item.slug === slug)
      setIsProject(false)
      if (selected?.slug !== selectedMenuItem?.slug) {
        setSelectedMenuItem(selected)
      }
      if (!!isMobile) {
        setShowDisplay(true)
      }
    },
    [pages, isMobile, selectedMenuItem],
  )

  const handleBackButtonClick = () => {
    setShowDisplay(false)
  }

  useEffect(() => {
    if (!isMobile) setShowDisplay(false)
  }, [isMobile])

  // parallax camera control is racing against display camera control, provide a delay
  const [parallaxReady, setParallaxReady] = useState(false)

  useEffect(() => {
    if (isMobile) {
      setParallaxReady(false);
      let frameId: number;
      let frameCount = 0;
      const maxFrames = isMobile ? 30 : 15;
  
      const waitFrames = () => {
        if (frameCount < maxFrames) {
          frameCount++;
          frameId = requestAnimationFrame(waitFrames);
        } else {
          setParallaxReady(true);
        }
      };
  
      frameId = requestAnimationFrame(waitFrames);
      return () => cancelAnimationFrame(frameId);
    } else {
      setParallaxReady(true); // instantly ready on desktop
    }
  }, [showDisplay, isMobile]);

  const derivedReady = useMemo(() => {
    return isMobile ? parallaxReady : true;
  }, [isMobile, parallaxReady]);

  //3D state management
  //move camera between menu and information display
  useFrame((state, delta) => {
    if (!isMobile) return
    if (showDisplay && displayRef.current) {
      if (!displayRef.current.position) return
      state.camera.position.lerp(
        new Vector3(meshBX, meshBY, 3.5),
        delta * 5,
      )
      state.camera.lookAt(
        state.camera.position
          .clone()
          .lerp(new Vector3(meshBX, meshBY, -0.25), delta * 5)
      )
    }
    if (!showDisplay && displayRef.current) {
      state.camera.position.lerp(new Vector3(0, 0, 3.5), delta * 5)
      state.camera.lookAt(
        state.camera.position.clone().lerp(new Vector3(0, 0, 0), delta * 5),
      )
    }
  })

  // Reset the camera so that it doesn't have to lerp from Bvh position to proper position
  const { camera } = useThree()

  useLayoutEffect(() => {
    camera.position.set(0, 0, 3.5)
    camera.lookAt(
        new Vector3(0, 0, 0),
      )
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {process.env.NODE_ENV === 'development' && <Perf position="top-left" />}
      <Parallax
        {...(isMobile && { ready: derivedReady })}
        secondaryPos={
          showDisplay && displayRef.current
            ? new Vector3(meshBX, meshBY, -0.25)
            : undefined
        }
      />
      <Suspense
        fallback={
          <>
            <PanelSkeleton
              position={[meshAX, meshAY, -0.2]}
              rotation={rotationA.toArray() as [number, number, number]}
              width={meshAWidth}
              height={meshAHeight}
            />
            <PanelSkeleton
              position={[meshBX, meshBY, -0.25]}
              rotation={rotationB.toArray() as [number, number, number]}
              width={meshBWidth}
              height={meshBHeight}
            />
          </>
        }
      >
        <ProjectsMenu
          width={meshAWidth}
          height={meshAHeight}
          position={[meshAX, meshAY, -0.2]}
          rotation={rotationA.toArray() as [number, number, number]}
          projects={projects}
          textureUrls={textureUrls}
          isProject={isProject}
          projectClickHandler={handleProjectSelect}
          sideMenuClickHandler={handleMenuItemSelect}
        />
        <ProjectsDisplay
          ref={displayRef}
          width={meshBWidth}
          height={meshBHeight}
          position={[meshBX, meshBY, -0.25]}
          // rotation={[0,0,0]}
          rotation={rotationB.toArray() as [number, number, number]}
          backClick={handleBackButtonClick}
        >      
          {!!isProject ? (
              
              <ProjectsContent selectedProject={selectedProject} imgWidth={250} language={language} />
          ) : (
              <PagesContent selectedPage={selectedMenuItem} language={language}/>
          )}
        </ProjectsDisplay>
      </Suspense>
    </>
  )
}

export default ProjectsScene
