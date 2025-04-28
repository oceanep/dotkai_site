import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { Box, Flex } from '@react-three/flex'
import { Group, PlaneGeometry, Texture } from 'three'
import ComputerMesh from '~/components/ComputerMesh'
import { Project } from '~/lib/sanity.queries'
import { Euler, ThreeEvent, Vector3 } from '@react-three/fiber'
import ProjectsMenuItem from './ProjectsMenuItem'
import { useTexture, Text } from '@react-three/drei'
import { useMediaQuery } from '~/utils/hooks'
import { EMEdiaType } from '~/utils/types'

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

    const isMobile = useMediaQuery(EMEdiaType.SMARTPHONE)
    const isTablet = useMediaQuery(EMEdiaType.TABLET)

    const bgTexture = useTexture('/images/Menu-0_84 aspect ratio.png')

    // add margin to flex container sizing
    // Use difference in widths to add margin to flex contianer positioning
    const [ flexWidth, flexHeight ] = [ width * 0.9375, height * 0.9375 ]
    const widthDiff = isMobile ? 0 : (width - flexWidth) / 2

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
            {/* mesh for title */}
            <mesh
                position={[ widthDiff, height / 2 - 0.02, 0.15]}
            >
                <planeGeometry args={[width * 0.5, height * 0.07]} />
                <meshBasicMaterial color="white" />
                <lineSegments position={[0, 0, 0.01]}>
                    <edgesGeometry attach="geometry" args={[new PlaneGeometry(width * 0.5, height * 0.07)]} />
                    <lineBasicMaterial attach="material" color="black" />
                </lineSegments>
            </mesh>
            <Text
                position={[ widthDiff, height / 2 - 0.025, 0.151]}
                font="/fonts/Crude.otf"
                fontSize={0.08}
                color="black"
                anchorX="center"
                anchorY="middle"
            >
                PROJECTS
            </Text>
            {/* shadow mesh for title */}
            <mesh
                position={[ 0, height / 2 - 0.02, 0]}
            >
                <planeGeometry args={[width * 0.5, height * 0.07]} />
                    <meshBasicMaterial attach="material" depthWrite={false} transparent color="black" opacity={0.25} />
            </mesh>
            {/* Contact Icon Square */}
            <group
                position={[ - width / 2 , height / 2 - 0.8,  0.15]}
            >
                <mesh>
                    <planeGeometry args={[0.1, 0.1]} />
                    <meshBasicMaterial color="white" />
                    <lineSegments position={[0, 0, 0.01]}>
                        <edgesGeometry attach="geometry" args={[new PlaneGeometry(0.1, 0.1)]} />
                        <lineBasicMaterial attach="material" color="black" />
                    </lineSegments>
                </mesh>
                <Text
                    position={[0, 0, 0]}
                    font="/fonts/Crude.otf"
                    fontSize={0.05}
                    color="black"
                    anchorX="center"
                    anchorY="middle"
                >
                    📞
                </Text>
                {/* shadow mesh for contact icon square */}
                <mesh
                    position={[ 0, 0, -0.15]}
                >
                    <planeGeometry args={[0.1, 0.1]} />
                    <meshBasicMaterial attach="material" depthWrite={false} transparent color="black" opacity={0.25} />
                </mesh>
            </group>

            {/* About Me Icon Square */}
            <group
                position={[ - width / 2 , height / 2 - 0.95, 0.15]}
            >
                <mesh>
                    <planeGeometry args={[0.1, 0.1]} />
                    <meshBasicMaterial color="white"/>
                    <lineSegments position={[0, 0, 0.01]}>
                        <edgesGeometry attach="geometry" args={[new PlaneGeometry(0.1, 0.1)]} />
                        <lineBasicMaterial attach="material" color="black" />
                    </lineSegments>
                </mesh>
                <Text
                    position={[0, 0, 0]}
                    font="/fonts/Crude.otf"
                    fontSize={0.05}
                    color="black"
                    anchorX="center"
                    anchorY="middle"
                >
                    👤
                </Text>
                {/* shadow mesh for about me icon square */}
                <mesh
                    position={[ 0, 0, -0.15]}
                >
                    <planeGeometry args={[0.1, 0.1]} />
                    <meshBasicMaterial attach="material" depthWrite={false} transparent color="black" opacity={0.25} />
                </mesh>
            </group>
            <Flex
                size={[flexWidth, flexHeight, 0]}
                position={[ widthDiff, - 0.05, 0.02 ]}
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
