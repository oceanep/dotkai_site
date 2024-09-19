import React, { FC } from "react";
import { extend, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

const Controls:FC<{active: boolean}> = ({active}) => {
  const { camera, gl } = useThree();
  return (
    <OrbitControls 
      camera={camera} 
      domElement={gl.domElement} 
      enableRotate={active}
    />
  );
}

export default Controls;