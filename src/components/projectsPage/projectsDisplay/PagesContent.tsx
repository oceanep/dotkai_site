import React from 'react';
import TextCard from './TextCard';
import CustomImage from './CustomImage';
import CustomVideo from './CustomVideo';
import { urlForImage } from '~/lib/sanity.image'
import { Page } from '~/lib/sanity.queries';
import DescCard from './DescCard';

interface PagesContentProps {
    selectedPage: Page;
    imgWidth?: number
}

const PagesContent: React.FC<PagesContentProps> = ({ selectedPage, imgWidth = 250 }) => {
    return (
        <>
            <TextCard
                text={selectedPage.title.toUpperCase()}
                isTitle
            />
            {selectedPage?.mainImage && (
                <CustomImage
                    src={selectedPage.mainImage}
                    alt={selectedPage.title}
                    width={imgWidth}
                />
            )}
            <DescCard text={selectedPage.mainText} />
            {selectedPage.images?.length > 0 &&
                selectedPage.images.map((image, i) => (
                    <CustomImage
                        src={image}
                        alt={image.alt}
                        index={i}
                        width={200}
                        key={`${image._key}-${i}`}
                        label={image.alt}
                    />
                ))
            }
            {selectedPage.videos?.length > 0 &&
                selectedPage.videos.map((video, i) => (
                    <CustomVideo
                        video={video}
                        fallback={"loading"}
                        controls
                        width={450}
                        imgArrLength={selectedPage.images?.length || 0}
                        index={i}
                        key={`${video._key}-${i}`}
                        label={video.alt}
                    />
                ))
            }
        </>
    );
};

export default PagesContent;