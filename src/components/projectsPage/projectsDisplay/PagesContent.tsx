import React from 'react';
import { Page } from '@/lib/sanity.queries';
import { useMediaQuery } from '@/utils/hooks';
import { EMediaType } from '@/utils/types';
import TextCard from '@/components/projectsPage/projectsDisplay/TextCard';
import CustomImage from '@/components/projectsPage/projectsDisplay/CustomImage';
import CustomVideo from '@/components/projectsPage/projectsDisplay/CustomVideo';
import DescCard from '@/components/projectsPage/projectsDisplay/DescCard';
import ListCard from '@/components/projectsPage/projectsDisplay/ListCard';
import styles from './ProjectsDisplay.module.scss';

interface PagesContentProps {
    selectedPage: Page;
    imgWidth?: number
}

const PagesContent: React.FC<PagesContentProps> = ({ selectedPage, imgWidth = 250 }) => {
    //Media queries
    const isMobile = useMediaQuery(EMediaType.SMARTPHONE)
    
    return (
        <>
            <TextCard
                text={selectedPage?.title.toUpperCase()}
                isTitle
            />
            {selectedPage?.mainImage && (
                <CustomImage
                    src={selectedPage.mainImage}
                    alt={selectedPage.title}
                    width={imgWidth}
                />
            )}
            {selectedPage?.secondaryTitle || selectedPage?.subtitle 
                ?   
                    <div className={`${styles['titledDesc-wrapper']} ${!selectedPage?.mainImage ? styles['no-image'] : ''}`}>
                        {selectedPage?.secondaryTitle && (
                            <TextCard
                                text={selectedPage.secondaryTitle}
                                isSecondaryTitle
                                flip
                            />
                        )}
                        {selectedPage?.subtitle && (
                            <TextCard
                                text={selectedPage.subtitle}
                                isSubtitle
                            />
                        )}
                        <DescCard
                            text={selectedPage.mainText}
                            noImage={!selectedPage?.mainImage}
                        />
                    </div>
                : 
                    <DescCard
                        text={selectedPage.mainText}
                        noImage={!selectedPage?.mainImage}
                    />
            }
            {selectedPage.links?.length && (
                <div className={`${styles['item-1']} ${styles['inline-left']}`}>
                    <ListCard 
                        title="Relevant links"
                        list={selectedPage.links}
                    />
                </div>
            )}
            {selectedPage.skills?.length && (
                <div
                    className={`${styles['item-2']} ${styles['inline-right']}`}
                    style={{ marginTop: isMobile ? '0px' : '140px', zIndex: 10 }}
                >
                    <ListCard
                        title="Skills"
                        list={selectedPage.skills}
                    />
                </div>
            )}
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
                        width={isMobile ? 225 : 450}
                        imgArrLength={selectedPage.images?.length || 0}
                        index={i + 2}
                        displayType='center'
                        key={`${video._key}-${i}`}
                        label={video.alt}
                    />
                ))
            }
        </>
    );
};

export default PagesContent;