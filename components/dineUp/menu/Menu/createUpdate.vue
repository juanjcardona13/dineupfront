<template>
  <div class="row">
    <div class="col-12">
      <div class="form-group" v-if="showFields.name">
        <input class="form-control" placeholder="Nombre del menu" v-model="object.name" />
      </div>

      <!-- Restaurante -->
      <div class="form-group" v-if="showFields.restaurant">
        <v-select :options="restaurants" label="name" :reduce="restaurant => restaurant.id" v-model="object.restaurant"
          placeholder="Restaurante"></v-select>
      </div>
      <!-- Sucursales -->
      <div class="form-group" v-if="showFields.branches">
        <v-select :selectable="isOptionSelectableBasedOnSelectedOptions(object.branches)" :options="branches" 
          label="name" :reduce="branch => branch.id" v-model="object.branches" multiple
          placeholder="Sucursales"></v-select>
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
      },
      validator: (value) => {
        const defaultConfig = {}
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
          restaurant: true,
          name: true,
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
  created() {
    this.$apollo.queries.searchRestaurants.refetch()
  },
  data() {
    return {
      restaurants: [],
      branches: [],
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
    searchBranches: {
      query: searchBranches(`
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
        let { objects } = data.searchBranches
        this.branches = objects
      },
      skip() {
        return !this.showFields.branches
      }
    },
  }
}
</script>

<style></style>