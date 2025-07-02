import React, { useRef } from 'react';
// import { Group, PlaneGeometry, Vector3 as Vector3Class} from 'three';

import { Text } from '@react-three/drei';
import { ThreeEvent, useFrame, Vector3 } from '@react-three/fiber';
import { ESideMenuItem } from '@/utils/types';
import { Group } from 'three/src/objects/Group';
import { Vector3 as Vector3Class } from 'three/src/math/Vector3';
import { PlaneGeometry } from 'three/src/geometries/PlaneGeometry';

interface SideMenuItemProps {
    slug: ESideMenuItem;
    width: number;
    height: number;
    position: [number, number, number];
    icon: string;
    font: string;
    fontSize: number;
    textColor: string;
    squareColor: string;
    shadowColor: string;
    shadowOpacity: number;
    selected: boolean;
    selectPage: (event: ThreeEvent<MouseEvent>, newSlug: ESideMenuItem) => void
}

const SideMenuItem: React.FC<SideMenuItemProps> = ({
    slug,
    width,
    height,
    position,
    icon,
    font,
    fontSize,
    textColor,
    squareColor,
    shadowColor,
    shadowOpacity,
    selected,
    selectPage
}) => {
    // These are relative to the group position and thus don't need to be calculated
    const topLayerPosition: Vector3 = [0, 0, 0.01];

    // State management
    const [ hover, setHover ] = React.useState(false)
      
    const meshRef = useRef<Group | null>(null)

    useFrame((state, delta) => {
        if (meshRef.current) {
            //animate selected state
            //If selection has been made but z position is not at 0.15 lerp
            //If selection has been removed but z position is not at 0 lerp
            const easing = 40 * delta
            if (selected && meshRef.current.position.z < 0.14999 || !selected && meshRef.current.position.z > 0.019999) {
                
                const targetPosition = new Vector3Class() 
                const targetShadowPosition = new Vector3Class(0, 0, 0)

                targetPosition.copy(meshRef.current.position)
                //if selected set z position to 0.15 else set to 0
                //for shadow, reverse the z position
                targetPosition.z = selected ? 0.15 : 0.01
                targetShadowPosition.z = selected ? -0.14 : -0.001
                meshRef.current.position.lerp(targetPosition, 0.2)
                meshRef.current.children[meshRef.current.children.length - 1].position.lerp(targetShadowPosition, 0.2 * (easing));
            }
            //After lerping, exlcude selected items from hover state/animations
            if (selected) return
            //animate hover state
            if (hover) meshRef.current.scale.lerp({ x: 1.1, y: 1.1, z: 1 }, 0.2 * easing)
            if (!hover) meshRef.current.scale.lerp({ x: 1, y: 1, z: 1 }, 0.2 * easing)
        }
    })

    return (
        <group
            position={position}
            ref={meshRef}
            name='sidemenuitem'
        >
            {/* Border */}
            <lineSegments>
                <edgesGeometry attach="geometry" args={[new PlaneGeometry(width, height)]} />
                <lineBasicMaterial attach="material" color="black" />
            </lineSegments>
            {/* Icon Square */}
            <mesh
                onClick={(e) => {
                    e.stopPropagation()
                    selectPage(e, slug)
                }}
                onPointerOver={(e) => {
                    e.stopPropagation
                    if (selected) return
                    setHover(true)
                }}
                onPointerOut={(e) => {
                    e.stopPropagation
                    if (selected) return
                    setHover(false)
                }}
                position={[0, 0, -0.001]}
            >
                <planeGeometry args={[width, height]} />
                <meshBasicMaterial color={squareColor} />
                {/* <lineSegments position={topLayerPosition}>
                    <edgesGeometry attach="geometry" args={[new PlaneGeometry(width, height)]} />
                    <lineBasicMaterial attach="material" color="black" />
                </lineSegments> */}
            </mesh>
            <Text
                position={topLayerPosition}
                font={font}
                fontSize={fontSize}
                color={textColor}
                anchorX="center"
                anchorY="middle"
            >
                {icon}
            </Text>
            {/* shadow mesh for icon square */}
                <mesh>
                    <planeGeometry args={[width, height]} />
                    <meshBasicMaterial
                        attach="material"
                        depthWrite={false}
                        transparent
                        color={shadowColor}
                        opacity={selected ? shadowOpacity: 0}
                    />
                </mesh>
        </group>
    );
};

export default SideMenuItem;