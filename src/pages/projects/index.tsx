import type { GetStaticProps, InferGetStaticPropsType } from 'next'
import { useLiveQuery } from 'next-sanity/preview'
import { Bvh, Plane } from '@react-three/drei'

import { readToken } from '~/lib/sanity.api'
import { getClient } from '~/lib/sanity.client'
import { getProjects, type Project, projectsQuery } from '~/lib/sanity.queries'

import type { SharedPageProps } from '~/pages/_app'
import ComputerMesh from '~/components/ComputerMesh'

export const getStaticProps: GetStaticProps<
  SharedPageProps & {
    projects: Project[]
  }
> = async ({ draftMode = false }) => {
  const client = getClient(draftMode ? { token: readToken } : undefined)
  const projects = await getProjects(client)

  return {
    props: {
      draftMode,
      token: draftMode ? readToken : '',
      projects,
      title: 'Projects'
    },
  }
}

// DOM elements here
const DOM = () => {
    return <></>;
};
// Canvas/R3F components here
const R3F = ({projects}) => {
    // const [projects] = useLiveQuery<Project[]>(props.projects, projectsQuery)
    console.log('projects: ', projects.projects)
    
    return (
        <Bvh>
            {projects.projects.length > 0 ? (
                projects.projects.map((project, i) => 
                    <Plane 
                      args={[.25, .25]}
                      rotation={[0, Math.PI / 6, 0]}
                      position={[
                        i === 0 ? i : i / 3,
                        -0.5,
                        i === 0 ? i : -i / 5
                      ]}
                      key={`${project.slug}-${i}`}
                    >
                      <meshBasicMaterial attach="material" color="blue" />
                    </Plane>)
            ) : (
              <ComputerMesh scale={0.2} />
            )}
        </Bvh>
    );
};

export default function IndexPage(
  props: InferGetStaticPropsType<typeof getStaticProps>,
) {
    const [projects] = useLiveQuery<Project[]>(props.projects, projectsQuery)

  return (
    <DOM/>
  )
}

IndexPage.canvas = (projects) => <R3F projects={projects} />
