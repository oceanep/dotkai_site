import React from 'react';

interface PanelProps {
    position: [number, number, number];
    rotation: [number, number, number];
    width: number;
    height: number;
}

const PanelSkeleton: React.FC<PanelProps> = ({ position, rotation, width, height }) => {
    return (
        <mesh position={position} rotation={rotation}>
            <planeGeometry args={[width, height]} />
            <meshBasicMaterial color="#838383" transparent opacity={0.5} />
        </mesh>
    );
};

export default PanelSkeleton;