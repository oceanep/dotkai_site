import { SchemaTypeDefinition } from 'sanity'

import blockContent from './blockContent'
import post from './post'
import gallery from './gallery'
import project from './project'

export const schemaTypes = [post, blockContent, gallery, project]
export const schema: { types: SchemaTypeDefinition[] } = {
  types: schemaTypes,
}
