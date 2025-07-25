import React, { useRef } from 'react'
import { Box } from '@react-three/flex'
import { useFrame, useThree } from '@react-three/fiber'
import { Project } from '@/lib/sanity.queries'
import { useMediaQuery } from '@/utils/hooks'
import { EMediaType } from '@/utils/types'
import { Group } from 'three/src/objects/Group'
import { Texture } from 'three/src/textures/Texture'
import { Vector3 } from 'three/src/math/Vector3'
import { Plane } from 'three'

interface ProjectsMenuItemProps {
  project: Project
  texture: Texture
  selected: boolean
  index: number
  clippingPlanes: Plane[]
  selectProject: (newIndex: number) => void
}

const ProjectsMenuItem: React.FC<ProjectsMenuItemProps> = ({
    project,
    texture,
    selected,
    index,
    clippingPlanes,
    selectProject 
}) => {
    const [ hover, setHover ] = React.useState(false)
  
    const meshRef = useRef<Group | null>(null)

    const isMobile = useMediaQuery(EMediaType.SMARTPHONE)
    const isTablet = useMediaQuery(EMediaType.TABLET)

    const { height, width } = useThree((state) => state.viewport)
    // Conversion factor: how many world units equal one pixel
    const worldUnitsPerWidthPixel = width / window.innerWidth
    const worldUnitsPerHeightPixel = height/ window.innerHeight
    // Calculate menu item size and selected menu item size
    const menuItemSize = isMobile || isTablet ? 130 : 85 
    const [ menuItemWidth, menuItemHeight ] = [menuItemSize * worldUnitsPerWidthPixel, menuItemSize * worldUnitsPerHeightPixel]
    const [ itemSelectWidth, itemSelectHeight ] = [(menuItemSize + 10) * worldUnitsPerWidthPixel, (menuItemSize + 10) * worldUnitsPerHeightPixel]



    useFrame((state, delta) => {
        if (meshRef.current) {
            //animate selected state
            //If selection has been made but z position is not at 0.15 lerp
            //If selection has been removed but z position is not at 0 lerp
            const easing = 40 * delta
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
            margin={isMobile || isTablet ? 0.05 : 0.03}
            centerAnchor
            key={`${project.slug}-${index}`}
            name={`project_group_${project.title}`}
        >
            <mesh
                onClick={(e) => {
                    e.stopPropagation()
                    selectProject(index)
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
                name={`project_${project.title}`}
            >
                <planeGeometry args={[ menuItemWidth, menuItemHeight ]} />
                <meshBasicMaterial
                    attach="material"
                    toneMapped={false}
                    map={texture}
                    clippingPlanes={ clippingPlanes }
                />
            </mesh>
            {selected && (
                <mesh
                    position={[0, 0, -0.01]} // Slightly behind the main mesh
                >
                    <planeGeometry args={[ itemSelectWidth, itemSelectHeight ]} />
                    <meshBasicMaterial
                        attach="material"
                        depthWrite={false}
                        transparent color="black"
                        opacity={0.25}
                        clippingPlanes={ clippingPlanes }
                    />
                </mesh>
            )}
        </Box>
    )
}

export default ProjectsMenuItem
