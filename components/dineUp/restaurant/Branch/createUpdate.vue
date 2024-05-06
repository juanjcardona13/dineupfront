<template>
  <div class="row">
    <!-- Restaurante -->
    <div class="form-group" v-if="showFields.restaurant">
      <v-select :options="restaurants" label="name" :reduce="restaurant => restaurant.id" v-model="object.restaurant"
        placeholder="Restaurante"></v-select>
    </div>
    <!-- Nombre -->
    <div class="form-group" v-if="showFields.name">
      <input class="form-control" placeholder="Nombre" v-model="object.name" />
    </div>

    <div class="col-12">
      <div class="row">
        <div class="col-6">
          <!-- Direccion -->
          <div class="form-group" v-if="showFields.address">
            <input class="form-control" placeholder="Dirección" v-model="object.address" />
          </div>
          <!-- Codigo postal -->
          <div class="form-group" v-if="showFields.postalCode">
            <input class="form-control" placeholder="Código postal" v-model="object.postalCode" />
          </div>
        </div>
        <!-- detalle de direccion -->
        <div class="col-6" v-if="showFields.addressDetail">
          <div class="form-group">
            <textarea rows="4" class="form-control" placeholder="Detalle de la dirección" v-model="object.addressDetail"></textarea>
          </div>
        </div>
      </div>
    </div>


    
    
    <!-- Es sucursal principal -->
    <div class="form-group" v-if="showFields.isMain">
      <input type="checkbox" v-model="object.isMain" />
      <span class="ms-3">Es la sucursal principal</span>
    </div>
    <!-- Email -->
    <div class="form-group" v-if="showFields.email">
      <input class="form-control" placeholder="Email" v-model="object.email" />
    </div>
    <!-- Sitio web -->
    <div class="form-group" v-if="showFields.website">
      <input class="form-control" placeholder="Sitio web" v-model="object.website" />
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
          restaurant: true,
          name: true,
          address: true,
          addressDetail: true,
          postalCode: true,
          isMain: true,
          email: true,
          website: true,
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
      restaurants: []
    }
  },
  created() {
    this.$apollo.queries.searchRestaurants.refetch()
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
  apollo: {
    searchRestaurants: {
      query: searchRestaurants(`
          id
          name
          isActive
        `),
      variables() {
        return {
          fieldsOfModel: {
            isActive: true
          }
        }
      },
      result(response) {
        let { data } = response
        let { objects } = data.searchRestaurants
        this.restaurants = objects
      },
      skip() {
        return !this.showFields.restaurant
      }
    },
  }
}
</script>

<style></style>