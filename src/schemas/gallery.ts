import { defineArrayMember, defineField, defineType } from 'sanity'

/**
 * Schema definition for scalable image gallery
 * with options for display styles and other options
 */
export default defineType({
    title: 'Gallery',
    name: 'gallery',
    type: 'object',
    fields: [
        defineField({
            name: 'images',
            type: 'array',
            title: 'Images',
            /*@ts-ignore*/
            of: [
                defineArrayMember({
                    name: 'image',
                    type: 'image',
                    title: 'Image',
                    options: {
                        hotspot: true,
                    },
                    fields: [
                        defineField({
                            name: 'alt',
                            type: 'string',
                            title: 'Alternative text',
                        })
                    ]
                })
            ],
            options: {
                layout: 'grid',
            },
        }),
        defineField({
            name: 'videos',
            type: 'array',
            title: 'Videos',
            /*@ts-ignore*/
            of: [
                defineArrayMember({
                    name: 'video',
                    type: 'file',
                    title: 'Video',
                    options: {
                        accept: 'video/mp4, video/webm',
                    },
                    fields: [
                        defineField({
                            name: 'alt',
                            type: 'string',
                            title: 'Alternative text',
                        }),
                        defineField({
                            name:'width',
                            type: 'number',
                            title: 'Width',
                            description: 'Width of the video in pixels',
                            validation: Rule => Rule.required(),
                        }),
                        defineField({
                            name:'height',
                            type: 'number',
                            title: 'Height',
                            description: 'Height of the video in pixels',
                            validation: Rule => Rule.required(),
                        })
                    ]
                })
            ],
            options: {
                layout: 'grid',
            },
        }),
        defineField({
            name: 'display',
            type: 'string',
            title: 'Display Style',
            description: 'What display arrangement should be used?',
            options: {
                list: [
                    { title: 'Tri-force', value: 'tri' },
                    { title: 'Center', value: 'center' },
                    { title: 'In-line left', value: 'inline-left' },
                    { title: 'In-line right', value: 'inline-right' },
                    { title: 'In-line bottom', value: 'inline-bottom' },
                ],
                layout: 'radio',
            },
        }),
        defineField({
            name: 'zoom',
            type: 'boolean',
            title: 'Zoom enabled',
            description: 'Should zooming be enabled?',
        }),
    ],
    preview: {
        select: {
            images: 'images',
            image: 'images.0',
            videos: 'video',
            video: 'video.0',
        },
        prepare(selection) {
            const { images, image, videos, video } = selection;

            return {
                title: `Gallery of ${Object.keys(images).length + Object.keys(videos).length } project images/videos`,
                subtitle: `Alt text: ${image.alt || video.alt}`,
                media: image || video,
            }
        }
    }
});