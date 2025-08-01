# A Next.js site with Threejs/React-three-fiber and Sanity Studio

A personal experiment in interaction and UI design doubling as a portfolio site that uses [Next.js][nextjs] for the frontend and [Sanity][sanity-homepage] to handle its content.
It comes with a native Sanity Studio that offers features like real-time collaboration, instant side-by-side content previews, and intuitive editing.

The Studio connects to Sanity Content Lake, which gives you hosted content APIs with a flexible query language, on-demand image transformations, powerful patching, and more.
You can use this starter to kick-start a clean slate site or learn these technologies.

> **Note**
>
> This version uses the `/pages` directory for Next.js routing.
>
> It will be migrated to the [/app][app-dir] directory
> sometime after React-three-fiber's stable v9 release.

# Important files and folders

| File(s)                          | Description                                                                           |
| -------------------------------- | ------------------------------------------------------------------------------------- |
| `components/layout/CanvasWrapper`| Canvas Wrapper passed to every page render, canvas properties are managed here        |
| `components/layout/DomWrapper`   | Dom Wrapper rendered above canvas for every page. Loader is also handled here         |
| `jsx-models/`                   | External meshes (blender) are deconstructed in jsx here                               |
| `sanity.config.ts`               | Config file for Sanity Studio                                                         |
| `sanity.cli.ts`                  | Config file for Sanity CLI                                                            |
| `/pages/index.tsx`               | Landing page for `/`.                                                                 |
| `/pages/studio/[[...index]].tsx` | Where Sanity Studio is mounted                                                        |
| `/pages/api/draft.ts`            | Serverless route for triggering Draft mode                                            |
| `/sanity/schemas.ts`             | Where Sanity Studio gets its content types from                                       |
| `/sanity/env.ts`                 | Configuration for the Sanity project and dataset                                      |
| `/sanity/schemas.ts`             | Where Sanity Studio gets its content types from                                       |
| `/sanity/lib/client.ts`          | Sanity client configured based on `env.ts`                                            |
| `/sanity/lib/image.ts`           | Sanity image builder - unused in this template, but is needed to render Sanity images |

All pages are wrapped in `pages/_document.tsx` and `pages/_app.tsx`.

### “A 3D portfolio built like a playground.”

This site is both a showcase of my work and a testbed for new ideas in creative web engineering.
Built with Next.js, Three.js/React Three Fiber, and a custom 3D layout engine, it transforms a traditional portfolio into an interactive experience.
From game-inspired camera movement to a responsive system that simulates CSS in 3D, every detail is designed to push beyond the limits of standard web interfaces.

### Overview

My portfolio website blends creative direction with technical precision. Using Next.js, Three.js/React Three Fiber, and Sanity CMS, I created a performant 3D experience optimized for smooth interaction. Next.js handles routing, SEO, and bundle optimization; React Three Fiber powers 3D meshes and dynamic UI elements; and Sanity provides a flexible content structure through custom schemas.

### Design Inspiration

Visually, the site is inspired by the PlayStation 2 Network Broadband menu and Y2K-era counterculture aesthetics like Toonami. I embraced the concept of asymmetrical symmetry, creating layouts and animations that feel dynamic yet balanced, resulting in a nostalgic yet playful interface.

### Pseudo Media Query System

To achieve responsive 3D layouts, I built a Pseudo Media Query system that mimics CSS behavior in world space. Components are sized in pixels, converted into 3D units, and dynamically repositioned as screen dimensions change. This custom engine allowed for a responsive UI that feels consistent with modern web design but operates entirely outside traditional HTML and CSS constraints.

### 3D Interactivity & Performance

The interface uses game-inspired techniques to achieve smooth, complex motion. Screen artifacts orbit asynchronously via misaligned vectors and sinusoidal rotations, while nearly 200 on-screen objects are efficiently handled through instancing and memoization, reducing draw calls to as few as 10–30 per page. Instead of moving the menus, the camera responds to mouse input, reorienting dynamically to create the illusion of motion while keeping interactions responsive and fluid.

### Ongoing Development

This portfolio is a living project. I plan to expand the Pseudo Media Query system, experiment with new interaction patterns, and continue exploring how 3D interfaces can break free from conventional web design. I'm always open to feature suggestions or bug reports via this repo.
