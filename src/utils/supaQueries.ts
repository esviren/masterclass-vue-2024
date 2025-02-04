import { supabase } from '@/lib/supabaseClient'
import type { CreateNewProject, CreateNewTask } from '@/types/CreateNewForm'
import type { QueryData } from '@supabase/supabase-js'

export const tasksWithProjectsQuery = supabase.from('tasks').select(`
    *,
    projects(
    id,
    name,
    slug
    )
    `)

export type TasksWithProjects = QueryData<typeof tasksWithProjectsQuery>

export const projectsQuery = supabase.from('projects').select()
export const tasksQuery = supabase.from('tasks').select()
export type Projects = QueryData<typeof projectsQuery>
export type Tasks = QueryData<typeof tasksQuery>

export const profilesQuery = supabase.from('profiles').select(`full_name, id`)

export const projectQuery = (slug: string) =>
  supabase
    .from('projects')
    .select(
      `
    *,
    tasks (
    id,
    name,
    status,
    due_date
    )
    `,
    )
    .eq('slug', slug)
    .single()

export type Project = QueryData<ReturnType<typeof projectQuery>>
export const updateProjectQuery = (updatedProject = {}, id: number) => {
  return supabase.from('projects').update(updatedProject).eq('id', id)
}

export const deleteTaskQuery = (id: number) => {
  return supabase.from('tasks').delete().eq('id', id)
}

export const taskQuery = (id: string) =>
  supabase
    .from('tasks')
    .select(
      `
    *,
    projects(
    id,
    name,
    slug
    )
    `,
    )
    .eq('id', id)
    .single()

export type Task = QueryData<ReturnType<typeof taskQuery>>

export const updateTaskQuery = (updatedProject = {}, id: number) => {
  return supabase.from('tasks').update(updatedProject).eq('id', id)
}

export const profileQuery = ({ column, value }: { column: string; value: string }) => {
  return supabase.from('profiles').select().eq(column, value).single()
}

export const groupedProfileQuery = (userIds: string[]) =>
  supabase.from('profiles').select('username,avatar_url,id,full_name').in('id', userIds)

export type Collabs = QueryData<ReturnType<typeof groupedProfileQuery>>

export const createNewTaskQuery = (newTask: CreateNewTask) => {
  return supabase.from('tasks').insert(newTask)
}

export const createNewProjectQuery = (newProject: CreateNewProject) => {
  return supabase.from('projects').insert(newProject)
}
