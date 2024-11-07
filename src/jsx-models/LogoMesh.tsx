import { Color, NearestFilter, TextureLoader } from 'three'
import React, { useEffect, useMemo, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { folder, useControls } from 'leva'
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

  const { color, emissionColor, emissionIntensity } = useControls("logo", {
    color: "#f576f5",
    emissionColor: "#f576f5",
    emissionIntensity: {
      min: 0,
      max: 20,
      value: 1
    }
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
            emissive={emissionColor}
            emissiveIntensity={emissionIntensity}
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
            emissive={emissionColor}
            emissiveIntensity={emissionIntensity}
            gradientMap={gradientTexture}
        />
      </mesh>
    </group>
  )
}

useGLTF.preload('/models/Logo Model/ocean_logo.glb')
