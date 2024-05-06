<template>
  <NuxtLayout>
    <NuxtPage />
    <ModalsContainer />
  </NuxtLayout>
</template>

<script>
import { ModalsContainer } from 'vue-final-modal'

export default {
  created() {
    const { provide } = useNuxtApp()
    provide("apollo", this.$apollo)
  },
  components: {
    ModalsContainer
  }
}


</script>

<style></style>
