<template>
  <div class="col-12">
    <div class="row">
      <div class="col-6">
          <div>
            <h6>Nombre:</h6>
          </div>
          <span>
            {{ object.name }}
          </span>
      </div>
      <div class="col-6">
          <div>
            <h6>Descripción:</h6>
          </div>
          <span>
            {{ object.description }}
          </span>
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

<style>

</style>