import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshBasicMaterial } from 'three';

interface PanelProps {
    position: [number, number, number];
    rotation: [number, number, number];
    width: number;
    height: number;
}

const PanelSkeleton: React.FC<PanelProps> = ({ position, rotation, width, height }) => {
    const materialRef = useRef<MeshBasicMaterial>(null);
    let increasing = true;

    useFrame(() => {
        if (materialRef.current) {
            const currentOpacity = materialRef.current.opacity;
            if (increasing) {
                materialRef.current.opacity = Math.min(currentOpacity + 0.01, 0.5);
                if (materialRef.current.opacity >= 0.5) increasing = false;
            } else {
                materialRef.current.opacity = Math.max(currentOpacity - 0.01, 0.1);
                if (materialRef.current.opacity <= 0.1) increasing = true;
            }
        }
    });

    return (
        <mesh position={position} rotation={rotation}>
            <planeGeometry args={[width, height]} />
            <meshBasicMaterial
                ref={materialRef}
                color="#aaaaaa"
                transparent
                opacity={0.5}
            />
        </mesh>
    );
};

export default PanelSkeleton;