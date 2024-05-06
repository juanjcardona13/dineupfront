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
import ComponentFormCreateUpdateOrderItemOption from "~/components/dineUp/orders/OrderItemOption/createUpdate.vue"
import ComponentVerDetalleOrderItemOption from "@/components/dineUp/orders/OrderItemOption/read.vue"
import { shallowRef } from 'vue';


const FormCreateUpdateOrderItemOption = shallowRef(ComponentFormCreateUpdateOrderItemOption);
const VerDetalleOrderItemOption = shallowRef(ComponentVerDetalleOrderItemOption);


definePageMeta({
  middleware: "middleware-auth",
})

export default {
  data() {
    return {
      header: {
        title: "Opciones personalizadas",
      }, 
      Create: {
        modalTitle: "Crear nueva opción personalizada",
        objectData: {},
        component: FormCreateUpdateOrderItemOption,
        onConfirmCreate: this.createObject,
      },
      Read: {
        modalTitle: "Detalle de la opción personalizada",
        objectData: {},
        component: VerDetalleOrderItemOption,
        onOpenRead: this.readObject
      },
      Update: {
        modalTitle: "Actualizar opción personalizada",
        objectData: {},
        component: FormCreateUpdateOrderItemOption,
        onOpenUpdate: this.openUpdateObject,
        onConfirmUpdate: this.updateObject,
      },
      Delete: {
        modalTitle: "Eliminar opción personalizada",
        objectData: {},
        onConfirmDelete: this.deleteObject,
      },
      Deactivate: {
        modalTitle: "Desactivar opción personalizada",
        objectData: {},
        onConfirmDeactivate: this.deactivateObject,
      },
      Activate: {
        modalTitle: "Activar opción personalizada",
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
        query: readOrderItemOption(`
          id
          amount
        `),
        variables: {
          where: {
            id: {
              exact: propsRow.row.id
            }
          }
        }
      })
      this.Update.objectData = JSON.parse(JSON.stringify(data.readOrderItemOption))
    },
    async createObject(objectData) {
      await this.$apollo.mutate({
        mutation: createOrderItemOptions(),
        variables: {
          input: [objectData]
        }
      })
      this.$apollo.queries.searchOrderItemOptions.refetch()
    },
    async readObject(propsRow) {
      const { data } = await this.$apollo.query({
        fetchPolicy: "no-cache",
        query: readOrderItemOption(`
          id
          amount
        `),
        variables: {
          where: {
            id: {
              exact: propsRow.row.id
            }
          }
        }
      })
      this.Read.objectData = data.readOrderItemOption
    },
    async updateObject(objectData) {
      await this.$apollo.mutate({
        mutation: updateOrderItemOptions(),
        variables: {
          input: [objectData]
        }
      })
      this.$apollo.queries.searchOrderItemOptions.refetch()
    },
    async deleteObject(objectData) {
      await this.$apollo.mutate({
        mutation: deleteOrderItemOptions(),
        variables: {
          where: {
            id: {
              exact: objectData.id
            }
          }
        }
      })
      this.$apollo.queries.searchOrderItemOptions.refetch()
    },
    async deactivateObject(objectData) {
      await this.$apollo.mutate({
        mutation: deactivateOrderItemOptions(),
        variables: {
          where: {
            id: {
              exact: objectData.id
            }
          }
        }
      })
      this.$apollo.queries.searchOrderItemOptions.refetch()
    },
    async activateObject(objectData) {
      await this.$apollo.mutate({
        mutation: activateOrderItemOptions(),
        variables: {
          where: {
            id: {
              exact: objectData.id
            }
          }
        }
      })
      this.$apollo.queries.searchOrderItemOptions.refetch()
    },
  },
  apollo: {
    searchOrderItemOptions: {
      query: searchOrderItemOptions(`
        id
        amount
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
        let { objects } = data.searchOrderItemOptions
        this.List.totalRows = data.searchOrderItemOptions.total
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