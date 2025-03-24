import React from 'react';
import Image from 'next/image';

import { getImageDimensions } from '@sanity/asset-utils';
import { urlForImage } from '~/lib/sanity.image';
import { GalleryDisplay } from '~/lib/sanity.queries';
import { ImageAsset } from 'sanity';

import styles from './ProjectsDisplay.module.scss'
import TextCard from './TextCard';

interface CustomImageProps {
    src: ImageAsset;
    alt: string;
    displayType?: GalleryDisplay;
    index?: number;
    width?: number;
    priority?: boolean;
    label?: string;
}

const CustomImage: React.FC<CustomImageProps> = ({ src, alt, displayType, index, width = 200, priority = true, label }) => {
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
            {label && (
                //modulos the index to flip the position offset of the text card
                <TextCard text={label} flip={!(index%2) || false}/>
            )}
        </div>
    );
};

export default CustomImage;