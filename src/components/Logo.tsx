import { FC, useRef } from 'react'
import { Html, useTexture } from '@react-three/drei'
import { useRouter } from 'next/navigation'

import { CyberButton, } from '~/styles/styled'
import LogoMesh from '@/jsx-models/LogoMesh'
import { Group } from 'three/src/objects/Group'
import { Mesh } from 'three/src/objects/Mesh'
import { useMediaQuery } from '~/utils/hooks'

import { EMediaType } from '~/utils/types'

const Logo: FC = () => {
  const group = useRef<Group>(null)
  const logo = useRef<Group>(null)
  const boxRef = useRef<Mesh>(null)

  const bgTexture = useTexture('/images/bg_shape.png')
  const subTexture = useTexture('/images/sub_name.png')

  const router = useRouter()

  const isMobile = useMediaQuery(EMediaType.SMARTPHONE)
  const isTablet = useMediaQuery(EMediaType.TABLET)

  return (
    <group
      ref={group}
      position={
        isMobile || isTablet
        ? [0, 0.25, 0]
        : [0, 0, 0]
      }
    >
      <LogoMesh ref={logo} position-y={-0.5} />
      <mesh position={[-0.7, 0, -0.15]} scale={1.4}>
        <boxGeometry args={[0.5, 0.11, 0]} />
        <meshBasicMaterial transparent map={subTexture} />
      </mesh>
      <mesh
        ref={boxRef}
        position-y={0}
        position-z={-0.8}
        scale={0.8}
      >
        <boxGeometry args={[4, 2, 0]} />
        <meshBasicMaterial transparent map={bgTexture} />
      </mesh>
      <Html
        position={ 
          isMobile || isTablet 
            ? [0, -0.75, 0]
            : [0, -0.5, 0]}
        transform
        distanceFactor={1}
      >
        <CyberButton
          $mobile={isMobile || isTablet ? 1 : 0}
          onClick={() => router.push('/projects')}
        >
          ENTER
        </CyberButton>
      </Html>
    </group>
  )
}

export default Logo
