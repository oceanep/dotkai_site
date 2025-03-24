import React from 'react';

import { VideoAsset } from '~/lib/sanity.queries';

import styles from './ProjectsDisplay.module.scss'
import TextCard from './TextCard';

export interface CustomVideoProps {
    video: VideoAsset,
    fallback: string,
    width?: number
    imgArrLength?: number,
    displayType?: string,
    index?: number
    label?: string;
}

const CustomVideo: React.FC<CustomVideoProps> = ({ video, fallback, width, index, imgArrLength, displayType, label }) => {
    const vidAspectRatio = Number(video.width) / Number(video.height)
    const vidWidth = width ? width * vidAspectRatio : video.width
    const classString = `${styles['video-wrapper']} ${ index !== undefined && styles[`item-${imgArrLength + index + 1}`]} ${styles[displayType]}`
    return (
        <div className={classString}>
            <video
                muted
                autoPlay
                loop
                preload='auto'
                playsInline
                poster={fallback}
                width={vidWidth}
                src={video.url}
            />
            {label && (
                //modulos the index to flip the position offset of the text card
                <TextCard text={label} flip={!!(index%2) || false}/>
            )}
        </div>
    );
};

export default CustomVideo;