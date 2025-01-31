<script lang="ts" setup>
import type { CreateNewTask } from '@/types/CreateNewForm'
import { createNewTaskQuery, profilesQuery, projectsQuery } from '@/utils/supaQueries'

const sheetOpen = defineModel<boolean>()

type SelectOption = { label: string; value: number | string }

const selectOptions = ref({
  project: [] as SelectOption[],
  profiles: [] as SelectOption[],
})

const getProjectOptions = async () => {
  const { data: allProjects } = await projectsQuery
  if (!allProjects) return
  allProjects.forEach((project) => {
    selectOptions.value.project.push({
      label: project.name,
      value: project.id,
    })
  })
}
const getProfilesOptions = async () => {
  const { data: allProfiles } = await profilesQuery

  if (!allProfiles) return

  allProfiles.forEach((profile) => {
    selectOptions.value.profiles.push({
      label: profile.full_name,
      value: profile.id,
    })
  })
}

const getOptions = async () => {
  await Promise.all([getProfilesOptions(), getProjectOptions()])
}

getOptions()

const { profile } = storeToRefs(useAuthStore())

const createTask = async (formData: CreateNewTask) => {
  const task = {
    ...formData,
    collaborators: [profile.value!.id],
  }

  const { error } = await createNewTaskQuery(task)

  if (error) {
    console.log(error)
  }

  sheetOpen.value = false
}
</script>
<template>
  <Sheet v-model:open="sheetOpen">
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Nueva Copropedad</SheetTitle>
        <SheetDescription>
          <p>Crea una Copropiedad</p>
        </SheetDescription>
      </SheetHeader>
      <FormKit
        type="form"
        @submit="createTask"
        submit-label="Crear Copropiedad"
        :config="{ validationVisibility: 'submit' }"
      >
        <FormKit
          type="text"
          name="name"
          id="name"
          label="Nombre"
          placeholder="Nueva Copropiedad"
          validation="required|length:1,255"
        />
        <FormKit
          type="select"
          name="profile_id"
          id="profile_id"
          label="Usuario"
          placeholder="Selecione usuario"
          :options="selectOptions.profiles"
          validation="required"
        />
        <FormKit
          type="select"
          name="project_id"
          id="project_id"
          label="Copropiedad"
          placeholder="Selecione Copropiedad"
          :options="selectOptions.project"
          validation="required"
        />
        <FormKit
          type="textarea"
          name="description"
          id="description"
          label="Descripción"
          placeholder="Descripcion de la Copropiedad"
          validation="length:0,500"
        />
      </FormKit>
    </SheetContent>
  </Sheet>
</template>
