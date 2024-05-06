<template>
  <CRUDDALS 
    :header="header" 
    :Create="Create"
    :Read="Read"
    :Update="Update"
    :Delete="Delete"
    :Deactivate="Deactivate"
    :Activate="Activate"
    :List="List"
    :Search="Search"
    >
  </CRUDDALS>
</template>

<script>
import ComponentFormCreateUpdateOrderItem from "~/components/dineUp/orders/OrderItem/createUpdate.vue"
import ComponentVerDetalleOrderItem from "@/components/dineUp/orders/OrderItem/read.vue"
import { shallowRef } from 'vue';


const FormCreateUpdateOrderItem = shallowRef(ComponentFormCreateUpdateOrderItem);
const VerDetalleOrderItem = shallowRef(ComponentVerDetalleOrderItem);


definePageMeta({
  middleware: "middleware-auth",
})

export default {
  data() {
    return {
      header: {
        title: "Items del pedido",
      }, 
      Create: {
        modalTitle: "Crear nuevo item del pedido",
        objectData: {},
        component: FormCreateUpdateOrderItem,
        onConfirmCreate: this.createObject,
      },
      Read: {
        modalTitle: "Detalle del item del pedido",
        objectData: {},
        component: VerDetalleOrderItem,
        onOpenRead: this.readObject
      },
      Update: {
        modalTitle: "Actualizar item del pedido",
        objectData: {},
        component: FormCreateUpdateOrderItem,
        onOpenUpdate: this.openUpdateObject,
        onConfirmUpdate: this.updateObject,
      },
      Delete: {
        modalTitle: "Eliminar item del pedido",
        objectData: {},
        onConfirmDelete: this.deleteObject,
      },
      Deactivate: {
        modalTitle: "Desactivar item del pedido",
        objectData: {},
        onConfirmDeactivate: this.deactivateObject,
      },
      Activate: {
        modalTitle: "Activar item del pedido",
        objectData: {},
        onConfirmActivate: this.activateObject,
      },
      List: {
        columns: [
          { label: 'Nombre', field: 'amount'},
          { label: 'Acciones', field: 'actions'},
        ],
        rows: [],
        totalRows: 0,
        rowStyleClass: "selectable-row",
        paginationOptions: {
          setCurrentPage: 1,
          perPage: 10,
        },
      },
      Search: {
        enabled: true,
        valueToSearch: undefined,
      }    
    }
  },
  methods: {
   async openUpdateObject(propsRow) {
      const { data } = await this.$apollo.query({
        fetchPolicy: "no-cache",
        query: readOrderItem(`
          id
          amount
          observations
        `),
        variables: {
          where: {
            id: {
              exact: propsRow.row.id
            }
          }
        }
      })
      this.Update.objectData = JSON.parse(JSON.stringify(data.readOrderItem))
    },
    async createObject(objectData) {
      await this.$apollo.mutate({
        mutation: createOrderItems(),
        variables: {
          input: [objectData]
        }
      })
      this.$apollo.queries.searchOrderItems.refetch()
    },
    async readObject(propsRow) {
      const { data } = await this.$apollo.query({
        fetchPolicy: "no-cache",
        query: readOrderItem(`
          id
          amount
          observations
        `),
        variables: {
          where: {
            id: {
              exact: propsRow.row.id
            }
          }
        }
      })
      this.Read.objectData = data.readOrderItem
    },
    async updateObject(objectData) {
      await this.$apollo.mutate({
        mutation: updateOrderItems(),
        variables: {
          input: [objectData]
        }
      })
      this.$apollo.queries.searchOrderItems.refetch()
    },
    async deleteObject(objectData) {
      await this.$apollo.mutate({
        mutation: deleteOrderItems(),
        variables: {
          where: {
            id: {
              exact: objectData.id
            }
          }
        }
      })
      this.$apollo.queries.searchOrderItems.refetch()
    },
    async deactivateObject(objectData) {
      await this.$apollo.mutate({
        mutation: deactivateOrderItems(),
        variables: {
          where: {
            id: {
              exact: objectData.id
            }
          }
        }
      })
      this.$apollo.queries.searchOrderItems.refetch()
    },
    async activateObject(objectData) {
      await this.$apollo.mutate({
        mutation: activateOrderItems(),
        variables: {
          where: {
            id: {
              exact: objectData.id
            }
          }
        }
      })
      this.$apollo.queries.searchOrderItems.refetch()
    },
  },
  apollo: {
    searchOrderItems: {
      query: searchOrderItems(`
        id
        amount
        observations
        isActive
      `),
      variables() {
        let advancedSearch = this.Search.valueToSearch ? [
            {
              fieldsAndFilters: [
                {field: "amount", filter: "icontains"}
              ],
              searchValues: [
                this.Search.valueToSearch
              ]
            }
          ] : undefined;
        return {
          page: this.List.paginationOptions.setCurrentPage,
          pageSize: this.List.paginationOptions.perPage,
          advancedSearch
        }
      },
      result(response) {
        let { data } = response
        let { objects } = data.searchOrderItems
        this.List.totalRows = data.searchOrderItems.total
        this.List.rows = objects
      }
    }
  }
}
</script>

<style>
.selectable-row {
  cursor: pointer;
}
.selectable-row:hover {
  background-color: #eee;
}
</style>