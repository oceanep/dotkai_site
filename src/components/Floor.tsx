import { MeshProps } from "@react-three/fiber";
import React, { FC } from "react";

const Floor:FC<MeshProps>  = (props) => {
    return (
        <mesh {...props} receiveShadow>
            <boxGeometry args={[3, 0.1, 3]}/>
            <meshPhysicalMaterial color='white' />
        </mesh>
    )
};

export default Floor;