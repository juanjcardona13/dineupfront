<template>
  <div class="row">
        <div class="col-12">
            <div class="form-group">
                <p class="mg-b-10">Inicio:</p>
                <input
                    class="form-control"
                    placeholder="Nombre"
                    v-model="object.startTime"
                />
            </div>
        </div>
        <div class="col-12">
            <div class="form-group">
                <p class="mg-b-10">Fin:</p>
                <input
                    class="form-control"
                    placeholder="Nombre"
                    v-model="object.endTime"
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