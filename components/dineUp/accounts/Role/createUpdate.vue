<template>
  <div class="row">
    <div class="col-12">
      <div class="form-group" v-if="showFields.restaurants">
        <v-select 
          :selectable="isOptionSelectableBasedOnSelectedOptions(object.restaurants)" 
          :options="restaurants" 
          label="name" 
          :reduce="restaurant => restaurant.id" 
          v-model="object.restaurants" 
          multiple
          placeholder="Seleccione los restaurantes">
        </v-select>
      </div>
      <div class="form-group" v-if="showFields.name">
        <input class="form-control" placeholder="Nombre" v-model="object.name" />
      </div>
      <div class="form-group" v-if="showFields.permissions">
        <v-select 
          :selectable="isOptionSelectableBasedOnSelectedOptions(object.permissions)" 
          :options="permissions" 
          label="name" 
          :reduce="permission => permission.id" 
          v-model="object.permissions" 
          multiple
          class="last-v-select"
          placeholder="Seleccione los permisos de este rol">
        </v-select>
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
    },
    showFields: {
      type: Object,
      default: () => {
        return reactive({})
      },
      validator: (value) => {
        const defaultConfig = {
          restaurants: true,
          name: true,
          permissions: true,
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
    this.$apollo.queries.searchPermissions.refetch()
  },
  data() {
    return {
      restaurants: [],
      permissions: [],
    }
  },
  apollo: {
    searchRestaurants: {
      query: searchRestaurants(`
          id
          name
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
      }
    },
    searchPermissions: {
      query: searchPermissions(`
          id
          name
      `),
      variables() {
        return {}
      },
      result(response) {
        let { data } = response
        let { objects } = data.searchPermissions
        this.permissions = objects
      }
    },
  }
}
</script>

<style></style>