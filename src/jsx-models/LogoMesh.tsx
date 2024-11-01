import { NearestFilter, TextureLoader } from 'three'
import React, { useEffect, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { useControls } from 'leva'
import { useLoader } from '@react-three/fiber'
import { GLTFResult } from '~/utils/types'

export default function OceanLogo(props: JSX.IntrinsicElements['group']) {
  const fileUrl = "/models/Logo Model/ocean_logo.glb";
  const textureUrl = "/textures/gradients/3.jpg";
  const { nodes, materials } = useGLTF(fileUrl) as GLTFResult

  const gradientTexture = useLoader(TextureLoader, textureUrl);

  useEffect(() => {
    if (gradientTexture.minFilter && gradientTexture.magFilter) {
        gradientTexture.magFilter = NearestFilter
        gradientTexture.minFilter = NearestFilter
        gradientTexture.generateMipmaps = false
    }

  }, [gradientTexture]);

  const { color } = useControls("logo", {
    color: "#f576f5"
  })

  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Ocean_Mesh.geometry}
      >
        <meshToonMaterial
            attach="material"
            color={color}
            gradientMap={gradientTexture}
            
        />
      </mesh>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.everspeete_mesh.geometry}
        material={materials.ChromeType}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.T_mesh.geometry}
      >
        <meshToonMaterial
            attach="material"
            color={color}
            gradientMap={gradientTexture}
        />
      </mesh>
    </group>
  )
}

useGLTF.preload('/models/Logo Model/ocean_logo.glb')
