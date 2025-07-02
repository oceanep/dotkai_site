import React, { useEffect, useMemo, useRef, useState } from 'react'

import { Euler, useFrame, Vector3 as Vector3Like } from '@react-three/fiber'
import { Group, Plane, SRGBColorSpace, Vector3 } from 'three'
import { Flex } from '@react-three/flex'
import { useTexture } from '@react-three/drei'

import { Project } from '~/lib/sanity.queries'
import { useMediaQuery } from '@/utils/hooks'
import { EMediaType, ESideMenuItem } from '@/utils/types'

import ProjectsMenuItem from '@/components/projectsPage/projectsMenu/ProjectsMenuItem'
import SideMenu from '@/components/projectsPage/sideMenu/sideMenu'
import MenuTitle from '@/components/projectsPage/projectsMenu/MenuTitle'

interface ProjectsMenuProps {
    width: number
    height: number
    position: Vector3Like
    rotation: Euler
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
    const [ flexWidth, flexHeight ] = [ width * 0.9375, height * 0.9375 ]
    const widthDiff = isMobile ? 0 : (width - flexWidth) / 2

    // create clipping planes
    const [topPlane, bottomPlane] = useMemo(() => {
        const groupY = position[1]
        const h = flexHeight / 2

        const topNormal = new Vector3(0, -1, 0)
        const bottomNormal = new Vector3(0, 1, 0)

        const topConstant = groupY + h
        const bottomConstant = groupY - h

        return [
            new Plane(topNormal, topConstant),
            new Plane(bottomNormal, bottomConstant),
        ]
    }, [position, flexHeight])

    // Update plane distances every frame to follow container Y position
    useFrame(() => {
        if (!groupRef.current) return

        const groupRotation = groupRef.current.rotation
        const groupPosition = groupRef.current.position
        const h = flexHeight / 2

        // Create and apply normals
        const topNormal = new Vector3(0, -1, 0).applyEuler(groupRotation).normalize()
        const bottomNormal = new Vector3(0, 1, 0).applyEuler(groupRotation).normalize()

        topPlane.normal.copy(topNormal)
        bottomPlane.normal.copy(bottomNormal)

        // Compute constants based on shifted positions along normals
        const topPos = groupPosition.clone().addScaledVector(topNormal, h)
        const bottomPos = groupPosition.clone().addScaledVector(bottomNormal, h)

        topPlane.constant = topNormal.dot(topPos)
        bottomPlane.constant = bottomNormal.dot(bottomPos)

        const topPoint = topPlane.normal.clone().multiplyScalar(-topPlane.constant)
        const bottomPoint = bottomPlane.normal.clone().multiplyScalar(-bottomPlane.constant)

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
        if (flexRef.current) {
            const lastItem = flexRef.current.children
                .filter((child) => child.name?.includes('project_group') && child instanceof Group)
                .at(-1)
            if (lastItem) {
                lastItem.updateWorldMatrix(true, false)
                const localY = lastItem.position.y
                const worldPos = new Vector3().setFromMatrixPosition(lastItem.matrixWorld)
                // console.log('lastItem local Y:', localY)
                // console.log('lastItem world Y:', worldPos.y)

                const isClipped = bottomPlane.distanceToPoint(worldPos) < 0
                // console.log('distance: ', bottomPlane.distanceToPoint(worldPos))
                if (isClipped !== canScroll) setCanScroll(isClipped)
            }
        }
    })

    useEffect(() => {
        console.log({canScroll})
        console.log({flexRef})

    }, [canScroll, flexRef])

    const clippingPlanes = [topPlane, bottomPlane]

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
        ? [ widthDiff, - ( 0.2 + sideMenuItemSize ), 0.02 ]
        : [ widthDiff, - 0.05, 0.02 ]
    , [isMobile, widthDiff, sideMenuItemSize])

    const flexSize: [number, number, number] = useMemo(() => 
        isMobile 
        ? [flexWidth, flexHeight, 0]
        : [flexWidth, flexHeight, 0]
    , [isMobile, flexWidth, flexHeight])

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
            <mesh name='background_mesh'>
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
                        // <Suspense fallback={<MenuItemSkeleton isMobile={isMobile} isTablet={isTablet} index={i} />} key={i}>
                            <ProjectsMenuItem
                                key={`${project.slug}-${i}`}
                                project={project}
                                selected={!!isProject && currentIndex === i && !isMobile}
                                texture={textures[i]}
                                index={i}
                                clippingPlanes={clippingPlanes}
                                selectProject={selectProject}
                            />
                        // </Suspense>
                    )
                )}
            </Flex>
        </group>
    )
}

export default ProjectsMenu
