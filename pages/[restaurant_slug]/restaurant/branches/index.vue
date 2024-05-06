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
import ComponentFormCreateUpdateBranch from "~/components/dineUp/restaurant/Branch/createUpdate.vue"
import ComponentVerDetalleBranch from "@/components/dineUp/restaurant/Branch/read.vue"
import { useAppBusinessLogicStore } from "~/stores/app-business-logic";

const FormCreateUpdateBranch = shallowRef(ComponentFormCreateUpdateBranch);
const VerDetalleBranch = shallowRef(ComponentVerDetalleBranch);


definePageMeta({
  middleware: "middleware-auth",
})

export default {
  data() {
    return {
      header: {
        title: "Sucursales",
      }, 
      Create: {
        modalTitle: "Crear nueva sucursal",
        objectData: {},
        showFields: {
          restaurant: false,
          isMain: false
        },
        component: FormCreateUpdateBranch,
        onConfirmCreate: this.createObject,
      },
      Read: {
        modalTitle: "Detalle del nombre_singular",
        objectData: {},
        component: VerDetalleBranch,
        onOpenRead: this.readObject
      },
      Update: {
        modalTitle: "Actualizar nombre_singular",
        objectData: {},
        showFields: {
          restaurant: false,
          isMain: false
        },
        component: FormCreateUpdateBranch,
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
        query: readBranch(`
          id
          name
          address
          addressDetail
          isMain
          email
          website
          postalCode
        `),
        variables: {
          where: {
            id: {
              exact: propsRow.row.id
            }
          }
        }
      })
      this.Update.objectData = JSON.parse(JSON.stringify(data.readBranch))
    },
    async createObject(objectData) {
      if (!objectData.restaurant) {
        const businessLogicStore = useAppBusinessLogicStore()
        const globalRestaurant = businessLogicStore.getGlobalRestaurant
        if (globalRestaurant?.id) {
          objectData.restaurant = globalRestaurant.id
        }
      }
      await executeMutation(createBranches(), { input: [objectData] })
      this.$apollo.queries.searchBranches.refetch()
    },
    async readObject(propsRow) {
      const { data } = await this.$apollo.query({
        fetchPolicy: "no-cache",
        query: readBranch(`
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
      this.Read.objectData = data.readBranch
    },
    async updateObject(objectData) {
      await this.$apollo.mutate({
        mutation: updateBranches(),
        variables: {
          input: [objectData]
        }
      })
      this.$apollo.queries.searchBranches.refetch()
    },
    async deleteObject(objectData) {
      await this.$apollo.mutate({
        mutation: deleteBranches(),
        variables: {
          where: {
            id: {
              exact: objectData.id
            }
          }
        }
      })
      this.$apollo.queries.searchBranches.refetch()
    },
    async deactivateObject(objectData) {
      await this.$apollo.mutate({
        mutation: deactivateBranches(),
        variables: {
          where: {
            id: {
              exact: objectData.id
            }
          }
        }
      })
      this.$apollo.queries.searchBranches.refetch()
    },
    async activateObject(objectData) {
      await this.$apollo.mutate({
        mutation: activateBranches(),
        variables: {
          where: {
            id: {
              exact: objectData.id
            }
          }
        }
      })
      this.$apollo.queries.searchBranches.refetch()
    },
  },
  apollo: {
    searchBranches: {
      query: searchBranches(`
        id
        name
        isActive
      `),
      variables() {
        const businessLogicStore = useAppBusinessLogicStore()
        const globalRestaurant = businessLogicStore.getGlobalRestaurant
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
          fieldsOfModel: {
            restaurant: globalRestaurant?.id
          },
          advancedSearch
        }
      },
      result(response) {
        let { data } = response
        let { objects } = data.searchBranches
        this.List.totalRows = data.searchBranches.total
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