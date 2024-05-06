<template>
  <div class="row">
    <div class="col-5">
      <div class="form-group">
        <input class="form-control" placeholder="Nombre" v-model="object.name" />
      </div>
    </div>
    <div class="input-group col-4 mb-3">
      <span class="input-group-text border-end-0">$</span>
      <input
        aria-label="Amount (to the nearest dollar)"
        class="form-control"
        type="text"
        placeholder="Precio"
        v-model="object.price"
      />
    </div>
    <div class="col-12" v-if="false">
      <div class="form-group">
        <input class="form-control" placeholder="Descripción" v-model="object.description" />
      </div>
    </div>
    <div class="col-3">
      <div class="form-group">
        <input type="checkbox" v-model="object.isDefault" />
        <span class="ms-3">Por defecto</span>
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

}
</script>

<style></style>