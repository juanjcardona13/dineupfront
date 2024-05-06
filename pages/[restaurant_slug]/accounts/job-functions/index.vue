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
  import ComponentFormCreateUpdateJobFunction from "~/components/dineUp/accounts/JobFunction/createUpdate.vue"
  import ComponentVerDetalleJobFunction from "@/components/dineUp/accounts/JobFunction/read.vue"
  import { useAppBusinessLogicStore } from "~/stores/app-business-logic";


  const FormCreateUpdateJobFunction = shallowRef(ComponentFormCreateUpdateJobFunction);
  const VerDetalleJobFunction = shallowRef(ComponentVerDetalleJobFunction);


  definePageMeta({
    middleware: "middleware-auth",
  })

  export default {
    data() {
      return {
        header: {
          title: "Funciones laborales",
        }, 
        Create: {
          modalTitle: "Crear nueva función laboral",
          objectData: {},
          component: FormCreateUpdateJobFunction,
          onConfirmCreate: this.createObject,
        },
        Read: {
          modalTitle: "Detalle del función laboral",
          objectData: {},
          component: VerDetalleJobFunction,
          onOpenRead: this.readObject
        },
        Update: {
          modalTitle: "Actualizar función laboral",
          objectData: {},
          component: FormCreateUpdateJobFunction,
          onOpenUpdate: this.openUpdateObject,
          onConfirmUpdate: this.updateObject,
        },
        Delete: {
          modalTitle: "Eliminar función laboral",
          objectData: {},
          onConfirmDelete: this.deleteObject,
        },
        Deactivate: {
          modalTitle: "Desactivar función laboral",
          objectData: {},
          onConfirmDeactivate: this.deactivateObject,
        },
        Activate: {
          modalTitle: "Activar función laboral",
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
          query: readJobFunction(`
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
        this.Update.objectData = JSON.parse(JSON.stringify(data.readJobFunction))
      },
      async createObject(objectData) {
        await this.$apollo.mutate({
          mutation: createJobFunctions(),
          variables: {
            input: [objectData]
          }
        })
        this.$apollo.queries.searchJobFunctions.refetch()
      },
      async readObject(propsRow) {
        const { data } = await this.$apollo.query({
          fetchPolicy: "no-cache",
          query: readJobFunction(`
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
        this.Read.objectData = data.readJobFunction
      },
      async updateObject(objectData) {
        await this.$apollo.mutate({
          mutation: updateJobFunctions(),
          variables: {
            input: [objectData]
          }
        })
        this.$apollo.queries.searchJobFunctions.refetch()
      },
      async deleteObject(objectData) {
        await this.$apollo.mutate({
          mutation: deleteJobFunctions(),
          variables: {
            where: {
            id: {
              exact: objectData.id
            }
          }
          }
        })
        this.$apollo.queries.searchJobFunctions.refetch()
      },
      async deactivateObject(objectData) {
        await this.$apollo.mutate({
          mutation: deactivateJobFunctions(),
          variables: {
            where: {
            id: {
              exact: objectData.id
            }
          }
          }
        })
        this.$apollo.queries.searchJobFunctions.refetch()
      },
      async activateObject(objectData) {
        await this.$apollo.mutate({
          mutation: activateJobFunctions(),
          variables: {
            where: {
            id: {
              exact: objectData.id
            }
          }
          }
        })
        this.$apollo.queries.searchJobFunctions.refetch()
      },
    },
    apollo: {
      searchJobFunctions: {
        query: searchJobFunctions(`
          id
          isActive
        `),
        variables() {
          const businessLogicStore = useAppBusinessLogicStore()
          const globalRestaurant = businessLogicStore.getGlobalRestaurant
          const getRestaurantSearch = (restaurantId) => {
            return {
              fieldsAndFilters: [{ field: "employee__restaurant__pk", filter: "in" }],
              searchValues: [[restaurantId]],
            };
          };
          // const getIdentifierSearch = (valueToSearch) => {
          //   return {
          //       fieldsAndFilters: [ {field: "name", filter: "icontains"} ],
          //       searchValues: [ valueToSearch ]
          //     };
          // };
          const advancedSearch = globalRestaurant?.id || this.Search.valueToSearch ? [] : undefined;
          if (globalRestaurant?.id) {
            advancedSearch.push(getRestaurantSearch(globalRestaurant.id));
          }
          // if (this.Search.valueToSearch) {
          //   advancedSearch.push(getIdentifierSearch(this.Search.valueToSearch));
          // }

          return {
            page: this.List.paginationOptions.setCurrentPage,
            pageSize: this.List.paginationOptions.perPage,
            advancedSearch
          }
        },
        result(response) {
          let { data } = response
          let { objects } = data.searchJobFunctions
          this.List.totalRows = data.searchJobFunctions.total
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