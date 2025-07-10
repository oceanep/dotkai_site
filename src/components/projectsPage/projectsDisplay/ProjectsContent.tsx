import React from 'react';
import { urlForImage } from '@/lib/sanity.image'
import { Project } from '@/lib/sanity.queries';
import TextCard from '@/components/projectsPage/projectsDisplay/TextCard';
import CustomImage from '@/components/projectsPage/projectsDisplay/CustomImage';
import CustomVideo from '@/components/projectsPage/projectsDisplay/CustomVideo';
import DescCard from '@/components/projectsPage/projectsDisplay/DescCard';
import { Language } from '@/utils/types';

interface ProjectsContentProps {
    selectedProject: Project;
    imgWidth: number;
    language: Language;
}

const ProjectsContent: React.FC<ProjectsContentProps> = ({ selectedProject, imgWidth, language = 'en' }) => {
    return (
        <>
            <TextCard
                text={selectedProject.title[language].toUpperCase()}
                isTitle
            />
            <CustomImage
                src={selectedProject.mainImage}
                alt={selectedProject.title[language]}
                width={imgWidth}
            />
            <DescCard text={selectedProject.desc[language]} />
            {selectedProject.gallery.images?.length > 0 &&
                selectedProject.gallery.images.map((image, i) => (
                    <CustomImage
                        src={image}
                        alt={image.alt}
                        displayType={selectedProject.gallery.display}
                        index={i}
                        width={image.metadata.dimensions.width > image.metadata.dimensions.height ? 300 : 200}
                        key={`${image._key}-${i}`}
                        label={image.alt}
                    />
                ))
            }
            {selectedProject.gallery.videos?.length > 0 &&
                selectedProject.gallery.videos.map((video, i) => (
                    <CustomVideo
                        video={video}
                        fallback={urlForImage(selectedProject.mainImage).width(20).format('webp').quality(20).url()}
                        width={video?.height > video?.width ? 250 : 350}
                        imgArrLength={selectedProject.gallery.images?.length || 0}
                        displayType={selectedProject.gallery.display}
                        index={i}
                        key={`${video._key}-${i}`}
                        label={video.alt}
                    />
                ))
            }
        </>
    );
};

export default ProjectsContent;
