<template>
  <div class="row">
    <div class="col-6" v-if="showFields.name">
      <div class="form-group mb-0">
        <input class="form-control" v-model="object.name" placeholder="Nombre" />
      </div>
    </div>
    <div class="col-4" v-if="showFields.description">
      <div class="form-group mb-0">
        <input class="form-control" v-model="object.description" placeholder="Descripción" />
      </div>
    </div>
    <!-- precios -->
    <div class="input-group col-6" v-if="showFields.price">
      <span class="input-group-text border-end-0">$</span>
      <input aria-label="Amount (to the nearest dollar)" class="form-control" type="text" placeholder="Precio" v-model="object.price" />
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
    },
    showFields: {
      type: Object,
      default: () => {
        return reactive({})
      },
      validator: (value) => {
        const defaultConfig = {
          name: true,
          description: true,
          price: true,
        }
        for (const key in defaultConfig) {
          if (!value.hasOwnProperty(key)) {
            value[key] = defaultConfig[key];
          }
        }
        return true
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