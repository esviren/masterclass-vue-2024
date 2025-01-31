<script lang="ts" setup>
import type { CreateNewProject } from '@/types/CreateNewForm'
import { createNewProjectQuery } from '@/utils/supaQueries'

const sheetOpen = defineModel<boolean>()

const { profile } = storeToRefs(useAuthStore())

const createProject = async (formData: CreateNewProject) => {
  formData.slug = formData.name.toLocaleLowerCase().replace(/ /g, '-')
  const project = {
    ...formData,
    collaborators: [profile.value!.id],
  }

  const { error } = await createNewProjectQuery(project)

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
        @submit="createProject"
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
