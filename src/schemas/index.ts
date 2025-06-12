import { SchemaTypeDefinition } from 'sanity'

import blockContent from './blockContent'
import post from './post'
import gallery from './gallery'
import project from './project'
import page from './page'

export const schemaTypes = [post, blockContent, gallery, project, page]
export const schema: { types: SchemaTypeDefinition[] } = {
  types: schemaTypes,
}
