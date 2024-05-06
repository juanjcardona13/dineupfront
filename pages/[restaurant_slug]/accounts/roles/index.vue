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
import ComponentFormCreateUpdateRole from "~/components/dineUp/accounts/Role/createUpdate.vue"
import ComponentVerDetalleRole from "@/components/dineUp/accounts/Role/read.vue"
import { useAppBusinessLogicStore } from "~/stores/app-business-logic";


const FormCreateUpdateRole = shallowRef(ComponentFormCreateUpdateRole);
const VerDetalleRole = shallowRef(ComponentVerDetalleRole);


definePageMeta({
  middleware: "middleware-auth",
})

export default {
  data() {
    return {
      header: {
        title: "Roles",
      }, 
      Create: {
        modalTitle: "Crear nuevo rol",
        objectData: {},
        showFields: {
          restaurants: false,
        },
        component: FormCreateUpdateRole,
        onConfirmCreate: this.createObject,
      },
      Read: {
        modalTitle: "Detalle del rol",
        objectData: {},
        component: VerDetalleRole,
        onOpenRead: this.readObject
      },
      Update: {
        modalTitle: "Actualizar rol",
        objectData: {},
        showFields: {
          restaurants: false,
        },
        component: FormCreateUpdateRole,
        onOpenUpdate: this.openUpdateObject,
        onConfirmUpdate: this.updateObject,
      },
      Delete: {
        modalTitle: "Eliminar rol",
        objectData: {},
        onConfirmDelete: this.deleteObject,
      },
      Deactivate: {
        modalTitle: "Desactivar rol",
        objectData: {},
        onConfirmDeactivate: this.deactivateObject,
      },
      Activate: {
        modalTitle: "Activar rol",
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
        query: readRole(`
          id
          name
          restaurants
        `),
        variables: {
          where: {
            id: {
              exact: propsRow.row.id
            }
          }
        }
      })
      this.Update.objectData = JSON.parse(JSON.stringify(data.readRole))
    },
    async createObject(objectData) {
      if (!objectData.restaurants) {
        const businessLogicStore = useAppBusinessLogicStore()
        const globalRestaurant = businessLogicStore.getGlobalRestaurant
        if (globalRestaurant?.id) {
          objectData.restaurants = [globalRestaurant.id]
        }
      }
      await executeMutation(createRoles(), { input: [objectData] })
      this.$apollo.queries.searchRoles.refetch()
    },
    async readObject(propsRow) {
      const { data } = await this.$apollo.query({
        fetchPolicy: "no-cache",
        query: readRole(`
          id
          name
          restaurants
        `),
        variables: {
          where: {
            id: {
              exact: propsRow.row.id
            }
          }
        }
      })
      this.Read.objectData = data.readRole
    },
    async updateObject(objectData) {
      await this.$apollo.mutate({
        mutation: updateRoles(),
        variables: {
          input: [objectData]
        }
      })
      this.$apollo.queries.searchRoles.refetch()
    },
    async deleteObject(objectData) {
      await this.$apollo.mutate({
        mutation: deleteRoles(),
        variables: {
          where: {
            id: {
              exact: objectData.id
            }
          }
        }
      })
      this.$apollo.queries.searchRoles.refetch()
    },
    async deactivateObject(objectData) {
      await this.$apollo.mutate({
        mutation: deactivateRoles(),
        variables: {
          where: {
            id: {
              exact: objectData.id
            }
          }
        }
      })
      this.$apollo.queries.searchRoles.refetch()
    },
    async activateObject(objectData) {
      await this.$apollo.mutate({
        mutation: activateRoles(),
        variables: {
          where: {
            id: {
              exact: objectData.id
            }
          }
        }
      })
      this.$apollo.queries.searchRoles.refetch()
    },
  },
  apollo: {
    searchRoles: {
      query: searchRoles(`
        id
        name
        isActive
      `),
      variables() {
        const businessLogicStore = useAppBusinessLogicStore();
        const globalRestaurant = businessLogicStore.getGlobalRestaurant;
        const getRestaurantSearch = (restaurantId) => {
          return {
            fieldsAndFilters: [{ field: "restaurants__pk", filter: "in" }],
            searchValues: [[restaurantId]],
          };
        };
        const getIdentifierSearch = (valueToSearch) => {
          return {
              fieldsAndFilters: [ {field: "name", filter: "icontains"} ],
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
          // fieldsOfModel,
          advancedSearch
        }
      },
      result(response) {
        let { data } = response
        let { objects } = data.searchRoles
        this.List.totalRows = data.searchRoles.total
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