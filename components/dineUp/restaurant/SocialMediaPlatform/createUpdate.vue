<template>
  <div class="row">
        <div class="col-12">
          <div class="form-group">
                <input
                    class="form-control"
                    placeholder="Nombre"
                    v-model="object.name"
                />
            </div>
            <div class="form-group">
                <input
                    class="form-control"
                    placeholder="Logo"
                    v-model="object.logo"
                />
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
                return {}
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

<style>

</style>