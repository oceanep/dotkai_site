import { Html } from '@react-three/drei'
import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import { Suspense } from 'react'
import { getImageDimensions } from '@sanity/asset-utils'
import { urlForImage } from '~/lib/sanity.image'
import styles from './ProjectsDisplay.module.scss'
import { Project } from '~/lib/sanity.queries'
import { customMarks } from '~/components/portableText/CustomMarks'

interface ProjectsDisplayProps {
  width: number
  height: number
  selectedProject: Project
  imgWidth: number
  imgHeight: number
  imageUrl: string
  blurImageUrl: string
  displayType: string
}

const ProjectsDisplay = ({
  width,
  height,
  selectedProject,
  imgWidth,
  imgHeight,
  imageUrl,
  blurImageUrl,
  displayType
}: ProjectsDisplayProps) => {
  return (
    <group>
      <mesh position={[0.9, .5, 0]}>
        <planeGeometry args={[width * 0.5, height * 0.9]} />
        <meshBasicMaterial attach="material" transparent wireframe />
        <Html wrapperClass={styles['html-content']} transform distanceFactor={1}>
          <div className={styles['preview-wrapper']}>
            <div className={styles['grid']}>
              <div className={styles['title-wrapper']}>
                <div className={styles['title-card']}>
                  <h1>{selectedProject.title.toUpperCase()}</h1>
                </div>
              </div>
              <div className={`${styles['image-wrapper']} ${styles['main-image']}`}>
                <Image
                  width={imgWidth}
                  height={imgHeight}
                  src={imageUrl}
                  blurDataURL={blurImageUrl}
                  alt={selectedProject.title}
                  priority
                  loader={() => urlForImage(selectedProject.mainImage).width(200).format('webp').quality(70).url()}
                />
              </div>
              <div className={styles['description-wrapper']}>
                <div className={styles['description-card']}>
                  <PortableText value={selectedProject.desc} components={customMarks} />
                </div>
              </div>
              {selectedProject.gallery.images?.length > 0 &&
                selectedProject.gallery.images.map((image, i) => {
                  const width = 200
                  const url = urlForImage(image).width(width).quality(70).url()
                  const blurUrl = urlForImage(image).width(20).format('webp').quality(20).url()
                  const { aspectRatio } = getImageDimensions(url)
                  const height = Math.round(width / aspectRatio)
                  return (
                    <div className={`${styles['image-wrapper']} ${styles[`item-${i + 1}`]} ${styles[displayType]}`} key={`${image._key}-${i}`}>
                      <Image
                        width={width}
                        height={height}
                        src={url}
                        blurDataURL={blurUrl}
                        alt={selectedProject.title}
                        priority
                        loader={() => urlForImage(image).width(width).format('webp').quality(70).url()}
                      />
                    </div>
                  )
                })
              }
              {selectedProject.gallery.videos?.length > 0 &&
                selectedProject.gallery.videos.map((video, i) => {
                  const vidAspectRatio = Number(video.width) / Number(video.height)
                  const vidWidth = 450 * vidAspectRatio
                  const imgArrLength = selectedProject.gallery.images.length
                  return (
                    <div className={`${styles['video-wrapper']} ${styles[`item-${imgArrLength + i + 1}`]} ${styles[displayType]}`} key={`${video._key}-${i}`}>
                      <Suspense fallback={<div>Loading...</div>}>
                        <video
                          muted
                          autoPlay
                          loop
                          preload='auto'
                          playsInline
                          poster={blurImageUrl}
                          width={vidWidth}
                          src={video.url}
                        />
                      </Suspense>
                    </div>
                  )
                })
              }
            </div>
          </div>
        </Html>
      </mesh>
    </group>
  )
}

export default ProjectsDisplay
