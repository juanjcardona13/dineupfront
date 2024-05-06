<template>
  <div class="row">
    <div class="col-12">
      <!-- Restaurante -->
      <div class="form-group" v-if="showFields.restaurant">
        <v-select :options="restaurants" label="name" :reduce="restaurant => restaurant.id" v-model="object.restaurant"
          placeholder="Restaurante"></v-select>
      </div>
      <!-- Menus -->
      <div class="form-group" v-if="showFields.menus">
        <v-select :selectable="isOptionSelectableBasedOnSelectedOptions(object.menus)" multiple 
          :options="menus" label="name" :reduce="menu => menu.id" v-model="object.menus"
          placeholder="Menus"></v-select>
      </div>
      <div class="form-group" v-if="showFields.name">
        <input class="form-control" placeholder="Nombre de la categoría" v-model="object.name" />
      </div>
      <div class="form-group" v-if="showFields.icon">
        <v-select :options="icons" label="icon" v-model="object.icon" placeholder="Icono para representar tu categoría" class="last-v-select">
          <template #option="{icon}">
            <i :class="`fa fa-${icon}`"></i>
          </template>
        </v-select>
      </div>
      <div class="form-group" v-if="showFields.description">
        <input class="form-control" placeholder="Descripción" v-model="object.description" />
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
    },
    showFields: {
      type: Object,
      default: () => {
        return reactive({})
      },
      validator: (value) => {
        const defaultConfig = {
          restaurant: true,
          menus: true,
          name: true,
          description: true,
          icon: true
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
  data() {
    return {
      icons: [
        "plate-wheat",
        "burger",
        "fish",
        "hotdog",
        "bacon",
        "pizza-slice",
        "drumstick-bite",
        "martini-glass-empty",
      ],
      restaurants: [],
      menus: [],
    }
  },
  created() {
    this.$apollo.queries.searchRestaurants.refetch()
    this.$apollo.queries.searchMenus.refetch()
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
    searchMenus: {
      query: searchMenus(`
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
        let { objects } = data.searchMenus
        this.menus = objects
      },
      skip() {
        return !this.showFields.restaurant
      }
    },
  }
}
</script>
  
<style></style>