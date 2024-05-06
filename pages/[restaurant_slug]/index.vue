<template>
  <PageHeader heading="Dashboard" maintitle="Inicio" subtitle="Dashboard" ></PageHeader>

  <div class="mg-t-4">
    <h2>{{ $t('welcome', ['Juan']) }}</h2>
  </div>
  
  <div class="row mt-5">
    <div class="col-12">
      <div class="card custom-card card-body">
        <p class="card-text">
          Presentación, Descripción y Instrucciones para usuario apenas ingrese:
          "Te presentamos DineUp, una plataforma optima para que lleves el control del menu de tu restaurante, Mesas y pedidos.
          a traves de tu código QR, tus clientes podrán visualizar la carta Digital de tu restaurante, Agilizar el proceso de pedido"
        </p>
      </div>
    </div>
    <div class="col-6">
      <div class="card custom-card card-body">
        <p class="card-text">
          Crear Restaurante
        </p>
      </div>
    </div>
    <div class="col-6">
      <div class="card custom-card card-body">
        <p class="card-text">
          Conocer el QR
        </p>
      </div>
    </div>
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
