import React, { useEffect } from 'react'
import { Box, Flex } from '@react-three/flex'
import { Group, Texture } from 'three'
import ComputerMesh from '~/components/ComputerMesh'
import { Project } from '~/lib/sanity.queries'
import { useRef } from 'react'

interface ProjectsMenuProps {
  width: number
  height: number
  projects: Project[]
  textures: Texture[]
  clickHandler: (projectIndex: number) => void
}

const ProjectsMenu: React.FC<ProjectsMenuProps> = ({ width, height, projects, textures, clickHandler }) => {
    const meshRefs = useRef<(React.RefObject<Group> | null)[]>([])

    const [ previousIndex, setPreviousIndex ] = React.useState<number | undefined>(undefined)
    const [ currentIndex, setCurrentIndex ] = React.useState<number>(0)

    useEffect(() => {
        if (previousIndex === undefined) {
            meshRefs.current[0].current.children[0].position.z += 0.15
        }
    }, [])

    const selectProject = (newIndex: number) => {
        if (newIndex === currentIndex) return
        if (meshRefs.current[currentIndex]?.current) {
            //set scale back to 1 because hover state proceeds click state
            meshRefs.current[currentIndex].current.scale.set(1, 1, 1)
            meshRefs.current[currentIndex].current.children[0].position.z -= 0.15
        }
        if (meshRefs.current[newIndex]?.current) {
            // meshRefs.current[newIndex].current.scale.set(1, 1, 1)
            meshRefs.current[newIndex].current.children[0].position.z += 0.15
        }
        setPreviousIndex(currentIndex)
        setCurrentIndex(newIndex)
        clickHandler(newIndex)
    }

    const onProjectHover = (index: number) => {
        if (currentIndex === index) return
        if (meshRefs.current[index]?.current) {
            meshRefs.current[index].current.scale.set(1.1, 1.1, 1)
        }
    }

    const onProjectUnhover = (index: number) => {
        if (currentIndex === index) return
        if (meshRefs.current[index]?.current) {
            meshRefs.current[index].current.scale.set(1, 1, 1)
        }
    }

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
            <Box 
                ref={(el) => { meshRefs.current[i] = { current: el} }}
                margin={0.05}
                centerAnchor
                key={`${project.slug}-${i}`}
            >
                <mesh
                    onClick={() => selectProject(i)}
                    onPointerOver={() => onProjectHover(i)}
                    onPointerOut={() => onProjectUnhover(i)}
                    name='project'
                >
                    <planeGeometry args={[.35, .35]} />
                    <meshBasicMaterial attach="material" map={textures[i]} />
                </mesh>
                {currentIndex === i && (
                    <mesh
                        position={[0, 0, -0.01]} // Slightly behind the main mesh
                    >
                        <planeGeometry args={[.38, .38]} /> {/* Slightly larger than the main mesh */}
                        <meshBasicMaterial attach="material" color="black" transparent opacity={0.5} />
                    </mesh>
                )}
            </Box>)
        ) : (
            <ComputerMesh scale={0.2} />
        )}
        </Flex>
    </>
    )
}

export default ProjectsMenu
