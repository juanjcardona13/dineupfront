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
import ComponentFormCreateUpdateNameModel from "~/components/dineUp/app/NameModel/createUpdate.vue"
import ComponentVerDetalleNameModel from "@/components/dineUp/app/NameModel/read.vue"
import { shallowRef } from 'vue';


const FormCreateUpdateNameModel = shallowRef(ComponentFormCreateUpdateNameModel);
const VerDetalleNameModel = shallowRef(ComponentVerDetalleNameModel);


definePageMeta({
  middleware: "middleware-auth",
})

export default {
  data() {
    return {
      header: {
        title: "Nombre plural",
      },
      Create: {
        modalTitle: "Crear nuevo nombre_singular",
        objectData: {},
        component: FormCreateUpdateNameModel,
        onConfirmCreate: this.createObject,
      },
      Read: {
        modalTitle: "Detalle del nombre_singular",
        objectData: {},
        component: VerDetalleNameModel,
        onOpenRead: this.readObject
      },
      Update: {
        modalTitle: "Actualizar nombre_singular",
        objectData: {},
        component: FormCreateUpdateNameModel,
        onOpenUpdate: this.openUpdateObject,
        onConfirmUpdate: this.updateObject,
      },
      Delete: {
        modalTitle: "Eliminar nombre_singular",
        objectData: {},
        onConfirmDelete: this.deleteObject,
      },
      Deactivate: {
        modalTitle: "Desactivar nombre_singular",
        objectData: {},
        onConfirmDeactivate: this.deactivateObject,
      },
      Activate: {
        modalTitle: "Activar nombre_singular",
        objectData: {},
        onConfirmActivate: this.activateObject,
      },
      List: {
        columns: [
          { label: 'Nombre', field: 'name' },
          { label: 'Acciones', field: 'actions' },
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
        query: readNameModel(`
          id
        `),
        variables: {
          where: {
            id: {
              exact: propsRow.row.id
            }
          }
        }
      })
      this.Update.objectData = JSON.parse(JSON.stringify(data.readNameModel))
    },
    async createObject(objectData) {
      await this.$apollo.mutate({
        mutation: createNameModelPlural(),
        variables: {
          input: [objectData]
        }
      })
      this.$apollo.queries.searchNameModelPlural.refetch()
    },
    async readObject(propsRow) {
      const { data } = await this.$apollo.query({
        fetchPolicy: "no-cache",
        query: readNameModel(`
          id
        `),
        variables: {
          where: {
            id: {
              exact: propsRow.row.id
            }
          }
        }
      })
      this.Read.objectData = data.readNameModel
    },
    async updateObject(objectData) {
      await this.$apollo.mutate({
        mutation: updateNameModelPlural(),
        variables: {
          input: [objectData]
        }
      })
      this.$apollo.queries.searchNameModelPlural.refetch()
    },
    async deleteObject(objectData) {
      await this.$apollo.mutate({
        mutation: deleteNameModelPlural(),
        variables: {
          where: {
            id: {
              exact: objectData.id
            }
          }
        }
      })
      this.$apollo.queries.searchNameModelPlural.refetch()
    },
    async deactivateObject(objectData) {
      await this.$apollo.mutate({
        mutation: deactivateNameModelPlural(),
        variables: {
          where: {
            id: {
              exact: objectData.id
            }
          }
        }
      })
      this.$apollo.queries.searchNameModelPlural.refetch()
    },
    async activateObject(objectData) {
      await this.$apollo.mutate({
        mutation: activateNameModelPlural(),
        variables: {
          where: {
            id: {
              exact: objectData.id
            }
          }
        }
      })
      this.$apollo.queries.searchNameModelPlural.refetch()
    },
  },
  apollo: {
    searchNameModelPlural: {
      query: searchNameModelPlural(`
        id
        isActive
      `),
      variables() {
        let advancedSearch = this.Search.valueToSearch ? [
          {
            fieldsAndFilters: [
              { field: "name", filter: "icontains" }
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
        let { objects } = data.searchNameModelPlural
        this.List.totalRows = data.searchNameModelPlural.total
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