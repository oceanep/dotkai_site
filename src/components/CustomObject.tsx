import { FC, useEffect, useMemo, useRef } from "react";
import { BufferGeometry, DoubleSide, Mesh } from "three";

const CustomObject:FC = () => {

    const vertCount = 20 * 3;
    
    const geometryRef = useRef<BufferGeometry>(null!);

    const positions = useMemo(() => {
        const positions = new Float32Array(vertCount * 3);

        for(let i = 0; i < vertCount; i++)
            positions[i] = (Math.random() - 0.5) * 3;

        return positions;
    }, []);

    useEffect(() => {
        geometryRef.current.computeVertexNormals();
    }, [positions]);

    return (
        <mesh>
            <bufferGeometry ref={geometryRef}>
                <bufferAttribute 
                    attach="attributes-position"
                    count={vertCount}
                    itemSize={3}
                    array={positions}
                />
            </bufferGeometry>
            <meshStandardMaterial
                color="red"
                side={DoubleSide}
            />
        </mesh>
    )
};

export default CustomObject;