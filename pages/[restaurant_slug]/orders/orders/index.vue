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
import ComponentFormCreateUpdateOrder from "~/components/dineUp/orders/Order/createUpdate.vue"
import ComponentVerDetalleOrder from "@/components/dineUp/orders/Order/read.vue"
import { useAppBusinessLogicStore } from "~/stores/app-business-logic";


const FormCreateUpdateOrder = shallowRef(ComponentFormCreateUpdateOrder);
const VerDetalleOrder = shallowRef(ComponentVerDetalleOrder);


definePageMeta({
  middleware: "middleware-auth",
})

export default {
  data() {
    return {
      header: {
        title: "Pedidos",
      }, 
      Create: {
        modalTitle: "Crear nuevo pedido",
        objectData: {},
        showFields: {
          number: false,
          diner: false,
          status: false,
          waiter: false
        },
        component: FormCreateUpdateOrder,
        onConfirmCreate: this.createObject,
      },
      Read: {
        modalTitle: "Detalle del pedido",
        objectData: {},
        component: VerDetalleOrder,
        onOpenRead: this.readObject
      },
      Update: {
        modalTitle: "Actualizar pedido",
        objectData: {},
        showFields: {
          number: false,
          diner: false,
          status: false,
          waiter: false
        },
        component: FormCreateUpdateOrder,
        onOpenUpdate: this.openUpdateObject,
        onConfirmUpdate: this.updateObject,
      },
      Delete: {
        modalTitle: "Eliminar pedido",
        objectData: {},
        onConfirmDelete: this.deleteObject,
      },
      Deactivate: {
        modalTitle: "Desactivar pedido",
        objectData: {},
        onConfirmDeactivate: this.deactivateObject,
      },
      Activate: {
        modalTitle: "Activar pedido",
        objectData: {},
        onConfirmActivate: this.activateObject,
      },
      List: {
        columns: [
          { label: 'Numero', field: 'number'},
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
        query: readOrder(`
          id
          number
        `),
        variables: {
          where: {
            id: {
              exact: propsRow.row.id
            }
          }
        }
      })
      this.Update.objectData = JSON.parse(JSON.stringify(data.readOrder))
    },
    async createObject(objectData) {
      let objectDataCopy = JSON.parse(JSON.stringify(objectData))
      objectDataCopy = removeEmptyNestedObjectsAndArrays(objectDataCopy)
      await executeMutation(createOrders(), { input: [objectDataCopy] })
      this.$apollo.queries.searchOrders.refetch()
    },
    async readObject(propsRow) {
      const { data } = await this.$apollo.query({
        fetchPolicy: "no-cache",
        query: readOrder(`
          id
          number
        `),
        variables: {
          where: {
            id: {
              exact: propsRow.row.id
            }
          }
        }
      })
      this.Read.objectData = data.readOrder
    },
    async updateObject(objectData) {
      await this.$apollo.mutate({
        mutation: updateOrders(),
        variables: {
          input: [objectData]
        }
      })
      this.$apollo.queries.searchOrders.refetch()
    },
    async deleteObject(objectData) {
      await this.$apollo.mutate({
        mutation: deleteOrders(),
        variables: {
          where: {
            id: {
              exact: objectData.id
            }
          }
        }
      })
      this.$apollo.queries.searchOrders.refetch()
    },
    async deactivateObject(objectData) {
      await this.$apollo.mutate({
        mutation: deactivateOrders(),
        variables: {
          where: {
            id: {
              exact: objectData.id
            }
          }
        }
      })
      this.$apollo.queries.searchOrders.refetch()
    },
    async activateObject(objectData) {
      await this.$apollo.mutate({
        mutation: activateOrders(),
        variables: {
          where: {
            id: {
              exact: objectData.id
            }
          }
        }
      })
      this.$apollo.queries.searchOrders.refetch()
    },
  },
  apollo: {
    searchOrders: {
      query: searchOrders(`
        id
        number
        isActive
      `),
      variables() {
        const businessLogicStore = useAppBusinessLogicStore()
        const globalRestaurant = businessLogicStore.getGlobalRestaurant
        let advancedSearch = this.Search.valueToSearch ? [
            {
              fieldsAndFilters: [
                {field: "number", filter: "icontains"}
              ],
              searchValues: [
                this.Search.valueToSearch
              ]
            }
          ] : undefined;
        return {
          page: this.List.paginationOptions.setCurrentPage,
          pageSize: this.List.paginationOptions.perPage,
          fieldsOfModel: {
            restaurant: globalRestaurant?.id
          },
          advancedSearch
        }
      },
      result(response) {
        let { data } = response
        let { objects } = data.searchOrders
        this.List.totalRows = data.searchOrders.total
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