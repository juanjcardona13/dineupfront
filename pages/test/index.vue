<template>
  <PageHeader heading="Dashboard" maintitle="Inicio" subtitle="Dashboard" ></PageHeader>
  <h1>{{ $t('coming-soon-your-stats-here-123') }}.</h1>
  <div>

    {{$userLoggedIn}}
  </div>
  <div>
    =======================
  </div>
  <div>
    <form>
      <select v-model="locale">
        <option value="en">en</option>
        <option value="es">es</option>
      </select>
      <p>{{ $t('welcome', ['Juan']) }}</p>
    </form>
  </div>

  <div>
    <img :src="`data:image/png;base64,${readTable?.qrCode}`" />
  </div>
</template>

<script>
import PageHeader from "@/components/layout/PageHeader.vue";

definePageMeta({
  middleware: "middleware-auth",
})

export default {
  name: "Maindashboard",
  components: {
    PageHeader,
  },
  setup() {
    const { locale } = useI18n()
    return {
      locale,
    }
  },
};
</script>

<style></style>
