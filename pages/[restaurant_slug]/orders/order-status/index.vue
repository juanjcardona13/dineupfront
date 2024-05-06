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
import ComponentFormCreateUpdateOrderStatus from "~/components/dineUp/orders/OrderStatus/createUpdate.vue"
import ComponentVerDetalleOrderStatus from "@/components/dineUp/orders/OrderStatus/read.vue"
import { shallowRef } from 'vue';


const FormCreateUpdateOrderStatus = shallowRef(ComponentFormCreateUpdateOrderStatus);
const VerDetalleOrderStatus = shallowRef(ComponentVerDetalleOrderStatus);


definePageMeta({
  middleware: "middleware-auth",
})

export default {
  data() {
    return {
      header: {
        title: "Estados",
      }, 
      Create: {
        modalTitle: "Crear nuevo estado",
        objectData: {},
        component: FormCreateUpdateOrderStatus,
        onConfirmCreate: this.createObject,
      },
      Read: {
        modalTitle: "Detalle del estado",
        objectData: {},
        component: VerDetalleOrderStatus,
        onOpenRead: this.readObject
      },
      Update: {
        modalTitle: "Actualizar estado",
        objectData: {},
        component: FormCreateUpdateOrderStatus,
        onOpenUpdate: this.openUpdateObject,
        onConfirmUpdate: this.updateObject,
      },
      Delete: {
        modalTitle: "Eliminar estado",
        objectData: {},
        onConfirmDelete: this.deleteObject,
      },
      Deactivate: {
        modalTitle: "Desactivar estado",
        objectData: {},
        onConfirmDeactivate: this.deactivateObject,
      },
      Activate: {
        modalTitle: "Activar estado",
        objectData: {},
        onConfirmActivate: this.activateObject,
      },
      List: {
        columns: [
          { label: 'Nombre', field: 'name'},
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
        query: readOrderStatus(`
          id
          name
        `),
        variables: {
          where: {
            id: {
              exact: propsRow.row.id
            }
          }
        }
      })
      this.Update.objectData = JSON.parse(JSON.stringify(data.readOrderStatus))
    },
    async createObject(objectData) {
      await this.$apollo.mutate({
        mutation: createOrderStatus(),
        variables: {
          input: [objectData]
        }
      })
      this.$apollo.queries.searchOrderStatus.refetch()
    },
    async readObject(propsRow) {
      const { data } = await this.$apollo.query({
        fetchPolicy: "no-cache",
        query: readOrderStatus(`
          id
          name
        `),
        variables: {
          where: {
            id: {
              exact: propsRow.row.id
            }
          }
        }
      })
      this.Read.objectData = data.readOrderStatus
    },
    async updateObject(objectData) {
      await this.$apollo.mutate({
        mutation: updateOrderStatus(),
        variables: {
          input: [objectData]
        }
      })
      this.$apollo.queries.searchOrderStatus.refetch()
    },
    async deleteObject(objectData) {
      await this.$apollo.mutate({
        mutation: deleteOrderStatus(),
        variables: {
          where: {
            id: {
              exact: objectData.id
            }
          }
        }
      })
      this.$apollo.queries.searchOrderStatus.refetch()
    },
    async deactivateObject(objectData) {
      await this.$apollo.mutate({
        mutation: deactivateOrderStatus(),
        variables: {
          where: {
            id: {
              exact: objectData.id
            }
          }
        }
      })
      this.$apollo.queries.searchOrderStatus.refetch()
    },
    async activateObject(objectData) {
      await this.$apollo.mutate({
        mutation: activateOrderStatus(),
        variables: {
          where: {
            id: {
              exact: objectData.id
            }
          }
        }
      })
      this.$apollo.queries.searchOrderStatus.refetch()
    },
  },
  apollo: {
    searchOrderStatus: {
      query: searchOrderStatus(`
        id
        name
        isActive
      `),
      variables() {
        let advancedSearch = this.Search.valueToSearch ? [
            {
              fieldsAndFilters: [
                {field: "name", filter: "icontains"}
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
        let { objects } = data.searchOrderStatus
        this.List.totalRows = data.searchOrderStatus.total
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