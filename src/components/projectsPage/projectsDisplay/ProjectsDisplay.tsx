import { Html, useTexture } from '@react-three/drei'
import { PortableText } from '@portabletext/react'

import { urlForImage } from '~/lib/sanity.image'
import { Project } from '~/lib/sanity.queries'

import { customMarks } from '~/components/portableText/CustomMarks'
import CustomImage from './CustomImage'
import CustomVideo from './CustomVideo'
import TextCard from './TextCard'

import styles from './ProjectsDisplay.module.scss'
import DescCard from './DescCard'
import { Euler, useThree, Vector3 } from '@react-three/fiber'
import { forwardRef } from 'react'
import { Mesh } from 'three'
import { useMediaQuery } from '~/utils/hooks'
import { EMEdiaType } from '~/utils/types'

interface ProjectsDisplayProps {
  width: number
  height: number
  position: Vector3
  rotation: Euler
  selectedProject: Project
  backClick: React.MouseEventHandler<HTMLDivElement>
  imgWidth: number
}

const ProjectsDisplay = forwardRef<Mesh, ProjectsDisplayProps>(({
  width,
  height,
  position,
  rotation,
  selectedProject,
  backClick,
  imgWidth,
}, ref) => {
    const bgTexture = useTexture('/images/Display-0_93 aspect ratio.png')
    const { size } = useThree()
    const refHeight = 915
    const scaleFactor = (refHeight / size.height) * .1
    const isMobile = useMediaQuery(EMEdiaType.SMARTPHONE)
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
                <meshBasicMaterial attach="material" transparent map={bgTexture} />
                <Html
                    wrapperClass={styles['html-content']}
                    transform 
                    // distanceFactor={1}
                    scale={scaleFactor}
                    
                >
                    <div className={styles['preview-wrapper']}>
                        <div className={styles['grid']}>
                            {isMobile && (
                                <div
                                    className={styles['mobileBackButton']}
                                    onClick={backClick}
                                >
                                    {`<`}
                                </div>
                            )}
                            <TextCard
                                text={selectedProject.title.toUpperCase()}
                                isTitle
                            />
                            <CustomImage
                                src={selectedProject.mainImage}
                                alt={selectedProject.title}
                                width={imgWidth}
                            />
                            <DescCard text={selectedProject.desc} />
                            {selectedProject.gallery.images?.length > 0 &&
                                selectedProject.gallery.images.map((image, i) => 
                                    <CustomImage
                                        src={image}
                                        alt={image.alt}
                                        displayType={selectedProject.gallery.display}
                                        index={i}
                                        width={200}
                                        key={`${image._key}-${i}`}
                                        label={image.alt}
                                    />
                                )
                            }
                            {selectedProject.gallery.videos?.length > 0 &&
                                selectedProject.gallery.videos.map((video, i) => 
                                    <CustomVideo
                                        video={video}
                                        fallback={urlForImage(selectedProject.mainImage).width(20).format('webp').quality(20).url()}
                                        width={450}
                                        imgArrLength={selectedProject.gallery.images.length}
                                        displayType={selectedProject.gallery.display}
                                        index={i}
                                        key={`${video._key}-${i}`}
                                        label={video.alt}
                                    />
                                )
                            }
                        </div>
                    </div>
                </Html>
            </mesh>
        </group>
    )
})

export default ProjectsDisplay
