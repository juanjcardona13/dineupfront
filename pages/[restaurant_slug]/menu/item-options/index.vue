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
import ComponentFormCreateUpdateItemOption from "~/components/dineUp/menu/ItemOption/createUpdate.vue"
import ComponentVerDetalleItemOption from "@/components/dineUp/menu/ItemOption/read.vue"
import { shallowRef } from 'vue';


const FormCreateUpdateItemOption = shallowRef(ComponentFormCreateUpdateItemOption);
const VerDetalleItemOption = shallowRef(ComponentVerDetalleItemOption);


definePageMeta({
  middleware: "middleware-auth",
})

export default {
  data() {
    return {
      header: {
        title: "Item de los grupos de opciones",
      }, 
      Create: {
        modalTitle: "Crear nuevo ítem",
        objectData: {},
        component: FormCreateUpdateItemOption,
        onConfirmCreate: this.createObject,
      },
      Read: {
        modalTitle: "Detalle del ítem",
        objectData: {},
        component: VerDetalleItemOption,
        onOpenRead: this.readObject
      },
      Update: {
        modalTitle: "Actualizar ítem",
        objectData: {},
        component: FormCreateUpdateItemOption,
        onOpenUpdate: this.openUpdateObject,
        onConfirmUpdate: this.updateObject,
      },
      Delete: {
        modalTitle: "Eliminar ítem",
        objectData: {},
        onConfirmDelete: this.deleteObject,
      },
      Deactivate: {
        modalTitle: "Desactivar ítem",
        objectData: {},
        onConfirmDeactivate: this.deactivateObject,
      },
      Activate: {
        modalTitle: "Activar ítem",
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
        query: readItemOption(`
          id
          nameType
          isRequired
          isMultiple
          minimum
          maximum
          name
          description
          price
        `),
        variables: {
          where: {
            id: {
              exact: propsRow.row.id
            }
          }
        }
      })
      this.Update.objectData = JSON.parse(JSON.stringify(data.readItemOption))
    },
    async createObject(objectData) {
      await this.$apollo.mutate({
        mutation: createItemOptions(),
        variables: {
          input: [objectData]
        }
      })
      this.$apollo.queries.searchItemOptions.refetch()
    },
    async readObject(propsRow) {
      const { data } = await this.$apollo.query({
        fetchPolicy: "no-cache",
        query: readItemOption(`
          id
          nameType
          isRequired
          isMultiple
          minimum
          maximum
          name
          description
          price
        `),
        variables: {
          where: {
            id: {
              exact: propsRow.row.id
            }
          }
        }
      })
      this.Read.objectData = data.readItemOption
    },
    async updateObject(objectData) {
      await this.$apollo.mutate({
        mutation: updateItemOptions(),
        variables: {
          input: [objectData]
        }
      })
      this.$apollo.queries.searchItemOptions.refetch()
    },
    async deleteObject(objectData) {
      await this.$apollo.mutate({
        mutation: deleteItemOptions(),
        variables: {
          where: {
            id: {
              exact: objectData.id
            }
          }
        }
      })
      this.$apollo.queries.searchItemOptions.refetch()
    },
    async deactivateObject(objectData) {
      await this.$apollo.mutate({
        mutation: deactivateItemOptions(),
        variables: {
          where: {
            id: {
              exact: objectData.id
            }
          }
        }
      })
      this.$apollo.queries.searchItemOptions.refetch()
    },
    async activateObject(objectData) {
      await this.$apollo.mutate({
        mutation: activateItemOptions(),
        variables: {
          where: {
            id: {
              exact: objectData.id
            }
          }
        }
      })
      this.$apollo.queries.searchItemOptions.refetch()
    },
  },
  apollo: {
    searchItemOptions: {
      query: searchItemOptions(`
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
        let { objects } = data.searchItemOptions
        this.List.totalRows = data.searchItemOptions.total
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