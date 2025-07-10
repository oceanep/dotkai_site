import { defineType } from 'sanity'

export default defineType({
  name: 'localeBlockContent',
  title: 'Localized Block Content',
  type: 'object',
  fields: [
    { name: 'en', title: 'English', type: 'blockContent' },
    { name: 'jp', title: 'Japanese', type: 'blockContent' },
  ]
})