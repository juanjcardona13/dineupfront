<template>
  <div class="row pd-t-15 pd-r-15 pd-b-15 pd-l-15">
    <div class="col-6">
      <div class="col-12">
        <div>
          <h5>Mesa</h5>
        </div>
        <h1>
          {{ object.identifier }}
        </h1>
      </div>
      <div class="col-12 mg-t-60">
        <div>
          <h6>Descripción ubicación</h6>
        </div>
        <span>
          {{ object.locationDescription }}
        </span>
      </div>
    </div>
    <div class="col-6">
      <div>
        <h6>Código QR</h6>
      </div>
      <div v-if="object.qrCode">
        <img class="p-2 bd rounded-3" :src="`data:image/png;base64,${object.qrCode}`"
          style="box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    object: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
}
</script>

<style></style>