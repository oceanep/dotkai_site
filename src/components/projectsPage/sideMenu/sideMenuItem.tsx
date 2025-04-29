import React from 'react';
import { PlaneGeometry } from 'three';
import { Text } from '@react-three/drei';
import { Vector3 } from '@react-three/fiber';

interface SideMenuItemProps {
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
}

const SideMenuItem: React.FC<SideMenuItemProps> = ({
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
}) => {
    const topLayerPosition: Vector3 = [0, 0, 0.01];
    const shadowPosition: Vector3 = [0, 0, - 0.14];

    console.log({
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
        topLayerPosition,
        shadowPosition
    });

    return (
        <group position={position}>
            {/* Icon Square */}
            <mesh>
                <planeGeometry args={[width, height]} />
                <meshBasicMaterial color={squareColor} />
                <lineSegments position={topLayerPosition}>
                    <edgesGeometry attach="geometry" args={[new PlaneGeometry(width, height)]} />
                    <lineBasicMaterial attach="material" color="black" />
                </lineSegments>
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
            <mesh position={shadowPosition}>
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

export default SideMenuItem;