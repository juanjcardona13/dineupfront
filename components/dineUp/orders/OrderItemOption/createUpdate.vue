<template>
  <div class="row">
    <div class="col-12">
      <div class="form-group" v-if="showFields.orderItem">
        <v-select 
          :options="orderItems" 
          label="menuItem" 
          :reduce="orderItem => orderItem.id" 
          v-model="object.orderItem"
          placeholder="Item del pedido">
        </v-select>
      </div>
    </div>
    <div class="col-6">
      <div class="form-group" v-if="showFields.itemOption">
        <v-select 
          :options="itemOptions" 
          label="name" 
          :reduce="itemOption => itemOption.id" 
          v-model="object.itemOption"
          placeholder="Opciones personalizadas">
        </v-select>
      </div>
    </div>
    <div class="col-6">
      <div class="form-group" v-if="showFields.amount">
        <input class="form-control" placeholder="Cantidad" v-model="object.amount" />
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
          orderItem: true,
          itemOption: true,
          amount: true,
        }
        for (const key in defaultConfig) {
          if (!value.hasOwnProperty(key)) {
            value[key] = defaultConfig[key];
          }
        }
        return true
      }
    },
    grupoOption: {
      type: Object,
      default: () => {
        return reactive({})
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
      orderItems: [],
      itemOptions: [],
    }
  },
  created() {
    this.$apollo.queries.searchOrderItems.refetch()
    this.$apollo.queries.searchItemOptions.refetch()
  },
  apollo: {
    searchOrderItems: {
      query: searchOrderItems(`
          id
          menuItem {
            id
            name
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
        let { objects } = data.searchOrderItems
        this.orderItems = objects
      },
      skip() {
        return !this.showFields.orderItem
      }
    },
    searchItemOptions: {
      query: searchItemOptions(`
          id
          name
          isActive
      `),
      variables() {
        return {
          fieldsOfModel: {
            isActive: true,
            // group: this.grupoOption.id
          }
        }
      },
      result(response) {
        let { data } = response
        let { objects } = data.searchItemOptions
        this.itemOptions = objects
      },
      skip() {
        if (this.showFields.itemOption) {
          return false //this.grupoOption.id ? false : true
        } else {
          return true
        }
      }
    },
  }
}
</script>

<style></style>