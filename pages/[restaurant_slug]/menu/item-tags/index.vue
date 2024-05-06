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
import ComponentFormCreateUpdateItemTag from "~/components/dineUp/menu/ItemTag/createUpdate.vue"
import ComponentVerDetalleItemTag from "@/components/dineUp/menu/ItemTag/read.vue"
import { shallowRef } from 'vue';


const FormCreateUpdateItemTag = shallowRef(ComponentFormCreateUpdateItemTag);
const VerDetalleItemTag = shallowRef(ComponentVerDetalleItemTag);


definePageMeta({
  middleware: "middleware-auth",
})

export default {
  data() {
    return {
      header: {
        title: "Etiquetas",
      }, 
      Create: {
        modalTitle: "Crear nueva etiqueta",
        objectData: {},
        component: FormCreateUpdateItemTag,
        onConfirmCreate: this.createObject,
      },
      Read: {
        modalTitle: "Detalle de la etiqueta",
        objectData: {},
        component: VerDetalleItemTag,
        onOpenRead: this.readObject
      },
      Update: {
        modalTitle: "Actualizar etiqueta",
        objectData: {},
        component: FormCreateUpdateItemTag,
        onOpenUpdate: this.openUpdateObject,
        onConfirmUpdate: this.updateObject,
      },
      Delete: {
        modalTitle: "Eliminar etiqueta",
        objectData: {},
        onConfirmDelete: this.deleteObject,
      },
      Deactivate: {
        modalTitle: "Desactivar etiqueta",
        objectData: {},
        onConfirmDeactivate: this.deactivateObject,
      },
      Activate: {
        modalTitle: "Activar etiqueta",
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
        query: readItemTag(`
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
      this.Update.objectData = JSON.parse(JSON.stringify(data.readItemTag))
    },
    async createObject(objectData) {
      await this.$apollo.mutate({
        mutation: createItemTags(),
        variables: {
          input: [objectData]
        }
      })
      this.$apollo.queries.searchItemTags.refetch()
    },
    async readObject(propsRow) {
      const { data } = await this.$apollo.query({
        fetchPolicy: "no-cache",
        query: readItemTag(`
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
      this.Read.objectData = data.readItemTag
    },
    async updateObject(objectData) {
      await this.$apollo.mutate({
        mutation: updateItemTags(),
        variables: {
          input: [objectData]
        }
      })
      this.$apollo.queries.searchItemTags.refetch()
    },
    async deleteObject(objectData) {
      await this.$apollo.mutate({
        mutation: deleteItemTags(),
        variables: {
          where: {
            id: {
              exact: objectData.id
            }
          }
        }
      })
      this.$apollo.queries.searchItemTags.refetch()
    },
    async deactivateObject(objectData) {
      await this.$apollo.mutate({
        mutation: deactivateItemTags(),
        variables: {
          where: {
            id: {
              exact: objectData.id
            }
          }
        }
      })
      this.$apollo.queries.searchItemTags.refetch()
    },
    async activateObject(objectData) {
      await this.$apollo.mutate({
        mutation: activateItemTags(),
        variables: {
          where: {
            id: {
              exact: objectData.id
            }
          }
        }
      })
      this.$apollo.queries.searchItemTags.refetch()
    },
  },
  apollo: {
    searchItemTags: {
      query: searchItemTags(`
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
        let { objects } = data.searchItemTags
        this.List.totalRows = data.searchItemTags.total
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