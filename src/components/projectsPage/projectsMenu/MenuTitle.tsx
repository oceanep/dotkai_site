import React from 'react';
import { MeshProps } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import siteContent from '~/constants/siteContent';

interface MenuTitleProps {
    position: [number, number, number];
    width: number;
    height: number;
    language?: 'en' | 'jp';
}

const MenuTitle: React.FC<MenuTitleProps> = ({
    position,
    width,
    height,
    language = 'en',
}) => {

    const font = siteContent[language].primaryFont
    const { fontSize, title } = siteContent[language].menu
    const { textColor, squareColor, shadowColor, shadowOpacity} = siteContent.colors.menu

    return (
        <group position={position}>
            {/* Mesh for title */}
            <mesh>
                <planeGeometry args={[width, height]} />
                <meshBasicMaterial color={squareColor} />
                <lineSegments position={[0, 0, 0.01]}>
                    <edgesGeometry
                        attach="geometry"
                        args={[new THREE.PlaneGeometry(width, height)]}
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