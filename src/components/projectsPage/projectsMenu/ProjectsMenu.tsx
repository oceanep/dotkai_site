import React, { useCallback, useEffect, useMemo, useRef } from 'react'

import { Euler, ThreeEvent, Vector3 } from '@react-three/fiber'
import { Texture } from 'three'
import { Flex } from '@react-three/flex'
import { useTexture } from '@react-three/drei'

import { Project } from '~/lib/sanity.queries'
import { useMediaQuery } from '~/utils/hooks'
import { EMediaType } from '~/utils/types'

import ProjectsMenuItem from './ProjectsMenuItem'
import SideMenu from '../sideMenu/sideMenu'
import MenuTitle from './MenuTitle'
import ComputerMesh from '~/components/ComputerMesh'

interface ProjectsMenuProps {
  width: number
  height: number
  position: Vector3
  rotation: Euler
  projects: Project[]
  textures: Texture[]
  clickHandler: (projectIndex: number) => void

}


const ProjectsMenu: React.FC<ProjectsMenuProps> = ({
    width, 
    height, 
    position, 
    rotation, 
    projects, 
    textures, 
    clickHandler 
}) => {
    // const meshRefs = useRef<(React.RefObject<Group> | null)[]>([])

    const [ previousIndex, setPreviousIndex ] = React.useState<number | undefined>(undefined)
    const [ currentIndex, setCurrentIndex ] = React.useState<number>(0)

    const isMobile = useMediaQuery(EMediaType.SMARTPHONE)
    const isTablet = useMediaQuery(EMediaType.TABLET)

    const bgTexture = useTexture('/images/Menu-0_84 aspect ratio.png')

    // add margin to flex container sizing
    // Use difference in widths to add margin to flex contianer positioning
    const [ flexWidth, flexHeight ] = [ width * 0.9375, height * 0.9375 ]
    const widthDiff = isMobile ? 0 : (width - flexWidth) / 2

    // set menu title position based on screen size
    const menuTitlePosition: [number, number, number] = useMemo(() => 
        isMobile 
        ? [widthDiff, height / 2 - 0.15, 0.15]
        : [widthDiff, height / 2 - 0.02, 0.15]
    , [isMobile, widthDiff, height])

    // set menu item and title sizes based on screen size
    const sideMenuItemSize: number = useMemo(() => {
        if (isMobile) return 0.18
        return 0.11
    }, [isMobile])

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

    const selectProject = (event: ThreeEvent<MouseEvent>, newIndex: number) => {
        if (newIndex === currentIndex) return
        setPreviousIndex(currentIndex)
        setCurrentIndex(newIndex)
        clickHandler(newIndex)
    }

    const onProjectHover = useCallback((event: ThreeEvent<PointerEvent>, index: number, setHover: Function) => {
        if (currentIndex === index) return
        setHover(true)
    }, [currentIndex])

    const onProjectUnhover = useCallback((event: ThreeEvent<PointerEvent>, index: number, setHover: Function) => {
        if (currentIndex === index) return
        setHover(false)
    }, [currentIndex])

    return (
        <group
            position={position}
            rotation={rotation}
        >
            {/* background mesh */}
            <mesh>
                <planeGeometry
                    args={[width, height]}
                />
                <meshBasicMaterial attach="material" transparent map={bgTexture} />
            </mesh>
            <MenuTitle
                position={menuTitlePosition}
                width={width * 0.5}
                height={height * 0.07}
            />
            <SideMenu 
                sectionWidth={width}
                sectionHeight={height}
                menuItemSize={sideMenuItemSize}
            />
            <Flex
                size={flexSize}
                position={flexPosition}
                centerAnchor
                plane='xy'
                justifyContent={isMobile || isTablet ? 'space-evenly' : 'flex-start'}
                alignContent='flex-start'
                alignItems='center'
                flexDir='row'
                flexWrap='wrap'
            >
                {projects.length > 0 ? (
                    projects.map((project, i) => 
                    <ProjectsMenuItem
                        key={`${project.slug}-${i}`}
                        project={project}
                        selected={currentIndex === i}
                        texture={textures[i]}
                        index={i}
                        currentIndex={currentIndex}
                        selectProject={selectProject}
                        onProjectHover={onProjectHover}
                        onProjectUnhover={onProjectUnhover}
                    />)
                ) : (
                    <ComputerMesh scale={0.2} />
                )}
            </Flex>
        </group>
    )
}

export default ProjectsMenu
