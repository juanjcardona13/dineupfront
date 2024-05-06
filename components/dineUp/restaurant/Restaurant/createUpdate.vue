
<template>
  <div class="row">
      <!-- TITULO -->
      <h5 class="mg-b-20 text-primary">
        Información
      </h5>
      <!-- NOMBRE -->
      <div class="col-6" v-if="showFields.name">
        <div class="form-group">
          <input type="text" class="form-control" name="example-text-input" placeholder="Nombre" v-model="object.name" />
        </div>
      </div>
      <!-- LOGO -->
      <div class="col-6" v-if="showFields.logo">
        <div class="form-group">
          <small v-if="object.id && object.logo"><a :href="`${$envVar.apiBaseUrl}/${object.logo}`" target="_blank">{{ object.logo }}</a></small>
          <input class="form-control" placeholder="Logo" type="file" ref="file" @change="onChangeFile"  />
        </div>
      </div>
      <!-- NUMERO TELEFONO -->
      <div class="col-6" v-if="showFields.phoneNumber">
        <div class="form-group">
          <input class="form-control" placeholder="Numero telefónico" v-model="object.phoneNumber" />
        </div>
      </div>
      <!-- SLOGAN -->
      <div class="col-6" v-if="showFields.slogan">
        <div class="form-group">
          <input class="form-control" placeholder="Slogan" v-model="object.slogan" />
        </div>
      </div>
      <!-- SITIO WEB -->
      <div class="col-6" v-if="showFields.website">
        <div class="form-group">
          <input class="form-control" placeholder="Sitio web" v-model="object.website" />
        </div>
      </div>
      <!-- EMAIL -->
      <div class="col-6" v-if="showFields.email">
        <div class="form-group">
          <input class="form-control" placeholder="Email" v-model="object.email" />
        </div>
      </div>
      <!-- TITULO2 -->
      <h5 class="mg-b-20 mg-t-20 text-primary" v-if="showFields.branches">
        Información Adicional
      </h5>
      <!-- SUCURSALES -->
      <div class="col-12" v-if="showFields.branches">
        <DineUpRestaurantBranchCreateUpdate v-model="object.branches[0]" :show-fields="{name: false, restaurant: false, isMain: false, email: false, website: false}" />
      </div>
  </div>
</template>
<script>
import DineUpRestaurantBranchCreateUpdate from '~/components/dineUp/restaurant/Branch/createUpdate.vue';

export default {
  props: {
    modelValue: {
      type: Object,
      default: () => {
        return reactive({})
      },
      validator: (value) => {
        const defaultConfig = {
          isMain: true,
          branches: [{
            isMain: true,
          }],
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
          logo: true,
          phoneNumber: true,
          slogan: true,
          website: true,
          email: true,
          branches: true,
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
  data() {
    return {
      DineUpRestaurantBranchCreateUpdate
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
        this.object.logo = this.$refs.file.files[0]
      }
    }
}
</script>

<style></style>