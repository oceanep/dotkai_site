import React, { useRef } from 'react';
import { Text } from '@react-three/drei';
import siteContent from '~/constants/siteContent';
import { Group, PlaneGeometry, Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';

interface MenuTitleProps {
    position: [number, number, number];
    width: number;
    height: number;
    isProject: boolean;
    language?: 'en' | 'jp';
}

const MenuTitle: React.FC<MenuTitleProps> = ({
    position,
    width,
    height,
    isProject,
    language = 'en',
}) => {

    const font = siteContent[language].primaryFont
    const { fontSize, title } = siteContent[language].menu
    const { textColor, squareColor, shadowColor, shadowOpacity} = siteContent.colors.menu

    const meshRef = useRef<Group | null>(null)

    useFrame((state, delta) => {
        if (meshRef.current) {
            //animate selected state
            //If selection has been made but z position is not at 0.15 lerp
            //If selection has been removed but z position is not at 0 lerp
            const easing = 10 * delta
            if (isProject && meshRef.current.position.z < 0.14999 || !isProject && meshRef.current.position.z > 0.019999) {
                console.log('triggered')
                const targetPosition = new Vector3() 
                const targetShadowPosition = new Vector3(0, 0, 0)

                targetPosition.copy(meshRef.current.position)
                //if selected set z position to 0.15 else set to 0
                //for shadow, reverse the z position
                targetPosition.z = isProject ? 0.15 : 0.01
                targetShadowPosition.z = isProject ? -0.14 : -0.001
                
                meshRef.current.position.lerp(targetPosition, 0.2 * (2 * easing))
                meshRef.current.children[meshRef.current.children.length - 1].position.lerp(targetShadowPosition, 0.2 * (2 * easing));
            }
        }
    })

    return (
        <group
            position={position}
            ref={meshRef}
        >
            {/* Mesh for title */}
            <mesh>
                <planeGeometry args={[width, height]} />
                <meshBasicMaterial color={squareColor} />
                <lineSegments position={[0, 0, 0.01]}>
                    <edgesGeometry
                        attach="geometry"
                        args={[new PlaneGeometry(width, height)]}
                    />
                    <lineBasicMaterial attach="material" color="black" />
                </lineSegments>
            </mesh>
            <Text
                position={[0, - 0.005, 0.001]}
                font={font}
                fontSize={fontSize}
                color={textColor}
                anchorX="center"
                anchorY="middle"
            >
                {title}
            </Text>
            {/* Shadow mesh for title */}
            <mesh position={[0, 0, - 0.14]}>
                <planeGeometry args={[width, height]} />
                <meshBasicMaterial
                    attach="material"
                    depthWrite={false}
                    transparent
                    color={shadowColor}
                    opacity={shadowOpacity}
                />
            </mesh>
        </group>
    );
};

export default MenuTitle;