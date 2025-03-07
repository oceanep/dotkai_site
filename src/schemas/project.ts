import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'project',
    title: 'Project',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Project Title',
            type: 'string'
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            validation: (Rule) => Rule.required(),
            options: {
                source: 'title',
                maxLength: 96,
            },
        }),
        defineField({
            name: 'mainImage',
            title: 'Main Image',
            type: 'image',
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: 'desc',
            title: 'Project Description',
            type: 'blockContent',
        }),
        defineField({
            name: 'gallery',
            title: 'Image & Video Gallery',
            type: 'gallery',
        }),
    ],
    preview: {
        select: {
            title: 'title',
            media: 'mainImage',
        },
        prepare(selection) {
            const { title } = selection;

            return { ...selection, subtitle: title && `by ${title}`}
        }
    }
})