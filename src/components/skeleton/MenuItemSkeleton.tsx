import React, { useRef } from 'react'
import { Box } from '@react-three/flex'
import { Group } from 'three'
import { useThree } from '@react-three/fiber'

interface MenuItemSkeletonProps {
  isMobile: boolean
  isTablet: boolean
  index: number
}

const ProjectsMenuItem: React.FC<MenuItemSkeletonProps> = ({
    index,
    isMobile,
    isTablet,
}) => {  
    const meshRef = useRef<Group | null>(null)

    const { height, width } = useThree((state) => state.viewport)
    // Conversion factor: how many world units equal one pixel
    const worldUnitsPerWidthPixel = width / window.innerWidth
    const worldUnitsPerHeightPixel = height/ window.innerHeight
    // Calculate menu item size and selected menu item size
    const menuItemSize = isMobile || isTablet ? 130 : 90 
    const [ menuItemWidth, menuItemHeight ] = [menuItemSize * worldUnitsPerWidthPixel, menuItemSize * worldUnitsPerHeightPixel]


    return (
        <Box 
            ref={meshRef}
            margin={isMobile || isTablet ? 0.05 : 0.03}
            centerAnchor
            key={`placeholder-${index}`}
        >
            <mesh>
                <planeGeometry args={[ menuItemWidth, menuItemHeight ]} />
                <meshBasicMaterial attach="material" color="black" />
            </mesh>
        </Box>
    )
}

export default ProjectsMenuItem