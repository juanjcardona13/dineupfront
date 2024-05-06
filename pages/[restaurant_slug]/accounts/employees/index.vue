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
import ComponentFormCreateUpdateEmployee from "~/components/dineUp/accounts/Employee/createUpdate.vue"
import ComponentVerDetalleEmployee from "@/components/dineUp/accounts/Employee/read.vue"
import { useAppBusinessLogicStore } from "~/stores/app-business-logic";


const FormCreateUpdateEmployee = shallowRef(ComponentFormCreateUpdateEmployee);
const VerDetalleEmployee = shallowRef(ComponentVerDetalleEmployee);


definePageMeta({
  middleware: "middleware-auth",
})

export default {
  data() {
    return {
      header: {
        title: "Empleados",
      }, 
      Create: {
        modalTitle: "Crear nuevo empleado",
        objectData: {},
        showFields: {
          restaurant: false,
          leader: false
        },
        component: FormCreateUpdateEmployee,
        onConfirmCreate: this.createObject,
      },
      Read: {
        modalTitle: "Detalle del empleado",
        objectData: {},
        component: VerDetalleEmployee,
        onOpenRead: this.readObject
      },
      Update: {
        modalTitle: "Actualizar empleado",
        objectData: {},
        showFields: {
          restaurant: false,
          leader: false
        },
        component: FormCreateUpdateEmployee,
        onOpenUpdate: this.openUpdateObject,
        onConfirmUpdate: this.updateObject,
      },
      Delete: {
        modalTitle: "Eliminar empleado",
        objectData: {},
        onConfirmDelete: this.deleteObject,
      },
      Deactivate: {
        modalTitle: "Desactivar empleado",
        objectData: {},
        onConfirmDeactivate: this.deactivateObject,
      },
      Activate: {
        modalTitle: "Activar empleado",
        objectData: {},
        onConfirmActivate: this.activateObject,
      },
      List: {
        columns: [
          { label: 'Nombre', field: 'dineUpUser.user.username'},
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
        query: readEmployee(`
          id
          dineUpUser {
            id
          }
          branches {
            id
          }
          role {
            id
          }
          leader {
            id
          }
        `),
        variables: {
          where: {
            id: {
              exact: propsRow.row.id
            }
          }
        }
      })
      this.Update.objectData = JSON.parse(JSON.stringify(data.readEmployee))
    },
    async createObject(objectData) {
      if (objectData.dineUpUser?.id) {
        objectData.dineUpUser = objectData.dineUpUser?.id
        if (!objectData.restaurants) {
          const businessLogicStore = useAppBusinessLogicStore()
          const globalRestaurant = businessLogicStore.getGlobalRestaurant
          if (globalRestaurant?.id) {
            objectData.restaurants = [globalRestaurant.id]
          }
        }
        await executeMutation(createEmployees(), { input: [objectData] })
        this.$apollo.queries.searchEmployees.refetch()
      } else {
        alert("usuario no encontrado")
      }
      
    },
    async readObject(propsRow) {
      const { data } = await this.$apollo.query({
        fetchPolicy: "no-cache",
        query: readEmployee(`
          id
          dineUpUser {
            id
          }
          branches {
            id
          }
          role {
            id
          }
          leader {
            id
          }
        `),
        variables: {
          where: {
            id: {
              exact: propsRow.row.id
            }
          }
        }
      })
      this.Read.objectData = data.readEmployee
    },
    async updateObject(objectData) {
      await this.$apollo.mutate({
        mutation: updateEmployees(),
        variables: {
          input: [objectData]
        }
      })
      this.$apollo.queries.searchEmployees.refetch()
    },
    async deleteObject(objectData) {
      await this.$apollo.mutate({
        mutation: deleteEmployees(),
        variables: {
          where: {
            id: {
              exact: objectData.id
            }
          }
        }
      })
      this.$apollo.queries.searchEmployees.refetch()
    },
    async deactivateObject(objectData) {
      await this.$apollo.mutate({
        mutation: deactivateEmployees(),
        variables: {
          where: {
            id: {
              exact: objectData.id
            }
          }
        }
      })
      this.$apollo.queries.searchEmployees.refetch()
    },
    async activateObject(objectData) {
      await this.$apollo.mutate({
        mutation: activateEmployees(),
        variables: {
          where: {
            id: {
              exact: objectData.id
            }
          }
        }
      })
      this.$apollo.queries.searchEmployees.refetch()
    },
  },
  apollo: {
    searchEmployees: {
      query: searchEmployees(`
        id
        dineUpUser {
          id
          user {
            id
            username
          }
        }
        isActive
      `),
      variables() {

        const businessLogicStore = useAppBusinessLogicStore()
        const globalRestaurant = businessLogicStore.getGlobalRestaurant
        const getRestaurantSearch = (restaurantId) => {
          return {
            fieldsAndFilters: [{ field: "restaurants__pk", filter: "in" }],
            searchValues: [[restaurantId]],
          };
        };
        const getIdentifierSearch = (valueToSearch) => {
          return {
              fieldsAndFilters: [ {field: "id", filter: "icontains"} ],
              searchValues: [ valueToSearch ]
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
        let { objects } = data.searchEmployees
        this.List.totalRows = data.searchEmployees.total
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