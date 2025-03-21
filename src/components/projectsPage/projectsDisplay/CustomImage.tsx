import React from 'react';
import Image from 'next/image';

import { getImageDimensions } from '@sanity/asset-utils';
import { urlForImage } from '~/lib/sanity.image';
import { GalleryDisplay } from '~/lib/sanity.queries';
import { ImageAsset } from 'sanity';

import styles from './ProjectsDisplay.module.scss'

interface CustomImageProps {
    src: ImageAsset;
    alt: string;
    displayType?: GalleryDisplay;
    index?: number;
    width?: number;
    priority?: boolean;
}

const CustomImage: React.FC<CustomImageProps> = ({ src, alt, displayType, index, width = 200, priority = true }) => {
    const url = urlForImage(src).width(width).quality(70).url()
    const blurUrl = urlForImage(src).width(20).format('webp').quality(20).url()
    const { aspectRatio } = getImageDimensions(url)
    const height = Math.round(width / aspectRatio)
    const classString = `${styles['image-wrapper']} ${ index !== undefined ? styles[`item-${index + 1}`] : styles['main-image']} ${styles[displayType]}`;
    return (
        <div className={classString}>
            <Image
                width={width}
                height={height}
                src={url}
                blurDataURL={blurUrl}
                alt={alt}
                priority={priority}
                loader={() => urlForImage(src).width(width).format('webp').quality(70).url()}
            />
        </div>
    );
};

export default CustomImage;