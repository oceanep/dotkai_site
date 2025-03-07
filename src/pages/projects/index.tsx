import type { GetStaticProps, InferGetStaticPropsType } from 'next'
import { useLiveQuery } from 'next-sanity/preview'
import { Bvh, Html, Plane } from '@react-three/drei'

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
        // <Bvh>
            <>
              <group
                position={[-1.5, 1.5, 0]}
                rotation={[0, Math.PI / 4, 0]}
              >
                {projects.projects.length > 0 ? (
                  projects.projects.map((project, i) => 
                    <mesh
                      rotation={[0, 0, 0]}
                      position={[
                        i === 0 ? i : i / 3,
                        0,
                        0
                      ]}
                      key={`${project.slug}-${i}`}
                    >
                      <Plane 
                        args={[.25, .25]}
                      >
                        <meshBasicMaterial attach="material" color="blue" />
                      </Plane>    
                    </mesh>)
                ) : (
                  <ComputerMesh scale={0.2} />
                )}
              </group>
              <group position={[0.9, .5, 0]}>
                <Plane args={[2, 2.5]}>
                  <meshBasicMaterial attach="material" color="blue" />
                  {/* <Html position={[0, 0, 0]} transform>
                    <div style={{ margin: '5%', backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
                      <h1>HTML Content</h1>
                      <p>This is some HTML content inside a 3D plane.</p>
                    </div>
                  </Html> */}
                </Plane>
              </group>
            </>
        // </Bvh> 
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
