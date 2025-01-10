import type { GroupedCollabs } from '@/types/groupedCollabs'
import { groupedProfileQuery, type Projects, type TasksWithProjects } from '@/utils/supaQueries'

export const useCollabs = () => {
  const groupedCollabs = ref<GroupedCollabs>({})

  const getProfileByIds = async (userIds: string[]) => {
    const { data, error } = await groupedProfileQuery(userIds)
    if (error || !data) return []

    return data
  }

  const getGroupedCollabs = async (items: Projects | TasksWithProjects) => {
    const filterItems = items.filter((item) => item.collaborators?.length)
    const promises = filterItems.map((item) => getProfileByIds(item.collaborators))

    const results = await Promise.all(promises)
    items.forEach((item, index) => {
      groupedCollabs.value[item.id] = results[index]
    })
  }

  return {
    getProfileByIds,
    getGroupedCollabs,
    groupedCollabs,
  }
}
