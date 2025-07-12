import React, { Suspense, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

import { Euler as EulerType, ThreeEvent, useFrame, Vector3 as Vector3Like } from '@react-three/fiber'
import { Box3, Euler, Group, MathUtils, Mesh, Plane, SRGBColorSpace, Vector3 } from 'three'
import { Flex } from '@react-three/flex'
import { useTexture } from '@react-three/drei'

import { Project } from '~/lib/sanity.queries'
import { useMediaQuery } from '@/utils/hooks'
import { EMediaType, ESideMenuItem } from '@/utils/types'

import ProjectsMenuItem from '@/components/projectsPage/projectsMenu/ProjectsMenuItem'
import SideMenu from '@/components/projectsPage/sideMenu/sideMenu'
import MenuTitle from '@/components/projectsPage/projectsMenu/MenuTitle'
import MenuItemSkeleton from '~/components/skeleton/MenuItemSkeleton'
import { getMobilePlatform } from '~/utils'
import { useLanguage } from '~/utils/contexts/LanguageContext'

interface ProjectsMenuProps {
    width: number
    height: number
    position: Vector3Like
    rotation: EulerType
    projects: Project[]
    textureUrls: string[]
    isProject: boolean
    projectClickHandler: (projectIndex: number) => void
    sideMenuClickHandler: (slug: ESideMenuItem) => void
}


const ProjectsMenu: React.FC<ProjectsMenuProps> = ({
    width, 
    height, 
    position, 
    rotation, 
    projects, 
    textureUrls,
    isProject,
    projectClickHandler,
    sideMenuClickHandler
}) => {
    const groupRef = useRef<Group>(null)

    const flexRef = useRef<Group>(null)

    const [ currentIndex, setCurrentIndex ] = React.useState<number>(0)

    const isMobile = useMediaQuery(EMediaType.SMARTPHONE)
    const isTablet = useMediaQuery(EMediaType.TABLET)

    const { language } = useLanguage()

    const bgTexture = useTexture('/images/menu-0_84_aspect_ratio.png')

    const textures = useTexture(textureUrls)
    textures.forEach((texture) => {
      texture.colorSpace = SRGBColorSpace
    })

    // ---------------------------------
    // Create and Manage Layout Sizing
    // ---------------------------------
    // add margin to flex container sizing
    // Use difference in widths to add margin to flex contianer positioning
    const [ flexWidth, flexHeight ] = useMemo(() => [ width * 0.9375, height * 0.92 ], [height, width])
    const widthDiff = isMobile ? 0 : (width - flexWidth) / 2

    // set menu title position based on screen size
    const menuTitlePosition: [number, number, number] = useMemo(() => 
        isMobile 
        ? [widthDiff, height / 2 - 0.15, 0.01]
        : [widthDiff, height / 2 - 0.02, 0.01]
    , [isMobile, widthDiff, height])

    // set menu item and title sizes based on screen size
    const sideMenuItemSize: number = useMemo(() => {
        if (isMobile) return 0.18
        if (isTablet) return 0.14
        return 0.11
    }, [isMobile, isTablet])

    // set flex container size and position based on screen size
    const flexPosition: [number, number, number] = useMemo(() => 
        isMobile 
        ? [ widthDiff, - ( height * 0.07 + sideMenuItemSize + 0.02) / 2, 0.02 ]
        : [ widthDiff, -0.015, 0.02 ]
    , [isMobile, height, widthDiff, sideMenuItemSize])

    const flexSize: [number, number, number] = useMemo(() => 
        isMobile 
        // subtract title and side menu height plus gutters to make up from both positioning from the top of the group now
        ? [flexWidth, (flexHeight - sideMenuItemSize - width * 0.07 - 0.075), 0]
        : [flexWidth, flexHeight, 0]
    , [isMobile, flexWidth, flexHeight, width, sideMenuItemSize])

    // ---------------------------------
    // Create and Manage Clipping Planes
    // ---------------------------------
    // create clipping planes
    const [topPlane, bottomPlane] = useMemo(() => {
        const groupY = flexPosition[1]
        const h = flexSize[1] / 2

        const topNormal = new Vector3(0, -1, 0).applyEuler(new Euler(rotation[0], rotation[1], rotation[2])).normalize()
        const bottomNormal = new Vector3(0, 1, 0).applyEuler(new Euler(rotation[0], rotation[1], rotation[2])).normalize()

        const topConstant = groupY + h
        const bottomConstant = groupY - h
        
        return [
            new Plane(topNormal, topConstant),
            new Plane(bottomNormal, bottomConstant),
        ]
    }, [rotation, flexPosition, flexSize])
    
    // Update topPlane and bottomPlane constants when flexHeight or planes change (not every frame)
    useLayoutEffect(() => {
        if (!groupRef.current && !flexRef.current) return
        
        const base = !isMobile 
        ? new Vector3(position[0], position[1], position[2]) 
        : new Vector3(position[0], position[1], position[2])
        const h = flexSize[1] / 2 
        const topC = flexPosition[1] + h
        const bottomC = Math.abs(flexPosition[1] - h)
        
        const topPos = base.clone().addScaledVector(topPlane.normal, topC)
        const bottomPos = base.clone().addScaledVector(bottomPlane.normal, bottomC)
        
        topPlane.constant = topPlane.normal.dot(topPos)
        bottomPlane.constant = bottomPlane.normal.dot(bottomPos)
    }, [position, flexPosition, flexSize, isMobile, topPlane, bottomPlane])
    
    // ---------------------------------
    // Manage Scrolling Behavior
    // ---------------------------------
    const [scrollBounds, setScrollBounds] = useState<{height: number, centerY: number} | null>(null)
    
    const lastTouchY = useRef<number>(0)
    const targetY = useRef<number | null>(null)
    const scrollVelocity = useRef<number>(0)

    const allTexturesLoaded = textures.every(tex => tex.image && tex.image.complete)

    // Create box from flex group including children, to calculate accurate size
    useLayoutEffect(() => {
        if (!flexRef.current || !allTexturesLoaded) return

        let frameId: number

        const checkBounds = () => {
            flexRef.current.updateWorldMatrix(true, true)

            const box = new Box3().setFromObject(flexRef.current)
            const boxHeight = box.max.y - box.min.y
            const centerY = (box.max.y + box.min.y) / 2
            
            // Early in render boxHeight doesn't have all geometry yet so we have to wait
            // Checking some arbitrary derivative of the hardcoded flexHeight
            // Cant compare directly because at times its genuinely shorter
            if (boxHeight < flexSize[1] / 2) {
                frameId = requestAnimationFrame(checkBounds)
                return
            }
    
            const { top } = getMeshBounds(flexRef.current, 0)
            const { bottom } = getMeshBounds(flexRef.current, -1) 
    
            const verticalSpan = top - bottom
            
            // Add small margin because bounds calculation isn't including some level of margin or layout padding
            setScrollBounds({ height: verticalSpan + (verticalSpan * 0.025), centerY })
        }

        frameId = requestAnimationFrame(checkBounds)
        return () => cancelAnimationFrame(frameId)
    }, [allTexturesLoaded, projects.length, flexSize])

    // Update plane distances every frame to follow container Y position
    useFrame(() => {
        if (!flexRef.current || !scrollBounds) return

        if (Math.abs(scrollVelocity.current) < 0.0001) return

        // Apply velocity damping
        scrollVelocity.current *= isMobile ? 0.7 : 0.8 // Decay of scroll, higher is longer
        
        const currentY = flexRef.current.position.y
        const lerpSpeed = isMobile ? 0.6 : 0.7

        // when target is null, fallback to default position
        // mostly for initial render
        const nextY = !targetY.current 
            ? targetY.current ?? flexPosition[1] 
            : MathUtils.lerp(currentY, targetY.current, lerpSpeed)
            
        if (Math.abs(nextY - currentY) < 0.0001) return
        flexRef.current.position.y = nextY
    })

    const getMeshBounds = (group: Group, index: number): { top: number, bottom: number } | null => {
        const g_mesh = group.children.filter((child) => child.name?.includes('project_group') && child instanceof Group)
            .at(index)
        if (!g_mesh) return null

        g_mesh.updateWorldMatrix(true, false)

        const mesh = g_mesh.children.find((child): child is Mesh => child.name?.includes('project') && child instanceof Mesh)
        if (!mesh) return null

        if (!mesh.geometry.boundingBox) mesh.geometry.computeBoundingBox()

        const box = mesh.geometry.boundingBox!
        const halfHeight = (box.max.y - box.min.y) / 2

        const up = new Vector3(0, 1, 0).applyQuaternion(g_mesh.quaternion)
        const down = new Vector3(0, -1, 0).applyQuaternion(g_mesh.quaternion)

        const top = new Vector3().setFromMatrixPosition(g_mesh.matrixWorld).addScaledVector(up, halfHeight).y
        const bottom = new Vector3().setFromMatrixPosition(g_mesh.matrixWorld).addScaledVector(down, halfHeight).y
        return { top, bottom }
    }

    const getClampedTargetY = useCallback((delta: number): number => {
        if (!groupRef.current || !flexRef.current || !scrollBounds) return flexRef.current?.position.y ?? 0

        const direction = delta > 0 ? 'down' : 'up'

        const visibleHeight = flexSize[1]
        const scrollGroupHeight = scrollBounds?.height ?? 0

        const groupY = groupRef.current.position.y
        const flexY = flexRef.current.position.y
        const worldY = groupY + flexY

        const upperBound = (position[1] + flexPosition[1]) + visibleHeight / 2
        const lowerBound = (position[1] + flexPosition[1]) - visibleHeight / 2

        const worldTop = worldY + (visibleHeight / 2)
        const worldBottom = worldY - (scrollGroupHeight - (visibleHeight / 2))

        const proposedTop = worldTop + delta
        const proposedBottom = worldBottom + delta
        
        // If scrolling down when at the bottom or top, return
        if (direction === 'up' && (worldTop < upperBound)) {
            console.log('🙌🏽 At the TOP:')
            return 0
        }
        if (direction === 'down' && (worldBottom > lowerBound)) {
            console.log('🙇🏽‍♂️ At the BOTTOM:')
            return 0
        }

        // If a scroll delta is over the lowerbound/upperbound, return the bound
        if (direction === 'up' && proposedTop < upperBound) {
            console.log('🚫 Blocked UP scroll:')
            return upperBound - visibleHeight / 2
        }
        if (direction === 'down' && proposedBottom > lowerBound) {
            console.log('🚫 Blocked DOWN scroll:')
            return lowerBound + (scrollGroupHeight - visibleHeight / 2)
        }

        return flexRef.current.position.y + delta
    }, [scrollBounds, flexSize, position, flexPosition])

    const handleWheel = useCallback((e: WheelEvent) => {
        // control acceleration and possible scroll amount
        const scrollSpeed = 0.0002
        const dampedDelta = MathUtils.clamp(e.deltaY * scrollSpeed, -0.075, 0.075)
        
        // build velocity
        scrollVelocity.current += dampedDelta

        // Bind total box size to visible box size and set so velocity can decay and lerp
        const newY = getClampedTargetY(scrollVelocity.current)
        targetY.current = newY
    }, [getClampedTargetY])

    const handleTouchStart = useCallback((e: ThreeEvent<PointerEvent>) => {
        if (e.isPrimary && e.pointerType === 'touch') {
            lastTouchY.current = e.clientY
        }
    }, [])

    const handleTouchMove = useCallback((e: ThreeEvent<PointerEvent>) => {
        // e.nativeEvent.preventDefault()
        if ( !(e.isPrimary && e.pointerType === 'touch')) {
            console.log('❌ Not scrollable or multiple touches')
            return
        }

        const touchY = e.clientY
        const delta = lastTouchY.current - touchY
        
        // control acceleration and possible scroll amount
        console.log({dpr: window.devicePixelRatio})
        const dpr = window.devicePixelRatio
        const scrollSpeed = dpr >= 3 ? 0.003 : 0.3; // accelleration of scroll
        // console.log({delta: delta * scrollSpeed})
        const dampedDelta = MathUtils.clamp(
            delta * scrollSpeed,
            dpr >= 3 ? -0.1 : -0.5,
            dpr >= 3 ? 0.1 : 0.5
        );

        // build velocity
        scrollVelocity.current += dampedDelta

        // Bind total box size to visible box size and set so velocity can decay and lerp
        const newY = getClampedTargetY(scrollVelocity.current)
        targetY.current = newY

        // Reset touch for next delta
        lastTouchY.current = touchY
    }, [getClampedTargetY])

    // State event callbacks
    const selectProject = (newIndex: number) => {
        if (newIndex === currentIndex && isProject === true && !isMobile) return
        setCurrentIndex(newIndex)
        projectClickHandler(newIndex)
    }

    return (
        <group
            position={position}
            rotation={rotation}
            ref={groupRef}
            name='projectsmenu_group'
            onPointerDown={(e) => {
                if (e.pointerType === 'touch') {
                    handleTouchStart(e)
                }
            }}
            onPointerMove={(e) => {
                if (e.pointerType === 'touch') {
                    handleTouchMove(e)
                }
            }}
        >
            {/* background mesh */}
            <mesh
                onWheel={(e) => handleWheel(e.nativeEvent)}
                name='background_mesh'
            >
                <planeGeometry
                    args={[width, height]}
                />
                <meshBasicMaterial
                    attach="material"
                    transparent map={bgTexture}
                />
            </mesh>
            <MenuTitle
                position={menuTitlePosition}
                width={width * 0.5}
                height={height * 0.07}
                isProject={isProject}
                language={language}
            />
            <SideMenu 
                sectionWidth={width}
                sectionHeight={height}
                menuItemSize={sideMenuItemSize}
                isProject={isProject}
                clickHandler={sideMenuClickHandler}
                language={language}
            />
            <Flex
                ref={flexRef}
                size={flexSize}
                position={flexPosition}
                centerAnchor
                plane='xy'
                justifyContent={isMobile || isTablet ? 'space-evenly' : 'flex-start'}
                alignContent='flex-start'
                alignItems='center'
                flexDir='row'
                flexWrap='wrap'
                name='flex_container'
            >
                {projects.length > 0 && (
                    projects.map((project, i) => 
                        <Suspense fallback={<MenuItemSkeleton isMobile={isMobile} isTablet={isTablet} index={i} />} key={i}>
                            <ProjectsMenuItem
                                key={`${project.slug}-${i}`}
                                project={project}
                                selected={!!isProject && currentIndex === i && !isMobile}
                                texture={textures[i]}
                                index={i}
                                clippingPlanes={[topPlane, bottomPlane]}
                                selectProject={selectProject}
                            />
                        </Suspense>
                    )
                )}
            </Flex>
        </group>
    )
}

export default ProjectsMenu
