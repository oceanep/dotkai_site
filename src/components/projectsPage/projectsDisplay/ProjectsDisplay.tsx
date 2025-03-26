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
import { Euler, Vector3 } from '@react-three/fiber'

interface ProjectsDisplayProps {
  width: number
  height: number
  position: Vector3
  rotation: Euler
  selectedProject: Project
  imgWidth: number
}

const ProjectsDisplay: React.FC<ProjectsDisplayProps> = ({
  width,
  height,
  position,
  rotation,
  selectedProject,
  imgWidth,
}) => {
    const bgTexture = useTexture('/images/Display-0_93 aspect ratio.png')
    return (
        <group>
            <mesh
                // position={[0.9, .5, 0]}
                position={position}
                rotation={rotation}
            >
                <planeGeometry
                    // args={[width * 0.5, height * 0.9]} 
                    args={[width, height]} 
                />
                <meshBasicMaterial attach="material" transparent map={bgTexture} />
                <Html
                    wrapperClass={styles['html-content']}
                    transform 
                    distanceFactor={1}
                >
                    <div className={styles['preview-wrapper']}>
                        <div className={styles['grid']}>
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
}

export default ProjectsDisplay
