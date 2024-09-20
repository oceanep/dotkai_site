import React, { FC } from "react";
import { MeshProps, useLoader } from "@react-three/fiber";
import { Mesh, TextureLoader } from "three";

interface BoxProps {
    rotateX: number; 
    rotateY: number;
}

const Box:FC<BoxProps> = ({rotateX, rotateY}) => {
    const basePath = "/PavingStones092_1K-JPG/"
    const [ colorMap, normalMap, roughnessMap, aoMap ] = useLoader(TextureLoader, [
        basePath + 'PavingStones092_1K-JPG_Color.jpg',
        basePath + 'PavingStones092_1K-JPG_NormalGL.jpg',
        basePath + 'PavingStones092_1K-JPG_Roughness.jpg',
        basePath + 'PavingStones092_1K-JPG_AmbientOcclusion.jpg'
    ])
    return (
        <mesh rotation={[rotateX, rotateY, 0]} receiveShadow={true} castShadow>
            <boxGeometry args={[1,1,1]}/>
            <meshPhysicalMaterial
                map={colorMap}
                normalMap={normalMap}
                roughnessMap={roughnessMap}
                aoMap={aoMap}
            />
        </mesh>
    );
}
export default Box;