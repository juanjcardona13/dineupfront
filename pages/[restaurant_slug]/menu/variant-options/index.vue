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
import ComponentFormCreateUpdateVariantOption from "~/components/dineUp/menu/VariantOption/createUpdate.vue"
import ComponentVerDetalleVariantOption from "@/components/dineUp/menu/VariantOption/read.vue"
import { shallowRef } from 'vue';


const FormCreateUpdateVariantOption = shallowRef(ComponentFormCreateUpdateVariantOption);
const VerDetalleVariantOption = shallowRef(ComponentVerDetalleVariantOption);


definePageMeta({
  middleware: "middleware-auth",
})

export default {
  data() {
    return {
      header: {
        title: "Opciones de las variantes",
      }, 
      Create: {
        modalTitle: "Crear nueva opción de variante",
        objectData: {},
        component: FormCreateUpdateVariantOption,
        onConfirmCreate: this.createObject,
      },
      Read: {
        modalTitle: "Detalle de la opción de variante",
        objectData: {},
        component: VerDetalleVariantOption,
        onOpenRead: this.readObject
      },
      Update: {
        modalTitle: "Actualizar opción de variante",
        objectData: {},
        component: FormCreateUpdateVariantOption,
        onOpenUpdate: this.openUpdateObject,
        onConfirmUpdate: this.updateObject,
      },
      Delete: {
        modalTitle: "Eliminar opción de variante",
        objectData: {},
        onConfirmDelete: this.deleteObject,
      },
      Deactivate: {
        modalTitle: "Desactivar opción de variante",
        objectData: {},
        onConfirmDeactivate: this.deactivateObject,
      },
      Activate: {
        modalTitle: "Activar opción de variante",
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
        query: readVariantOption(`
          id
          name
          price
          description
          isDefault
        `),
        variables: {
          where: {
            id: {
              exact: propsRow.row.id
            }
          }
        }
      })
      this.Update.objectData = JSON.parse(JSON.stringify(data.readVariantOption))
    },
    async createObject(objectData) {
      await this.$apollo.mutate({
        mutation: createVariantOptions(),
        variables: {
          input: [objectData]
        }
      })
      this.$apollo.queries.searchVariantOptions.refetch()
    },
    async readObject(propsRow) {
      const { data } = await this.$apollo.query({
        fetchPolicy: "no-cache",
        query: readVariantOption(`
          id
          name
          price
          description
          isDefault
        `),
        variables: {
          where: {
            id: {
              exact: propsRow.row.id
            }
          }
        }
      })
      this.Read.objectData = data.readVariantOption
    },
    async updateObject(objectData) {
      await this.$apollo.mutate({
        mutation: updateVariantOptions(),
        variables: {
          input: [objectData]
        }
      })
      this.$apollo.queries.searchVariantOptions.refetch()
    },
    async deleteObject(objectData) {
      await this.$apollo.mutate({
        mutation: deleteVariantOptions(),
        variables: {
          where: {
            id: {
              exact: objectData.id
            }
          }
        }
      })
      this.$apollo.queries.searchVariantOptions.refetch()
    },
    async deactivateObject(objectData) {
      await this.$apollo.mutate({
        mutation: deactivateVariantOptions(),
        variables: {
          where: {
            id: {
              exact: objectData.id
            }
          }
        }
      })
      this.$apollo.queries.searchVariantOptions.refetch()
    },
    async activateObject(objectData) {
      await this.$apollo.mutate({
        mutation: activateVariantOptions(),
        variables: {
          where: {
            id: {
              exact: objectData.id
            }
          }
        }
      })
      this.$apollo.queries.searchVariantOptions.refetch()
    },
  },
  apollo: {
    searchVariantOptions: {
      query: searchVariantOptions(`
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
        let { objects } = data.searchVariantOptions
        this.List.totalRows = data.searchVariantOptions.total
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