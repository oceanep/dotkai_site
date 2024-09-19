import { MeshProps } from "@react-three/fiber";
import React from "react";

const Box:FC<MeshProps> = (props) =>  {
  return (
    <mesh {...props} receiveShadow={true} castShadow>
      <boxGeometry />
      <meshPhysicalMaterial  color={"white"} />
    </mesh>
  );
}
export default Box;