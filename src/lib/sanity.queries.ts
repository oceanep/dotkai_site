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
  *[_type == "project" && defined(slug.current)] |  order(order asc, _createdAt asc) {
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

export const pagesQuery = groq`
  *[_type == "page" && defined(slug.current)] | order(_createdAt) {
    "title": title,
    "secondaryTitle": secondaryTitle,
    "subtitle": subtitle,
    "slug": slug.current,
    "mainText": mainText,
    "links": links[]{
      "title": title,
      "url": url,
    },
    "skills": skills[]{
      "title": title,
    },
    "images": images,
    "videos": videos[]{
      "alt": alt,
      "height": height,
      "width": width,
      "asset": asset,
      "url": asset->url,
    },
  } | order(_createdAt desc)
`

export const pageBySlugQuery = groq`*[_type == "page" && slug.current == $slug][0]`

export async function getPage(
  client: SanityClient,
  slug: string,
): Promise<Page> {
  return await client.fetch(pageBySlugQuery, {
    slug,
  })
}

export const pageSlugsQuery = groq`
*[_type == "page" && defined(slug.current)][].slug.current
`

export async function getPageSlugs(client: SanityClient): Promise<string[]> {
  return await client.fetch(pageSlugsQuery)
}

export async function getPages(client: SanityClient): Promise<Page[]> {
  return await client.fetch(pagesQuery)
}

export interface Page {
  _type: 'page'
  _id: string
  _createdAt: string
  title: string
  secondaryTitle?: string
  subtitle?: string
  slug: string
  mainImage?: ImageAsset
  mainText: PortableTextBlock[]
  links?: { title: string; url: string }[]
  skills?: { title: string }[]
  images?: ProjectImageAsset[]
  videos?: VideoAsset[]
}

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