import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { SceneContainer } from '@/styles/styled'
import { ACESFilmicToneMapping, SRGBColorSpace } from 'three/src/constants'
import SceneFoundation from '../SceneFoundation'
import { getMobilePlatform } from '~/utils'

interface CanvasProps {
  children: React.ReactNode;
  initialLoad?: boolean;
  eventSource?: React.RefObject<HTMLElement | null>;
}

const CanvasWrapper = ({ children, eventSource }: CanvasProps) => {  
  const [height, setHeight] = useState("100%");
  const [width, setWidth] = useState("100%");

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef(null);
  const { isIOS } = getMobilePlatform()
  
  useEffect(() => {
    if (!canvasRef.current || !isIOS) return
    const canvasElement = canvasRef.current as HTMLCanvasElement | null;

    const measureCanvasDimensions = () => {
      const canvasHeight = canvasElement.clientHeight;
      const canvasWidth = canvasElement.clientWidth;

      // Iphone Safari has an issue with transform 3Ds 
      // Canvas height HAS to be even or interactivity box misaligns with screen
      if (isIOS && canvasHeight % 2 !== 0) {
        setHeight(`${canvasHeight - 1}px`);
      }
      if (isIOS && canvasWidth % 2 !== 0) {
        setWidth(`${canvasWidth - 1}px`);
      }
    };

    const handleResize = () => {
      window.requestAnimationFrame(measureCanvasDimensions);
    };

    if (isIOS) {
      // Trigger initial measurement after layout stabilizes
      requestAnimationFrame(() => {
        requestAnimationFrame(handleResize);
      });
      
      window.addEventListener("resize", handleResize);
      window.visualViewport?.addEventListener('resize', handleResize)
      return () => {
        window.removeEventListener("resize", handleResize);
        window.visualViewport?.removeEventListener('resize', handleResize)
      };
    }
  }, [isIOS, setHeight, setWidth]);

  return (
    <SceneContainer ref={containerRef}>
      <Canvas
        ref={canvasRef}
        shadows
        dpr={[1, 2]}
        gl={{
          antialias: false,
          toneMapping: ACESFilmicToneMapping,
          outputColorSpace: SRGBColorSpace,
          localClippingEnabled: true
        }}
        //position for landing had y of 0.5, adjust landing position later
        camera={{
          fov: 45,
          near: 0.1,
          far: 100,
          position: [0, 0, 3.5],
          rotation: [0, 0, 0],
        }}
        style={{ width: width, height: height }}
        resize={{ scroll: false, offsetSize: true }}
        eventSource={eventSource}
        eventPrefix="client"
      >
        <Suspense fallback={null}>
            <>
              <SceneFoundation/>
              {children}
            </>
        </Suspense>
      </Canvas>
    </SceneContainer>
  )
}

export default CanvasWrapper
