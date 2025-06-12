import { Html, useProgress, useTexture } from '@react-three/drei'

import styles from './ProjectsDisplay.module.scss'
import { Euler, useThree, Vector3 } from '@react-three/fiber'
import { forwardRef, Suspense } from 'react'
import { useMediaQuery } from '@/utils/hooks'
import { EMediaType } from '@/utils/types'
import { Mesh } from 'three/src/objects/Mesh'

interface ProjectsDisplayProps {
  width: number
  height: number
  position: Vector3
  rotation: Euler
  backClick: React.MouseEventHandler<HTMLDivElement>
  children: React.ReactNode
}

const ProjectsDisplay = forwardRef<Mesh, ProjectsDisplayProps>(({
  width,
  height,
  position,
  rotation,
  backClick,
  children,
}, ref) => {
    const bgTexture = useTexture('/images/Display-0_93 aspect ratio.png')
    const { size } = useThree()
    const refHeight = 915
    const scaleFactor = (refHeight / size.height) * .1
    // const isMobile = useMediaQuery(EMediaType.SMARTPHONE)
    // const { progress } = useProgress();
    return (
        <group>
            <mesh
                // position={[0.9, .5, 0]}
                position={position}
                rotation={rotation}
                ref={ref}
            >
                <planeGeometry
                    // args={[width * 0.5, height * 0.9]} 
                    args={[width, height]} 
                />
                <meshBasicMaterial attach="material" color="grey" map={bgTexture} />
                {/* <Html
                    wrapperClass={styles['html-content']}
                    transform 
                    // distanceFactor={1}
                    scale={scaleFactor}
                    style={{ opacity: progress < 100 ? 0 : 1, transition: 'opacity 1s ease-in-out' }}
                >
                    <div className={styles['preview-wrapper']}>
                        <div className={styles['grid']}>
                            {isMobile && (
                                <div
                                    className={`${styles['mobileBackButton']} ${styles['crt-text']}`}
                                    onClick={backClick}
                                >
                                    {`<`}
                                </div>
                            )}
                            <Suspense fallback={null}>
                                {children}
                            </Suspense>
                        </div>
                    </div>
                </Html> */}
            </mesh>
        </group>
    )
})

ProjectsDisplay.displayName = 'ProjectsDisplay'
export default ProjectsDisplay
