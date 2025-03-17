import React, { useCallback, useEffect, useRef } from 'react'
import { Box, Flex } from '@react-three/flex'
import { Group, Texture } from 'three'
import ComputerMesh from '~/components/ComputerMesh'
import { Project } from '~/lib/sanity.queries'
import { ThreeEvent } from '@react-three/fiber'
import ProjectsMenuItem from './ProjectsMenuItem'

interface ProjectsMenuProps {
  width: number
  height: number
  projects: Project[]
  textures: Texture[]
  clickHandler: (projectIndex: number) => void
}

const ProjectsMenu: React.FC<ProjectsMenuProps> = ({ width, height, projects, textures, clickHandler }) => {
    // const meshRefs = useRef<(React.RefObject<Group> | null)[]>([])

    const [ previousIndex, setPreviousIndex ] = React.useState<number | undefined>(undefined)
    const [ currentIndex, setCurrentIndex ] = React.useState<number>(0)

    // useEffect(() => {
    //     if (previousIndex === undefined) {
    //         meshRefs.current[0].current.children[0].position.z += 0.15
    //     }
    // }, [])

    const selectProject = (event: ThreeEvent<MouseEvent>, newIndex: number) => {
        // event.stopPropagation()
        if (newIndex === currentIndex) return
        // if (meshRefs.current[currentIndex]?.current) {
        //     //set scale back to 1 because hover state proceeds click state
        //     meshRefs.current[currentIndex].current.scale.set(1, 1, 1)
        //     meshRefs.current[currentIndex].current.children[0].position.z -= 0.15
        // }
        // if (meshRefs.current[newIndex]?.current) {
        //     // meshRefs.current[newIndex].current.scale.set(1, 1, 1)
        //     meshRefs.current[newIndex].current.children[0].position.z += 0.15
        // }
        setPreviousIndex(currentIndex)
        setCurrentIndex(newIndex)
        clickHandler(newIndex)
    }

    const onProjectHover = useCallback((event: ThreeEvent<PointerEvent>, index: number, setHover: Function) => {
        // event.stopPropagation()
        if (currentIndex === index) return
        setHover(true)
        // if (meshRefs.current[index]?.current) {
        //     meshRefs.current[index].current.scale.lerp(1.1, 1.1, 1)
        // }
    }, [currentIndex])

    const onProjectUnhover = useCallback((event: ThreeEvent<PointerEvent>, index: number, setHover: Function) => {
        // event.stopPropagation()
        if (currentIndex === index) return
        setHover(false)
        // if (meshRefs.current[index]?.current) {
        //     meshRefs.current[index].current.scale.set(1, 1, 1)
        // }
    }, [currentIndex])

    return (
    <>
        <mesh
            position={[-width / 4, height / 4 - 0.25, 0]}
            rotation={[0, Math.PI / 4, 0]}
        >
            <planeGeometry
                args={[width * 0.4, height * 0.8]}
            />
            <meshBasicMaterial attach="material" transparent wireframe />
        </mesh>
        <Flex
            size={[width * 0.4, height * 0.8, 0]}
            position={[-width / 2 + 0.2, height / 2 + 0.25, 0]}
            rotation={[0, Math.PI / 4, 0]}
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
