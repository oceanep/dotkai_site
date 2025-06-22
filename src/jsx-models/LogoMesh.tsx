import { Group, NearestFilter, TextureLoader } from 'three'
import React, { forwardRef, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import { GroupProps, useLoader } from '@react-three/fiber'
import { GLTFResult } from '~/utils/types'

type LogoMeshProps = JSX.IntrinsicElements['group'] & GroupProps

const LogoMesh = forwardRef<Group, LogoMeshProps>(
  (props, ref: React.MutableRefObject<Group | null>) => {
    const fileUrl = '/models/Logo Model/ocean_logo.glb'
    const textureUrl = '/textures/gradients/3.jpg'
    const { nodes, materials } = useGLTF(fileUrl) as GLTFResult

    const gradientTexture = useLoader(TextureLoader, textureUrl)

    //For Toon shader
    useEffect(() => {
      if (gradientTexture.minFilter && gradientTexture.magFilter) {
        gradientTexture.magFilter = NearestFilter
        gradientTexture.minFilter = NearestFilter
        gradientTexture.generateMipmaps = false
      }
    }, [gradientTexture])

    return (
      <group {...props} dispose={null} ref={ref}>
        <mesh castShadow receiveShadow geometry={nodes.Ocean_Mesh.geometry}>
          <meshToonMaterial
            attach="material"
            color={'#f576f5'}
            emissive={'#f576f5'}
            emissiveIntensity={1}
            gradientMap={gradientTexture}
          />
        </mesh>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.everspeete_mesh.geometry}
          material={materials.ChromeType}
        />
        <mesh castShadow receiveShadow geometry={nodes.T_mesh.geometry}>
          <meshToonMaterial
            attach="material"
            color={'#f576f5'}
            emissive={'#f576f5'}
            emissiveIntensity={1}
            gradientMap={gradientTexture}
          />
        </mesh>
      </group>
    )
  },
)
LogoMesh.displayName = 'Logo Mesh'
useGLTF.preload('/models/Logo Model/ocean_logo.glb')

export default LogoMesh
