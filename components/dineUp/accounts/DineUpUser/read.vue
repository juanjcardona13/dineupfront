<template>
  <div class="row">
          <div class="col-12">
            <div class="fs-5">
              <b>Nombre:</b>
              {{object}}
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