import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Leva } from 'leva'
// import { ACESFilmicToneMapping, SRGBColorSpace } from 'three'
import { SceneContainer } from '@/styles/styled'
import EffectPass from '@/components/EffectPass'
// import { ACESFilmicToneMapping, SRGBColorSpace } from 'three/src/constants'

const CanvasWrapper = ({ children, eventSource }) => {
  return (
    <SceneContainer>
      <Leva collapsed />
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{
          antialias: false,
          // toneMapping: ACESFilmicToneMapping,
          // outputColorSpace: SRGBColorSpace,
        }}
        //position for landing had y of 0.5, adjust landing position later
        camera={{
          fov: 45,
          near: 0.1,
          far: 100,
          position: [0, 0, 3.5],
          rotation: [0, 0, 0],
        }}
        eventSource={eventSource}
        eventPrefix="client"
      >
        <Suspense fallback={null}>
            <>
                <EffectPass />
                {children}
            </>
        </Suspense>
      </Canvas>
    </SceneContainer>
  )
}

export default CanvasWrapper
