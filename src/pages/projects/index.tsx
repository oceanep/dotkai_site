import type { GetStaticProps, InferGetStaticPropsType } from 'next'

import { readToken } from '~/lib/sanity.api'
import { getClient } from '~/lib/sanity.client'
import {
  getProjects,
  type Project,
  getPages,
  type Page,
} from '~/lib/sanity.queries'

import type { SharedPageProps } from '~/pages/_app'

import dynamic from 'next/dynamic'
import Loader from '~/components/Loader'

export const getStaticProps: GetStaticProps<
  SharedPageProps & {
    projects: Project[]
    pages: Page[]
  }
> = async ({ draftMode = false }) => {
  const client = getClient(draftMode ? { token: readToken } : undefined)
  const projects = await getProjects(client)
  const pages = await getPages(client)

  return {
    props: {
      draftMode,
      token: draftMode ? readToken : '',
      projects,
      pages,
      title: 'Projects',
    },
  }
}

const ProjectsScene = dynamic(() => import('~/components/projectsPage/ProjectsScene'), {
  ssr: false
})

// DOM elements here
const DOM = () => {
  return <></>
}

export default function IndexPage(
  props: InferGetStaticPropsType<typeof getStaticProps>,
) {
  // const [projects] = useLiveQuery<Project[]>(props.projects, projectsQuery)
  // const [pages] = useLiveQuery<Page[]>(props.pages, pagesQuery)

  return <DOM />
}

IndexPage.canvas = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  // const [projects] = useLiveQuery<Project[]>(props.projects, projectsQuery)
  // const [pages] = useLiveQuery<Page[]>(props.pages, pagesQuery)

  return <ProjectsScene projects={props.projects} pages={props.pages} />
}
