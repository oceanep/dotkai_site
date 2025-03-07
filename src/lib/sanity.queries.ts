import type { PortableTextBlock } from '@portabletext/types'
import type { ImageAsset, Slug, FileAsset } from '@sanity/types'
import groq from 'groq'
import { type SanityClient } from 'next-sanity'

// Posts queries
export const postsQuery = groq`*[_type == "post" && defined(slug.current)] | order(_createdAt desc)`

export async function getPosts(client: SanityClient): Promise<Post[]> {
  return await client.fetch(postsQuery)
}

export const postBySlugQuery = groq`*[_type == "post" && slug.current == $slug][0]`

export async function getPost(
  client: SanityClient,
  slug: string,
): Promise<Post> {
  return await client.fetch(postBySlugQuery, {
    slug,
  })
}

export const postSlugsQuery = groq`
*[_type == "post" && defined(slug.current)][].slug.current
`
// Projects queries
export const projectsQuery = groq`
  *[_type == "project" && defined(slug.current)] | order(_createdAt) {
      "desc": desc[].children[].text,
      "title": title,
      "slug": slug.current,
      "mainImage": mainImage.asset->url,
      "gallery": {
        "images": gallery.images[]{
          "_type": _type,
          "alt": alt,
          "url": asset->url
        },
        "videos": gallery.videos[]{
          "type": _type,
          "alt": alt,
          "url": asset->url
        }
      }
    } | order(_createdAt desc)`

export async function getProjects(client: SanityClient): Promise<Project[]> {
  return await client.fetch(projectsQuery)
}

export const projectBySlugQuery = groq`*[_type == "project" && slug.current == $slug][0]`

export async function getProject(
  client: SanityClient,
  slug: string,
): Promise<Project> {
  return await client.fetch(projectBySlugQuery, {
    slug,
  })
}

export const projectSlugsQuery = groq`
*[_type == "project" && defined(slug.current)][].slug.current
`

export interface Post {
  _type: 'post'
  _id: string
  _createdAt: string
  title?: string
  slug: Slug
  excerpt?: string
  mainImage?: ImageAsset
  body: PortableTextBlock[]
}

export interface Project {
  _type: 'project'
  _id: string
  _createdAt: string
  title?: string
  slug: Slug
  desc?: PortableTextBlock[]
  mainImage?: ImageAsset
  gallery?: (ImageAsset | FileAsset)[]
}
