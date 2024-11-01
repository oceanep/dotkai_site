
import React, { useRef, useMemo, useContext, createContext } from 'react'
import { Merged, useGLTF } from '@react-three/drei'
import { GLTFResult } from '~/utils/types'

const context = createContext(undefined)
export function Instances({ children, ...props }) {
  const { nodes } = useGLTF('/models/digivice.glb') as GLTFResult
  const instances = useMemo(
    () => ({
      DigiviceBodyLights: nodes.Digivice_Body_Lights_0,
      DigiviceBodyBody: nodes.Digivice_Body_Body_0,
      DigiviceBodyScreen: nodes.Digivice_Body_Screen_0,
      DigiviceBodyScreenCorner: nodes.Digivice_Body_Screen_Corner_0,
      ButtonsButtons: nodes.Buttons_Buttons_0,
      AntennaAntenna: nodes.Antenna_Antenna_0,
    }),
    [nodes]
  )
  return (
    <Merged meshes={instances} {...props}>
      {(instances) => <context.Provider value={instances} children={children} />}
    </Merged>
  )
}

export function DigiviceMesh(props: JSX.IntrinsicElements['group']) {
  const instances = useContext(context)
  return (
    <group {...props} dispose={null} scale={0.0002}>
      <group rotation={[-Math.PI / 2, 0, 0]} scale={10}>
        <instances.DigiviceBodyLights />
        <instances.DigiviceBodyBody />
        <instances.DigiviceBodyScreen />
        <instances.DigiviceBodyScreenCorner />
      </group>
      <instances.ButtonsButtons rotation={[-Math.PI / 2, 0, 0]} scale={0.1} />
      <instances.AntennaAntenna rotation={[-Math.PI, -Math.PI / 6, 0]} scale={0.1} />
    </group>
  )
}

useGLTF.preload('/models/digivice.glb')