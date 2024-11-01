import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTFResult } from '~/utils/types'

export function DigiviceMesh(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF('/digivice.glb') as GLTFResult

  return (
    <group {...props} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]} scale={10}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Digivice_Body_Lights_0.geometry}
          material={materials.Lights}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Digivice_Body_Body_0.geometry}
          material={materials.Body}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Digivice_Body_Screen_0.geometry}
          material={materials.Screen}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Digivice_Body_Screen_Corner_0.geometry}
          material={materials.Screen_Corner}
        />
      </group>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Buttons_Buttons_0.geometry}
        material={materials.Buttons}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={0.1}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Antenna_Antenna_0.geometry}
        material={materials.Antenna}
        rotation={[-Math.PI, -Math.PI / 6, 0]}
        scale={0.1}
      />
    </group>
  )
}

useGLTF.preload('/models/digivice.glb')