import {
  type TasksWithProjects,
  type Task,
  taskQuery,
  updateTaskQuery,
  tasksWithProjectsQuery,
  deleteTaskQuery,
} from '@/utils/supaQueries'
import { useMemoize } from '@vueuse/core'

export const useTasksStores = defineStore('tasks-store', () => {
  const tasks = ref<TasksWithProjects | null>(null)
  const task = ref<Task | null>(null)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const loadTasks = useMemoize(async (key: string) => await tasksWithProjectsQuery)
  const loadtask = useMemoize(async (slug: string) => await taskQuery(slug))

  interface calidateCacheParams {
    ref: typeof tasks | typeof task
    query: typeof tasksWithProjectsQuery | typeof taskQuery
    key: string
    loaderFn: typeof loadTasks | typeof loadtask
  }

  const validateCache = ({ ref, query, key, loaderFn }: calidateCacheParams) => {
    if (ref.value) {
      const finalQuery = typeof query === 'function' ? query(key) : query
      finalQuery.then(({ data, error }) => {
        if (JSON.stringify(ref.value) === JSON.stringify(data)) {
          console.log('cached and fresh data matched!!!')
          return
        } else {
          loaderFn.delete(key)
          if (!error && data) ref.value = data
        }
      })
    }
  }

  const getTasks = async () => {
    tasks.value = null
    const { data, error, status } = await loadTasks('tasks')

    if (error) useErrorStore().setError({ error, customCode: status })

    if (data) tasks.value = data

    validateCache({
      ref: tasks,
      query: tasksWithProjectsQuery,
      key: 'projects',
      loaderFn: loadTasks,
    })
  }

  const getTask = async (slug: string) => {
    task.value = null
    const { data, error, status } = await loadtask(slug)

    if (error) useErrorStore().setError({ error, customCode: status })

    if (data) task.value = data

    validateCache({ ref: task, query: taskQuery, key: slug, loaderFn: loadtask })
  }
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const updateTask = async () => {
    if (!task.value) return
    const { projects, id, ...taskProperties } = task.value
    await updateTaskQuery(taskProperties, task.value.id)
    console.log(task.value.id)
  }

  const deleteTask = async () => {
    if (!task.value) return
    const { id } = task.value
    await deleteTaskQuery(task.value.id)
  }

  return {
    tasks,
    task,
    getTask,
    getTasks,
    updateTask,
    deleteTask,
  }
})
