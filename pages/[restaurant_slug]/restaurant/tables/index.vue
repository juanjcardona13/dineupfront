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
import ComponentFormCreateUpdateTable from "~/components/dineUp/restaurant/Table/createUpdate.vue"
import ComponentVerDetalleTable from "@/components/dineUp/restaurant/Table/read.vue"
import { useAppBusinessLogicStore } from "~/stores/app-business-logic";


const FormCreateUpdateTable = shallowRef(ComponentFormCreateUpdateTable);
const VerDetalleTable = shallowRef(ComponentVerDetalleTable);


definePageMeta({
  middleware: "middleware-auth",
})

export default {
  data() {
    return {
      header: {
        title: "Mesas",
      }, 
      Create: {
        modalTitle: "Crear nueva mesa",
        objectData: {},
        showFields: {
          branch: false,
          capacity: false,
          status: false
        },
        component: FormCreateUpdateTable,
        onConfirmCreate: this.createObject,
      },
      Read: {
        modalTitle: "Detalle de la mesa",
        objectData: {},
        component: VerDetalleTable,
        onOpenRead: this.readObject
      },
      Update: {
        modalTitle: "Actualizar mesa",
        objectData: {},
        showFields: {
          branch: false,
          capacity: false,
          status: false
        },
        component: FormCreateUpdateTable,
        onOpenUpdate: this.openUpdateObject,
        onConfirmUpdate: this.updateObject,
      },
      Delete: {
        modalTitle: "Eliminar mesa",
        objectData: {},
        onConfirmDelete: this.deleteObject,
      },
      Deactivate: {
        modalTitle: "Desactivar mesa",
        objectData: {},
        onConfirmDeactivate: this.deactivateObject,
      },
      Activate: {
        modalTitle: "Activar mesa",
        objectData: {},
        onConfirmActivate: this.activateObject,
      },
      List: {
        columns: [
          { label: 'Nombre', field: 'identifier'},
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
        query: readTable(`
          id
          identifier
          capacity
          locationDescription
          status
        `),
        variables: {
          where: {
            id: {
              exact: propsRow.row.id
            }
          }
        }
      })
      this.Update.objectData = JSON.parse(JSON.stringify(data.readTable))
    },
    async createObject(objectData) {
      if (!objectData.branch) {
        const businessLogicStore = useAppBusinessLogicStore()
        const globalRestaurant = businessLogicStore.getGlobalRestaurant
        if (globalRestaurant?.id) {
          objectData.branch = globalRestaurant.paginatedBranches.objects[0].id
        }
      }
      await executeMutation(createTables(), { input: [objectData] })
      this.$apollo.queries.searchTables.refetch()
    },
    async readObject(propsRow) {
      const { data } = await this.$apollo.query({
        fetchPolicy: "no-cache",
        query: readTable(`
          id
          identifier
          capacity
          qrCode
          locationDescription
          status
        `),
        variables: {
          where: {
            id: {
              exact: propsRow.row.id
            }
          }
        }
      })
      this.Read.objectData = data.readTable
    },
    async updateObject(objectData) {
      await this.$apollo.mutate({
        mutation: updateTables(),
        variables: {
          input: [objectData]
        }
      })
      this.$apollo.queries.searchTables.refetch()
    },
    async deleteObject(objectData) {
      await this.$apollo.mutate({
        mutation: deleteTables(),
        variables: {
          where: {
            id: {
              exact: objectData.id
            }
          }
        }
      })
      this.$apollo.queries.searchTables.refetch()
    },
    async deactivateObject(objectData) {
      await this.$apollo.mutate({
        mutation: deactivateTables(),
        variables: {
          where: {
            id: {
              exact: objectData.id
            }
          }
        }
      })
      this.$apollo.queries.searchTables.refetch()
    },
    async activateObject(objectData) {
      await this.$apollo.mutate({
        mutation: activateTables(),
        variables: {
          where: {
            id: {
              exact: objectData.id
            }
          }
        }
      })
      this.$apollo.queries.searchTables.refetch()
    },
  },
  apollo: {
    searchTables: {
      query: searchTables(`
        id
        identifier
        capacity
        locationDescription
        status
        isActive
      `),
      variables() {
        const businessLogicStore = useAppBusinessLogicStore();
        const globalRestaurant = businessLogicStore.getGlobalRestaurant;
        const getRestaurantSearch = (restaurantId) => {
          return {
            fieldsAndFilters: [{ field: "branch__restaurant__pk" }],
            searchValues: [restaurantId],
          };
        };
        const getIdentifierSearch = (valueToSearch) => {
          return {
            fieldsAndFilters: [{ field: "identifier", filter: "icontains" }],
            searchValues: [valueToSearch],
          };
        };
        const advancedSearch = globalRestaurant?.id || this.Search.valueToSearch ? [] : undefined;
        if (globalRestaurant?.id) {
          advancedSearch.push(getRestaurantSearch(globalRestaurant.id));
        }
        if (this.Search.valueToSearch) {
          advancedSearch.push(getIdentifierSearch(this.Search.valueToSearch));
        }
        return {
          page: this.List.paginationOptions.setCurrentPage,
          pageSize: this.List.paginationOptions.perPage,
          advancedSearch
        }
      },
      result(response) {
        let { data } = response
        let { objects } = data.searchTables
        this.List.totalRows = data.searchTables.total
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