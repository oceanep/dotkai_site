import { MeshProps } from "@react-three/fiber";
import React, { FC } from "react";

const LightBulb:FC<MeshProps> = (props) => {
  return (
    <mesh {...props} >
      <pointLight castShadow />
      <sphereGeometry args={[0.2, 30, 10]} />
      <meshPhongMaterial emissive={"yellow"}  />
    </mesh>
  );
}

export default LightBulb;