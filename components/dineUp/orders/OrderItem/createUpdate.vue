<template>
  <div class="row">
    <div class="col-12">
      <div class="form-group" v-if="showFields.order">
        <v-select 
          :options="orders" 
          label="number" 
          :reduce="order => order.id" 
          v-model="object.order"
          placeholder="Pedido">
        </v-select>
      </div>
      <div class="form-group" v-if="showFields.menuItem">
        <v-select 
          :options="menuItems" 
          label="name" 
          :reduce="menuItem => menuItem.id" 
          v-model="object.menuItem"
          placeholder="Producto">
        </v-select>
      </div>
      <div class="form-group" v-if="showFields.variantOption && variantOptions.length > 0">
        <v-select 
          :options="variantOptions" 
          label="name" 
          :reduce="variantOption => variantOption.id" 
          v-model="object.variantOption"
          :placeholder="variantOptions[0].variant.name">
        </v-select>
      </div>
      <div class="form-group" v-if="showFields.amount">
        <input type="number" class="form-control" placeholder="Cantidad" v-model="object.amount" />
      </div>
      <div class="form-group" v-if="showFields.dinerName">
        <input class="form-control" placeholder="Comensal" v-model="object.dinerName" />
      </div>
      <div class="form-group" v-if="showFields.observations">
        <input class="form-control" placeholder="Observaciones" v-model="object.observations" />
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
          order: true,
          menuItem: true,
          variantOption: true,
          amount: true,
          dinerName: true,
          observations: true,
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
      orders: [],
      menuItems: [],
      variantOptions: []
    }
  },
  created() {
    this.$apollo.queries.searchOrders.refetch()
    this.$apollo.queries.searchVariantOptions.refetch()
  },
  apollo: {
    searchOrders: {
      query: searchOrders(`
          id
          number
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
        let { objects } = data.searchOrders
        this.orders = objects
      },
      skip() {
        return !this.showFields.order
      }
    },
    searchMenuItems: {
      query: searchMenuItems(`
          id
          name
          variant {
            id
            variantOptions {
              id
              name
            }
          }
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
        let { objects } = data.searchMenuItems
        this.menuItems = objects
      },
      skip() {
        return !this.showFields.menuItem
      }
    },
    searchVariantOptions: {
      query: searchVariantOptions(`
          id
          name
          variant {
            id
            name
          }
          isActive
      `),
      variables() {
        return {
          advancedSearch: [
            {
              fieldsAndFilters: [{
                field: "variant__menu_item__pk"
              }],
              searchValues: [this.object.menuItem]
            }
          ]
        }
      },
      result(response) {
        let { data } = response
        let { objects } = data.searchVariantOptions
        this.variantOptions = objects
      },
      skip() {
        return !(this.showFields.variantOption && this.object.menuItem);
      }
    },
  }
}
</script>

<style></style>