import { SchemaTypeDefinition } from 'sanity'

import blockContent from './blockContent'
import post from './post'
import gallery from './gallery'
import project from './project'
import page from './page'
import localeBlockContent from './objects/localeBlockContent'
import localeString from './objects/localeString'

export const schemaTypes = [post, blockContent, gallery, project, page, localeBlockContent, localeString]
export const schema: { types: SchemaTypeDefinition[] } = {
  types: schemaTypes,
}
