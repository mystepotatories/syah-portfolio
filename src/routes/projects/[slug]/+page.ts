import { error } from '@sveltejs/kit';
import { projects, projectSlug } from '$lib/projects';
import type { PageLoad } from './$types';

export const prerender = true;
export const entries = () => projects.map((project) => ({ slug: projectSlug(project.title) }));

export const load: PageLoad = ({ params }) => {
  const index = projects.findIndex((project) => projectSlug(project.title) === params.slug);
  if (index < 0) error(404, 'Project not found');
  return {
    project: projects[index],
    previous: projects[(index - 1 + projects.length) % projects.length],
    next: projects[(index + 1) % projects.length]
  };
};
