import React, { useEffect, useRef } from 'react'
import { Box } from '@react-three/flex'
import { Group, Texture, Vector3 } from 'three'
import { ThreeEvent, useFrame } from '@react-three/fiber'
import { Project } from '~/lib/sanity.queries'

interface ProjectsMenuItemProps {
  project: Project
  texture: Texture
  selected: boolean
  index: number
  currentIndex: number
  selectProject: (event: ThreeEvent<MouseEvent>, newIndex: number) => void
  onProjectHover: (event: ThreeEvent<PointerEvent>, index: number, setHover: Function) => void
  onProjectUnhover: (event: ThreeEvent<PointerEvent>, index: number, setHover: Function) => void
}

const ProjectsMenuItem: React.FC<ProjectsMenuItemProps> = ({ project, texture, selected, index, selectProject }) => {
    const [ hover, setHover ] = React.useState(false)
    const [ firstRender, setFirstRender ] = React.useState(true)
  
    const meshRef = useRef<Group | null>(null)

    useEffect(() => {setFirstRender(false)}, [])

    useFrame((state, delta) => {
        if (meshRef.current) {
            //animate selected state
            //If selection has been made but z position is not at 0.15 lerp
            //If selection has been removed but z position is not at 0 lerp
            const easing = 20 * delta
            if (selected && meshRef.current.position.z < 0.14999 || !selected && meshRef.current.children[0].position.z > 0.001) {
                const targetPosition = new Vector3() 
                targetPosition.copy(meshRef.current.children[0].position)
                //if selected set z position to 0.15 else set to 0
                targetPosition.z = selected ? 0.15 : 0
                
                meshRef.current.children[0].position.lerp(targetPosition, 0.2 * (2 * easing))
            }
            //After lerping, exlcude selected items from hover state/animations
            if (selected) return
            //animate hover state
            if (hover) meshRef.current.scale.lerp({ x: 1.1, y: 1.1, z: 1 }, 0.2 * easing)
            if (!hover) meshRef.current.scale.lerp({ x: 1, y: 1, z: 1 }, 0.2 * easing)
        }
    })

    return (
        <Box 
            ref={meshRef}
            margin={0.05}
            centerAnchor
            key={`${project.slug}-${index}`}
        >
            <mesh
                onClick={(e) => {
                    e.stopPropagation()
                    selectProject(e, index)
                }}
                onPointerOver={(e) =>{
                    e.stopPropagation
                    if (selected) return
                    setHover(true)
                }}
                onPointerOut={(e) => {
                    e.stopPropagation
                    if (selected) return
                    setHover(false)
                }}
                name='project'
            >
                <planeGeometry args={[.35, .35]} />
                <meshBasicMaterial attach="material" map={texture} />
            </mesh>
            {selected && (
                <mesh
                    position={[0, 0, -0.01]} // Slightly behind the main mesh
                >
                    <planeGeometry args={[.38, .38]} />
                    <meshBasicMaterial attach="material" color="black" transparent opacity={0.5} />
                </mesh>
            )}
        </Box>
    )
}

export default ProjectsMenuItem
