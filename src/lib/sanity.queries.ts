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
      "desc": desc,
      "title": title,
      "slug": slug.current,
      "mainImage": mainImage{
        ...,
        "url": asset->url,
      },
      "gallery": {
        "display": gallery.display,
        "images": gallery.images[]{
          ...,
          "metadata": asset->metadata
        },
        "videos": gallery.videos[]{
          "type": _type,
          "alt": alt,
          "width": width,
          "height": height,
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
  mainImageUrl?: string
  gallery?: Gallery
}

export interface ProjectImageAsset extends ImageAsset {
  alt: 'string'
}

export interface VideoAsset extends FileAsset {
  width: number,
  height: number,
  url: string,
  alt?: string,
}

export enum GalleryDisplay {
  Tri = 'tri',
  InlineLeft = 'inline-left',
  InlineRight = 'inline-right',
  InlineBottom = 'inline-bottom',
}

export interface Gallery {
  _type: 'gallery'
  images: ProjectImageAsset[]
  videos: VideoAsset[]
  display: GalleryDisplay
  zoom?: boolean
}