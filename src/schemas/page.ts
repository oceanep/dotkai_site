import { defineType, defineField, defineArrayMember } from 'sanity';

export default defineType({
    name: 'page',
    title: 'Page',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'secondaryTitle',
            title: 'secondaryTitle',
            type: 'string',
        }),
        defineField({
            name: 'subtitle',
            title: 'Subtitle',
            type: 'string',
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'title',
                maxLength: 96,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'mainText',
            title: 'Main Text',
            type: 'blockContent',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'links',
            type: 'array',
            title: 'Links',
            /*@ts-ignore*/
            of: [
                defineArrayMember({
                    name: 'link',
                    type: 'object',
                    title: 'Link',
                    fields: [
                        defineField({
                            name: 'title',
                            type: 'string',
                            title: 'Title',
                        }),
                        defineField({
                            name: 'url',
                            type: 'url',
                            title: 'URL',
                        }),
                    ],
                }),
            ],
        }),
        defineField({
            name: 'skills',
            type: 'array',
            title: 'Skills',
            /*@ts-ignore*/
            of: [
                defineArrayMember({
                    name: 'skill',
                    type: 'object',
                    title: 'Skill',
                    fields: [
                        defineField({
                            name: 'title',
                            type: 'string',
                            title: 'Title',
                        }),
                    ],
                }),
            ],
        }),
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
                        accept: 'video/mp4',
                    },
                    fields: [
                        defineField({
                            name: 'alt',
                            type: 'string',
                            title: 'Alternative text',
                        }),
                        defineField({
                            name: 'width',
                            type: 'number',
                            title: 'Width',
                            description: 'Width of the video in pixels',
                            validation: Rule => Rule.required(),
                        }),
                        defineField({
                            name: 'height',
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
    ],
    preview: {
        select: {
            title: 'title',
        },
        prepare(selection) {
            const { title } = selection;

            return { ...selection, subtitle: title && `by ${title}`}
        }
    },
});