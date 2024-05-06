<template>
  <div class="row">
    <div class="col-12" v-if="showFields.name">
      <div class="form-group">
        <input class="form-control" placeholder="Nombre" v-model="object.name" />
      </div>
    </div>
    <div class="col-6" v-if="showFields.nameType">
      <div class="form-group">
        <select class="form-control" placeholder="Tipo" v-model="object.nameType">
          <option value="OPTION">Opcional</option>
          <option value="ADDITIONAL">Adicional</option>
        </select>
      </div>
    </div>
    
    <div class="col-4" v-if="showFields.isMultiple" style="padding-right: 0 !important;">
      <div class="form-group">
        <input type="checkbox" v-model="object.isMultiple" />
        <span class="ms-3">Es múltiple</span>
      </div>
    </div>
    <div class="col-4" v-if="showFields.minimum">
      <div class="form-group" v-if="object.isMultiple">
        <input class="form-control" type="number" v-model="object.minimum" placeholder="Mínimo" />
      </div>
    </div>
    <div class="col-4" v-if="showFields.maximum">
      <div class="form-group" v-if="object.isMultiple">
        <input class="form-control" type="number" v-model="object.maximum" placeholder="Máximo" />
      </div>
    </div>
    <div class="col-12" v-if="showFields.isRequired">
      <div class="form-group">
        <input type="checkbox" v-model="object.isRequired" />
        <span class="ms-3">Es requerido</span>
      </div>
    </div>
  </div>

  <div class="row">
    <div class="col-10">
      <DineUpMenuItemOption class="mb-3" v-for="(itemOption, n) in object.itemOptions" :key="n" v-model="object.itemOptions[n]" :show-fields="{description: false}" />
    </div>
    <div class="col-1 mb-3">
      <!-- boton eliminar itemOption -->
      <button v-for="(i) in object.itemOptions.length-1" :key="i" class="btn ripple btn-outline-danger btn-icon btn-rounded mb-3" data-bs-placement="right"
        data-bs-toggle="tooltip-danger" title="Quitar item de opción" @click="object.itemOptions.splice(i, 1)">
        <i class="fa fa-minus"></i>
      </button>
      <!-- boton agregar itemOption -->
      <button class="btn ripple btn-outline-primary btn-icon btn-rounded" 
        @click="object.itemOptions.push({})"  
        data-bs-placement="right"
        data-bs-toggle="tooltip-primary" title="Agregar Item">
        <i class="fa-regular fa-plus"></i>
      </button>
    </div>
  </div>
</template>

<script>
import DineUpMenuItemOption from '~/components/dineUp/menu/ItemOption/createUpdate.vue'

export default {
  props: {
    modelValue: {
      type: Object,
      default: () => {
        return reactive({})
      },
      validator: (value) => {
        const defaultConfig = {
          itemOptions: [{}]
        }
        for (const key in defaultConfig) {
          if (!value.hasOwnProperty(key)) {
            value[key] = defaultConfig[key];
          }
        }
        return true;
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
          nameType: true,
          isRequired: true,
          isMultiple: true,
          minimum: true,
          maximum: true,
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
  components: {
    DineUpMenuItemOption
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