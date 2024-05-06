<template>
  <div class="row">
    <div class="col-12">
      <div class="form-group mb-0">
        <small v-if="object.id && object.image"><a :href="`${$envVar.apiBaseUrl}/${object.image}`" target="_blank">{{ object.image }}</a></small>
        <input type="file" ref="file" class="form-control" @change="onChangeFile" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: Object,
      default: () => {
        return reactive({})
      }
    }
  },
  emits: ['update:modelValue'],
  computed: {
    object: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    }
  },
  methods: {
    onChangeFile() {
      this.object.image = this.$refs.file.files[0]
    }
  }
}
</script>

<style></style>