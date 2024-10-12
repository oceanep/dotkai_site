import { MeshReflectorMaterial } from "@react-three/drei";
import { MeshProps } from "@react-three/fiber";
import React, { FC } from "react";

const Floor:FC<MeshProps>  = (props) => {
    return (
        <mesh {...props} receiveShadow>
            <boxGeometry args={[3, 0.1, 3]}/>
            <MeshReflectorMaterial
                mirror={0.5}
                resolution={512}
                blur={[500,500]}
                mixBlur={0.5}
                color="#e84746"
            />
        </mesh>
    )
};

export default Floor;