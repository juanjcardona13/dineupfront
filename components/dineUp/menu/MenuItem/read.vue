<template>
  <div class="row">
          <div class="col-12">
            <div class="fs-5">
              <b>Object:</b>
              <pre>{{object}}</pre>
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