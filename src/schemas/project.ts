import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'project',
    title: 'Project',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Project Title',
            type: 'localeString'
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
            name: 'order',
            title: 'Display Order',
            type: 'number',
            validation: Rule => Rule.integer().min(0),
            description: 'Lower numbers will be displayed first',
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
            type: 'localeBlockContent',
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
            order: 'order',
            media: 'mainImage',
        },
        prepare(selection) {
            const { title, order } = selection
            const localizedTitle = title?.en || title?.jp || 'Untitled'
            const subtitle = order ? `Order: ${order}` : 'No order set'
            return { ...selection, title: localizedTitle,  subtitle: subtitle && `${subtitle} || ${title?.jp || title?.en}`}
        }
    }
})