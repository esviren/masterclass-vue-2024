<script setup lang="ts">
import { tasksWithProjectsQuery, type TasksWithProjects } from '@/utils/supaQueries'
import { columns } from '@/utils/tableColumns/tasksColumns'

usePageStore().pageData.title = 'Copropiedades'

const tasks = ref<TasksWithProjects | null>(null)
const getTasks = async () => {
  const { data, error, status } = await tasksWithProjectsQuery

  if (error) useErrorStore().setError({ error, customCode: status })
  tasks.value = data
}

await getTasks()
</script>
<template>
  <div class="container py-10 mx-auto">
    <DataTable v-if="tasks" :columns="columns" :data="tasks" />
  </div>
</template>
