import React from 'react';
import { urlForImage } from '@/lib/sanity.image'
import { Project } from '@/lib/sanity.queries';
import TextCard from '@/components/projectsPage/projectsDisplay/TextCard';
import CustomImage from '@/components/projectsPage/projectsDisplay/CustomImage';
import CustomVideo from '@/components/projectsPage/projectsDisplay/CustomVideo';
import DescCard from './DescCard';

interface ProjectsContentProps {
    selectedProject: Project;
    imgWidth: number;
}

const ProjectsContent: React.FC<ProjectsContentProps> = ({ selectedProject, imgWidth }) => {
    console.log('selectedProject', selectedProject);
    return (
        <>
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
                selectedProject.gallery.images.map((image, i) => (
                    <CustomImage
                        src={image}
                        alt={image.alt}
                        displayType={selectedProject.gallery.display}
                        index={i}
                        width={200}
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
                        width={450}
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
