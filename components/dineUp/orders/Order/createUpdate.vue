<template>
  <div class="row">
    <!-- Datos principales -->
    <div class="col-12 mb-3">
      <div class="form-group" v-if="showFields.table">
        <v-select 
          :options="tables" 
          label="identifier" 
          :reduce="table => table.id" 
          v-model="object.table"
          placeholder="Mesa">
        </v-select>
      </div>
      <div class="form-group" v-if="showFields.diner">
        <input class="form-control" placeholder="E-mail" v-model="userEmail" @blur="getDineUpUserForUserEmail(userEmail)" />
      </div>
      <div class="form-group" v-if="showFields.status">
        <v-select 
          :options="orderStatus" 
          label="name" 
          :reduce="status => status.id" 
          v-model="object.status"
          placeholder="Estado">
        </v-select>
      </div>
      <div class="form-group" v-if="showFields.number">
        <input class="form-control" placeholder="Numero" v-model="object.number" />
      </div>
      <div class="form-group" v-if="showFields.waiter">
        <v-select 
          :options="waiters" 
          label="identifier" 
          :reduce="waiter => waiter.id" 
          v-model="object.waiter"
          placeholder="Mesero">
        </v-select>
      </div>
    </div>
    <!-- PRODUCTOS/ITEMS DEL PEDIDO -->
    <div class="col-12 mb-3">
      <div v-for="(optionGroup, i) in object.orderItems" :key="i" class="p-3 mb-3 bd rounded-3"
        style="box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;">
        <div class="row">
          <div class=" col-6 mg-b-20">
            <h5 class="text-primary ">
              Productos del pedido
            </h5>
          </div>
        </div>
        <DineUpOrderItem v-model="object.orderItems[i]" :showFields="{order: false}" />
        <!-- VARIANTE -->

        <!-- OPCIONES -->
        <template v-if="object.orderItems[i].orderItemOptions.length > 0">
          <DineUpOrderItemOption class="mb-3" v-for="(itemOption, n) in object.orderItems[i].orderItemOptions" :key="n" v-model="object.orderItems[i].orderItemOptions[n]" :showFields="{orderItem: false}" />
        </template>
      </div>
      <button class="btn ripple btn-outline-primary mg-t-20" @click="object.orderItems.push({ orderItemOptions: [] })">
        <i class="fa-regular fa-plus"></i>
        Agregar producto
      </button>
    </div>
  </div>
</template>

<script>
import DineUpOrderItem from '~/components/dineUp/orders/OrderItem/createUpdate.vue'
import DineUpOrderItemOption from '~/components/dineUp/orders/OrderItemOption/createUpdate.vue'


export default {
  props: {
    modelValue: {
      type: Object,
      default: () => {
        return reactive({})
      },
      validator: (value) => {
        const defaultConfig = {
          orderItems: [
            {
              orderItemOptions: [],
            }
          ]
        }
        for (const key in defaultConfig) {
          if (!value.hasOwnProperty(key)) {
            value[key] = defaultConfig[key];
          }
        }
        return true
      }
    },
    showFields: {
      type: Object,
      default: () => {
        return reactive({})
      },
      validator: (value) => {
        const defaultConfig = {
          table: true,
          number: true,
          diner: true,
          status: true,
          waiter: true
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
      userEmail: null,
      waiters: [],
      tables: [],
      orderStatus: [],
      menuItemsAlreadySearchOptions: [],
      groupsOptionsForEachMenuItem: []
    }
  },
  created() {
    this.$apollo.queries.searchEmployees.refetch()
    this.$apollo.queries.searchTables.refetch()
    this.$apollo.queries.searchOrderStatus.refetch()
  },
  components: {
    DineUpOrderItem,
    DineUpOrderItemOption,
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
    async getDineUpUserForUserEmail(userEmail) {
      if (userEmail) {
        const { data } = await this.$apollo.query({
          query: searchDineUpUsers(),
          variables: {
            advancedSearch: [
              {
                fieldsAndFilters: [
                  {
                    field: "user__username"
                  }
                ],
                searchValues: [userEmail]
              }
            ]
          }
        })
        const { total, objects } = data.searchDineUpUsers
        if (total == 1) {
          this.object.dineUpUser = objects[0].id
        }
      }
    },
    async getMenuItemOptions(idMenuItem, i) {
      this.menuItemsAlreadySearchOptions.push(idMenuItem)
      const { data } = await executeQuery(
        searchOptionGroups(`
          id
          name
          nameType
          isRequired
          isMultiple
          minimum
          maximum
          itemOptions {
            id
            name
            description
            price
          }
        `),
        {
          fieldsOfModel: {
            menuItem: idMenuItem
          }
        }
      )
      let { objects } = data.searchOptionGroups
      for (let object of objects) {
        for (let itemOption of object.itemOptions) {
          this.object.orderItems[i].orderItemOptions.push({
            itemOption: itemOption.id
          })
        }
      }
    }
  },
  watch: {
    object: {
      handler(newValue) {
        if (newValue) {
          for (let i in newValue.orderItems) {
            if (newValue.orderItems[i].menuItem) {
              if (!this.menuItemsAlreadySearchOptions.includes(newValue.orderItems[i].menuItem)) {
                this.getMenuItemOptions(newValue.orderItems[i].menuItem, i)
              }
            }
          }
        }
      },
      deep: true
    }
  },
  apollo: {
    searchTables: {
      query: searchTables(`
          id
          identifier
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
        let { objects } = data.searchTables
        this.tables = objects
      },
      skip() {
        return !this.showFields.table
      }
    },
    searchOrderStatus: {
      query: searchOrderStatus(`
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
        let { objects } = data.searchOrderStatus
        this.orderStatus = objects
      },
      skip() {
        return !this.showFields.status
      }
    },
    searchEmployees: {
      query: searchEmployees(`
          id
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
        let { objects } = data.searchEmployees
        this.waiters = objects
      },
      skip() {
        return !this.showFields.status
      }
    },
  }
}
</script>

<style></style>