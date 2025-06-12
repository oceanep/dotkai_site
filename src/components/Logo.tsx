import { FC, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, useTexture } from '@react-three/drei'
// import { Group, Mesh } from 'three'
import { useControls } from 'leva'
import { useRouter } from 'next/navigation'

import { CyberButton, } from '~/styles/styled'
import LogoMesh from '../jsx-models/LogoMesh'
import { Group } from 'three/src/objects/Group'
import { Mesh } from 'three/src/objects/Mesh'

const Logo: FC = () => {
  const group = useRef<Group>(null)
  const logo = useRef<Group>(null)
  const boxRef = useRef<Mesh>(null)

  const bgTexture = useTexture('/images/bg_shape.png')
  const subTexture = useTexture('/images/sub_name.png')

  const router = useRouter()

  const { position, color, visible, rotate } = useControls({
    position: {
      value: { x: 0, y: 0 },
      step: 0.1,
      joystick: 'invertY',
    },
    color: '#b383ff',
    visible: true,
    rotate: false,
  })

  useFrame((s, delta) => {
    if (rotate) group.current.rotation.y += delta
    // console.log('logo position: ', logo.current.position)
  })

  return (
    <group ref={group}>
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
        visible={visible}
      >
        <boxGeometry args={[4, 2, 0]} />
        <meshBasicMaterial transparent map={bgTexture} />
      </mesh>
      <Html
        position={[0, -0.5, 0]}
        // occlude="blending"
        receiveShadow
        transform
        distanceFactor={1}
      >
        <CyberButton onClick={() => router.push('/projects')}>
          ENTER
        </CyberButton>
      </Html>
    </group>
  )
}

export default Logo
