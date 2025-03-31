import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { Box, Flex } from '@react-three/flex'
import { Group, Texture } from 'three'
import ComputerMesh from '~/components/ComputerMesh'
import { Project } from '~/lib/sanity.queries'
import { Euler, ThreeEvent, Vector3 } from '@react-three/fiber'
import ProjectsMenuItem from './ProjectsMenuItem'
import { useTexture } from '@react-three/drei'

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

    const bgTexture = useTexture('/images/Menu-0_84 aspect ratio.png')

    // add margin to flex container sizing
    // Use difference in widths to add margin to flex contianer positioning
    const [ flexWidth, flexHeight ] = useMemo(() => [ width * 0.9375, height * 0.9375 ], [width, height])
    const widthDiff = useMemo(() => (width - flexWidth) / 2, [flexWidth])

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
        <>
            <mesh
                position={position}
                //position={[-width / 4, height / 4 - 0.25, 0]}
                rotation={rotation}
            >
                <planeGeometry
                    // args={[width * 0.4, height * 0.8]}
                    args={[width, height]}
                />
                <meshBasicMaterial attach="material" transparent map={bgTexture} />
            </mesh>
            <Flex
                // size={[width * 0.35, height * 0.75, 0]}
                size={[flexWidth, flexHeight, 0]}
                // position={[-width / 2 + 0.2, height / 2 + 0.25, 0.1]}
                position={[position[0] + widthDiff, position[1], position[2] + 0.02]}
                rotation={rotation}
                centerAnchor
                plane='xy'
                justifyContent='flex-start'
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
        </>
    )
}

export default ProjectsMenu
