import { Html, useTexture } from '@react-three/drei'
import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import { Suspense } from 'react'
import { getImageDimensions } from '@sanity/asset-utils'
import { urlForImage } from '~/lib/sanity.image'
import styles from './ProjectsDisplay.module.scss'
import { Project } from '~/lib/sanity.queries'
import { customMarks } from '~/components/portableText/CustomMarks'
import LabledImage from '~/components/projectsPage/projectsDisplay/CustomImage'
import CustomImage from '~/components/projectsPage/projectsDisplay/CustomImage'
import CustomVideo from './CustomVideo'

interface ProjectsDisplayProps {
  width: number
  height: number
  selectedProject: Project
  imgWidth: number
}

const ProjectsDisplay = ({
  width,
  height,
  selectedProject,
  imgWidth,
}: ProjectsDisplayProps) => {
    const bgTexture = useTexture('/images/Display-0_93 aspect ratio.png')
    return (
        <group>
            <mesh
                position={[0.9, .5, 0]}
                rotation={[0, - Math.PI / 18, 0]}
            >
                <planeGeometry args={[width * 0.5, height * 0.9]} />
                <meshBasicMaterial attach="material" transparent map={bgTexture} />
                <Html
                    wrapperClass={styles['html-content']}
                    transform 
                    distanceFactor={1}
                >
                    <div className={styles['preview-wrapper']}>
                        <div className={styles['grid']}>
                            <div className={styles['title-wrapper']}>
                                <div className={styles['title-card']}>
                                    <h1>{selectedProject.title.toUpperCase()}</h1>
                                </div>
                            </div>
                            <CustomImage
                                src={selectedProject.mainImage}
                                alt={selectedProject.title}
                                width={imgWidth}
                            />
                            <div className={styles['description-wrapper']}>
                                <div className={styles['description-card']}>
                                    <PortableText value={selectedProject.desc} components={customMarks} />
                                </div>
                            </div>
                            {selectedProject.gallery.images?.length > 0 &&
                                selectedProject.gallery.images.map((image, i) => 
                                    <CustomImage
                                        src={image}
                                        alt={image.alt}
                                        displayType={selectedProject.gallery.display}
                                        index={i}
                                        width={200}
                                        key={`${image._key}-${i}`}
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
