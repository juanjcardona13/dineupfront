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
import ComponentFormCreateUpdateOptionGroup from "~/components/dineUp/menu/OptionGroup/createUpdate.vue"
import ComponentVerDetalleOptionGroup from "@/components/dineUp/menu/OptionGroup/read.vue"
import { shallowRef } from 'vue';


const FormCreateUpdateOptionGroup = shallowRef(ComponentFormCreateUpdateOptionGroup);
const VerDetalleOptionGroup = shallowRef(ComponentVerDetalleOptionGroup);


definePageMeta({
  middleware: "middleware-auth",
})

export default {
  data() {
    return {
      header: {
        title: "Grupo de opciones",
      }, 
      Create: {
        modalTitle: "Crear nuevo grupo de opciones",
        objectData: {},
        component: FormCreateUpdateOptionGroup,
        onConfirmCreate: this.createObject,
      },
      Read: {
        modalTitle: "Detalle del grupo de opciones",
        objectData: {},
        component: VerDetalleOptionGroup,
        onOpenRead: this.readObject
      },
      Update: {
        modalTitle: "Actualizar grupo de opciones",
        objectData: {},
        component: FormCreateUpdateOptionGroup,
        onOpenUpdate: this.openUpdateObject,
        onConfirmUpdate: this.updateObject,
      },
      Delete: {
        modalTitle: "Eliminar grupo de opciones",
        objectData: {},
        onConfirmDelete: this.deleteObject,
      },
      Deactivate: {
        modalTitle: "Desactivar grupo de opciones",
        objectData: {},
        onConfirmDeactivate: this.deactivateObject,
      },
      Activate: {
        modalTitle: "Activar grupo de opciones",
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
        query: readOptionGroup(`
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
      this.Update.objectData = JSON.parse(JSON.stringify(data.readOptionGroup))
    },
    async createObject(objectData) {
      await this.$apollo.mutate({
        mutation: createOptionGroups(),
        variables: {
          input: [objectData]
        }
      })
      this.$apollo.queries.searchOptionGroups.refetch()
    },
    async readObject(propsRow) {
      const { data } = await this.$apollo.query({
        fetchPolicy: "no-cache",
        query: readOptionGroup(`
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
      this.Read.objectData = data.readOptionGroup
    },
    async updateObject(objectData) {
      await this.$apollo.mutate({
        mutation: updateOptionGroups(),
        variables: {
          input: [objectData]
        }
      })
      this.$apollo.queries.searchOptionGroups.refetch()
    },
    async deleteObject(objectData) {
      await this.$apollo.mutate({
        mutation: deleteOptionGroups(),
        variables: {
          where: {
            id: {
              exact: objectData.id
            }
          }
        }
      })
      this.$apollo.queries.searchOptionGroups.refetch()
    },
    async deactivateObject(objectData) {
      await this.$apollo.mutate({
        mutation: deactivateOptionGroups(),
        variables: {
          where: {
            id: {
              exact: objectData.id
            }
          }
        }
      })
      this.$apollo.queries.searchOptionGroups.refetch()
    },
    async activateObject(objectData) {
      await this.$apollo.mutate({
        mutation: activateOptionGroups(),
        variables: {
          where: {
            id: {
              exact: objectData.id
            }
          }
        }
      })
      this.$apollo.queries.searchOptionGroups.refetch()
    },
  },
  apollo: {
    searchOptionGroups: {
      query: searchOptionGroups(`
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
        let { objects } = data.searchOptionGroups
        this.List.totalRows = data.searchOptionGroups.total
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