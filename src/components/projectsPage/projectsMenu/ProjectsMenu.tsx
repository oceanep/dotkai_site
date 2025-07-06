import React, { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

import { Euler as EulerType, useFrame, Vector3 as Vector3Like } from '@react-three/fiber'
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

    // State for scrollability and hover
    const [canScroll, setCanScroll] = useState(false)
    const [canScrollDown, setCanScrollDown] = useState(false)
    const [canScrollUp, setCanScrollUp] = useState(false)
    const [flexHovered, setFlexHovered] = useState(false)

    const isMobile = useMediaQuery(EMediaType.SMARTPHONE)
    const isTablet = useMediaQuery(EMediaType.TABLET)

    const bgTexture = useTexture('/images/menu-0_84_aspect_ratio.png')

    const textures = useTexture(textureUrls)
    textures.forEach((texture) => {
      texture.colorSpace = SRGBColorSpace
    })

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
    , [isMobile, widthDiff, sideMenuItemSize])

    const flexSize: [number, number, number] = useMemo(() => 
        isMobile 
        // subtract title and side menu height plus gutters to make up from both positioning from the top of the group now
        ? [flexWidth, (flexHeight - sideMenuItemSize - width * 0.07 - 0.075), 0]
        : [flexWidth, flexHeight, 0]
    , [isMobile, flexWidth, flexHeight, sideMenuItemSize])

    // create clipping planes
    const [topPlane, bottomPlane] = useMemo(() => {
        const groupY = flexPosition[1]
        const h = flexSize[1] / 2
        // console.log({groupY, baseY: position[1], flexY: flexPosition[1]})

        const topNormal = new Vector3(0, -1, 0).applyEuler(new Euler(rotation[0], rotation[1], rotation[2])).normalize()
        const bottomNormal = new Vector3(0, 1, 0).applyEuler(new Euler(rotation[0], rotation[1], rotation[2])).normalize()

        const topConstant = groupY + h
        const bottomConstant = groupY - h
        console.log({groupY, topConstant, bottomConstant})

        return [
            new Plane(topNormal, topConstant),
            new Plane(bottomNormal, bottomConstant),
        ]
    }, [position, flexPosition, isMobile, flexSize])
    
    // Update topPlane and bottomPlane constants when flexHeight or planes change (not every frame)
    useLayoutEffect(() => {
        if (!groupRef.current && !flexRef.current) return

        const base = !isMobile 
            ? new Vector3(position[0], position[1], position[2]) 
            : new Vector3(position[0], position[1], position[2])
        // console.log({flexPosition, testFlex: flexRef.current.position, position, testGroup: groupRef.current.position, topPlane, bottomPlane})
        const h = flexSize[1] / 2 
        const topC = flexPosition[1] + h
        const bottomC = Math.abs(flexPosition[1] - h)
        console.log({h, topC, bottomC})

        const topPos = base.clone().addScaledVector(topPlane.normal, topC)
        const bottomPos = base.clone().addScaledVector(bottomPlane.normal, bottomC)

        topPlane.constant = topPlane.normal.dot(topPos)
        bottomPlane.constant = bottomPlane.normal.dot(bottomPos)
    }, [groupRef.current, flexRef.current, position, flexPosition, flexSize, isMobile, topPlane, bottomPlane])

    let lastOffset;

    // Update plane distances every frame to follow container Y position
    useFrame(() => {
        if (!groupRef.current) return

        // const groupPosition = groupRef.current.position
        // const h = flexHeight / 2

        // // Create and apply normals
        // const topNormal = new Vector3(0, -1, 0).applyEuler(groupRotation).normalize()
        // const bottomNormal = new Vector3(0, 1, 0).applyEuler(groupRotation).normalize()

        // topPlane.normal.copy(topNormal)
        // bottomPlane.normal.copy(bottomNormal)

        // Compute constants based on shifted positions along normals
        // const topPos = groupPosition.clone().addScaledVector(topPlane.normal, h)
        // const bottomPos = groupPosition.clone().addScaledVector(bottomPlane.normal, h)

        // topPlane.constant = topPlane.normal.dot(topPos)
        // bottomPlane.constant = bottomPlane.normal.dot(bottomPos)

        // const topPoint = topPlane.normal.clone().multiplyScalar(-topPlane.constant)
        // const bottomPoint = bottomPlane.normal.clone().multiplyScalar(-bottomPlane.constant)

        // console.log('TopPoint:', topPoint.toArray())
        // console.log('BottomPoint:', bottomPoint.toArray())
        // console.log('TopNormal:', topNormal.toArray(), 'Const:', topPlane.constant)
        // console.log('BottomNormal:', bottomNormal.toArray(), 'Const:', bottomPlane.constant)

         // 🔍 Log actual top/bottom of the group mesh (not just clipping planes)
        // const topOfMesh = groupPosition.clone().addScaledVector(new Vector3(0, 1, 0).applyEuler(groupRotation), h)
        // const bottomOfMesh = groupPosition.clone().addScaledVector(new Vector3(0, -1, 0).applyEuler(groupRotation), h)

        // console.log('Top of Mesh:', topOfMesh.toArray())
        // console.log('Bottom of Mesh:', bottomOfMesh.toArray())

        // Check if last ProjectMenuItem is being clipped (for scrollability)
        // if (flexRef.current) {
        //     const lastItem = flexRef.current.children
        //         .filter((child) => child.name?.includes('project_group') && child instanceof Group)
        //         .at(-1)
        //     const firstItem = flexRef.current.children
        //         .filter((child) => child.name?.includes('project_group') && child instanceof Group)
        //         .at(0)
        //     if (firstItem && lastItem) {
        //         firstItem.updateWorldMatrix(true, false)
        //         lastItem.updateWorldMatrix(true, false)

        //         // Get the meshes inside the first and last items and compute the bounding boxes
        //         const firstItemMesh = firstItem.children.find(
        //             (child) : child is Mesh => child.name?.includes('project') && child instanceof Mesh)
        //         if (firstItemMesh && 'geometry' in firstItemMesh && firstItemMesh.geometry.boundingBox === null)
        //             firstItemMesh.geometry.computeBoundingBox()

        //         const lastItemMesh = firstItem.children.find(
        //             (child) : child is Mesh => child.name?.includes('project') && child instanceof Mesh)
        //         if (lastItemMesh && 'geometry' in lastItemMesh && lastItemMesh.geometry.boundingBox === null)
        //             lastItemMesh.geometry.computeBoundingBox()
                
        //         // If bounding boxes, use their offsets for more accurate scrolling
        //         if (firstItemMesh?.geometry?.boundingBox && lastItemMesh?.geometry?.boundingBox) {
        //             const firstBoundingBox = firstItemMesh.geometry.boundingBox
        //             const firstHeight = firstBoundingBox.max.y - firstBoundingBox.min.y
        //             const firstOffset = firstHeight / 2

        //             const lastBoundingBox = lastItemMesh.geometry.boundingBox
        //             const lastHeight = lastBoundingBox.max.y - lastBoundingBox.min.y
        //             lastOffset = lastHeight / 2

        //             // Compute the top and bottom world position of the meshes
        //             const up = new Vector3(0, 1, 0).applyQuaternion(firstItem.quaternion)
        //             const topWorldPos = new Vector3().setFromMatrixPosition(firstItem.matrixWorld).addScaledVector(up, firstOffset)

        //             const down = new Vector3(0, -1, 0).applyQuaternion(lastItem.quaternion)
        //             const bottomWorldPos = new Vector3().setFromMatrixPosition(lastItem.matrixWorld).addScaledVector(down, lastOffset)

        //             const isClippedTop = topPlane.distanceToPoint(topWorldPos) < 0
        //             const isClippedBottom = bottomPlane.distanceToPoint(bottomWorldPos) < 0
        //             const isClipped = isClippedTop || isClippedBottom

        //             if (isClippedTop != canScrollUp) setCanScrollUp(isClippedTop)
        //             if (isClippedBottom != canScrollDown) setCanScrollDown(isClippedBottom)
        //             if (isClipped !== canScroll) setCanScroll(isClipped)

        //             return
        //         }

        //         // FALLBACK in case computing boundingBox fails
        //         const lastWorldPos = new Vector3().setFromMatrixPosition(lastItem.matrixWorld)

        //         const firstWorldPos = new Vector3().setFromMatrixPosition(firstItem.matrixWorld)

        //         const isClippedTop = topPlane.distanceToPoint(firstWorldPos) < 0
        //         const isClippedBottom = bottomPlane.distanceToPoint(lastWorldPos) < 0
        //         const isClipped = isClippedTop || isClippedBottom
                
        //         if (isClippedTop != canScrollDown) setCanScrollDown(isClippedTop)
        //         if (isClippedBottom != canScrollUp) setCanScrollUp(isClippedBottom)
        //         if (isClipped !== canScroll) setCanScroll(isClipped)
        //     }
        // }
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

    const [scrollBounds, setScrollBounds] = useState<{height: number, centerY: number} | null>(null)
    const allTexturesLoaded = textures.every(tex => tex.image && tex.image.complete)

    useLayoutEffect(() => {
        if (!flexRef.current || !allTexturesLoaded) return

        let frameId: number

        const checkBounds = () => {
            flexRef.current.updateWorldMatrix(true, true)
    
            const box = new Box3().setFromObject(flexRef.current)
            const height = box.max.y - box.min.y
            const centerY = (box.max.y + box.min.y) / 2
            
            console.log({height, flexHeight})

            if (height < flexHeight) {
                frameId = requestAnimationFrame(checkBounds)
                return
            }
    
            const { top } = getMeshBounds(flexRef.current, 0)
            const { bottom } = getMeshBounds(flexRef.current, -1) 
    
            const verticalSpan = top - bottom
            
            // Add 0.1 because bounds calculation isn't including some level of margin or layout padding
            setScrollBounds({ height: verticalSpan + (verticalSpan * 0.025), centerY })
        }

        frameId = requestAnimationFrame(checkBounds)
        return () => cancelAnimationFrame(frameId)
    }, [allTexturesLoaded, flexRef.current, projects.length, flexHeight, flexWidth])

    useEffect(() => {
        // console.log({canScroll, canScrollUp, canScrollDown, groupRef, flexRef, flexHovered})
        let lastTouchY = 0
        // Clamp logic based on flexPosition[1] and flexHeight
        // const upperBound = flexPosition[1] + flexHeight / 2
        // const lowerBound = flexPosition[1] - flexHeight / 2
        const visibleHeight = flexSize[1]

        const upperBound = (position[1] + flexPosition[1]) + visibleHeight / 2
        const lowerBound = (position[1] + flexPosition[1]) - visibleHeight / 2
        
        const scrollGroupHeight = scrollBounds?.height ?? 0
        const scrollGroupY = scrollBounds?.centerY ?? 0

        const handleWheel = (e: WheelEvent) => {
            if (flexHovered) {
                e.preventDefault()

                const direction = e.deltaY > 0 ? 'down' : 'up'
                
                const dampedDelta = MathUtils.clamp(e.deltaY * 0.001, -0.075, 0.075)
                let newY = flexRef.current.position.y + dampedDelta

                // Clone the group world matrix to simulate world movement
                // const groupWorldPosition = groupRef.current.localToWorld(new Vector3(0, newY, 0)).y
                const worldPosition = scrollGroupY + dampedDelta
                // const worldPosTop = worldPosition + visibleHeight / 2
                // const worldPosBottom = worldPosition - visibleHeight / 2
                // const worldPosTop = worldPosition + scrollGroupHeight / 2
                // const worldPosBottom = worldPosition - scrollGroupHeight / 2
                const groupY = groupRef.current.position.y
                const flexY = flexRef.current.position.y

                const worldY = groupY + flexY
                const worldPosTop = worldY + (visibleHeight / 2)
                const worldPosBottom = worldY - (scrollGroupHeight - (visibleHeight / 2))

                console.log({
                    // groupWorldPosition,
                    flexY: worldY,
                    // scrollGroupY,
                    visibleHeight,
                    scrollGroupHeight,
                    worldPosBottom,
                    worldPosTop,
                    lowerBound,
                    upperBound
                })

                if (direction === 'up' && (worldPosTop < upperBound)) {
                    console.log('🚫 Blocked UP scroll:', worldPosTop < upperBound)
                    return
                }
                if (direction === 'down' && (worldPosBottom > lowerBound)) {
                    console.log('🚫 Blocked DOWN scroll:', worldPosBottom > lowerBound)
                    return
                }

                // If scrolling down when at the bottom, return
                // if (
                //     direction === 'down' && (!canScrollDown || worldPosBottom < lowerBound)
                // ) return
                if ( direction === 'up' && (worldPosTop + dampedDelta) < upperBound) {
                    flexRef.current.position.y = upperBound - (visibleHeight / 2)
                    return
                } 
                if ( direction === 'down' && (worldPosBottom + dampedDelta) > lowerBound) {
                    flexRef.current.position.y = lowerBound + (scrollGroupHeight - (visibleHeight / 2))
                    return
                }
                // // If scrolling up when at the top, return
                // if (
                //     direction === 'up' && (!canScrollUp || worldPosTop < upperBound)
                // ) return

                // console.log('ys: ', {newY, worldPosTop, worldPosBottom, lowerBound, upperBound})
                // newY = worldPosTop < upperBound ? upperBound : newY
                // newY = worldPosBottom < lowerBound ? lowerBound : newY
                // flexRef.current.position.y = MathUtils.clamp(newY, lowerBound, upperBound)
                flexRef.current.position.y = newY
            }
        }
        const handleTouchStart = (e: TouchEvent) => {
            if (e.touches.length === 1) {
                lastTouchY = e.touches[0].clientY
            }
        }

        const handleTouchMove = (e: TouchEvent) => {
            // console.log('🔥 TOUCH MOVE EVENT')
            e.preventDefault()

            if ( !(e.touches.length === 1)) {
                console.log('❌ Not scrollable or multiple touches')
                return
            }

            const touchY = e.touches[0].clientY
            const delta = lastTouchY - touchY

            const direction = delta > 0 ? 'down' : 'up'
            
            const scrollSpeed = 0.1;
            const dampedDelta = MathUtils.clamp(delta * scrollSpeed, -0.1, 0.1);
            
            let newY = flexRef.current.position.y + dampedDelta;
            
            // Transform proposed local position to world space
            // const worldCenter = flexRef.current.localToWorld(new Vector3(0, 0, 0)).y
            // const worldCenter = scrollGroupY- dampedDelta
            // const worldTop = worldCenter + scrollGroupHeight / 2
            // const worldBottom = worldCenter - lastOffset - scrollGroupHeight / 2
            const groupY = groupRef.current.position.y
            const flexY = flexRef.current.position.y

            const worldY = groupY + flexY
            const worldTop = worldY + (visibleHeight / 2)
            const worldBottom = worldY - (scrollGroupHeight - (visibleHeight / 2))

            console.log({
                scrollGroupHeight,
                worldTop,
                worldBottom,
                upperBound,
                lowerBound,
                dampedDelta
            })

            // Restrict movement if overscrolling
            if ( direction === 'up' && (worldTop + dampedDelta) < upperBound) {
                    console.log('🚫 Blocked UP scroll:', worldTop < upperBound)
                    flexRef.current.position.y = upperBound - (visibleHeight / 2)
                    return
            } 
            if ( direction === 'down' && (worldBottom + dampedDelta) > lowerBound) {
                console.log('🚫 Blocked DOWN scroll:', worldBottom < lowerBound)
                flexRef.current.position.y = lowerBound + (scrollGroupHeight - (visibleHeight / 2))
                return
            }
            
            console.log('✅ Applying newY:', newY)
            // Apply clamped local position
            flexRef.current.position.y = MathUtils.lerp(flexRef.current.position.y, newY, 0.8);
            lastTouchY = touchY
        }

        window.addEventListener('wheel', handleWheel, { passive: false })
        window.addEventListener('touchstart', handleTouchStart, { passive: false })
        window.addEventListener('touchmove', handleTouchMove, { passive: false })
        return () => {
            window.removeEventListener('wheel', handleWheel)
            window.removeEventListener('touchstart', handleTouchStart)
            window.removeEventListener('touchmove', handleTouchMove)
        }
    }, [canScroll, canScrollUp, canScrollDown, groupRef, flexRef, flexHovered, lastOffset, scrollBounds, flexHeight])

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
        >
            {/* background mesh */}
            <mesh
                onPointerOver={() => setFlexHovered(true)}
                onPointerOut={() => setFlexHovered(false)}
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
            />
            <SideMenu 
                sectionWidth={width}
                sectionHeight={height}
                menuItemSize={sideMenuItemSize}
                isProject={isProject}
                clickHandler={sideMenuClickHandler}
            />
            <mesh position={[flexPosition[0], flexPosition[1], flexPosition[2] + 0.01]}>
                <planeGeometry args={[ flexSize[0], flexSize[1] ]}/>
                <meshBasicMaterial color={'red'} opacity={0.2} transparent/>
            </mesh>
            <mesh position={[
                flexPosition[0],
                flexRef.current 
                    ? flexRef.current?.position.y - (scrollBounds.height/ 2 - flexSize[1] / 2) 
                    : flexPosition[1],
                flexPosition[2] + 0.02]}>
                <planeGeometry args={[ flexSize[0], scrollBounds?.height || 0 ]}/>
                <meshBasicMaterial color={'black'} opacity={0.5} transparent/>
            </mesh>
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
