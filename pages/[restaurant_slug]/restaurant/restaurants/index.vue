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
import ComponentFormCreateUpdateRestaurant from "~/components/dineUp/restaurant/Restaurant/createUpdate.vue"
import ComponentVerDetalleRestaurant from "@/components/dineUp/restaurant/Restaurant/read.vue"
import { useAppBusinessLogicStore } from "~/stores/app-business-logic";


const FormCreateUpdateRestaurant = shallowRef(ComponentFormCreateUpdateRestaurant);
const VerDetalleRestaurant = shallowRef(ComponentVerDetalleRestaurant);


definePageMeta({
  middleware: "middleware-auth",
})

export default {
  data() {
    return {
      header: {
        title: "Restaurantes",
      }, 
      Create: {
        modalTitle: "Crear nuevo restaurante",
        objectData: {},
        component: FormCreateUpdateRestaurant,
        onConfirmCreate: this.createObject,
      },
      Read: {
        modalTitle: "Detalle del restaurante",
        objectData: {},
        component: VerDetalleRestaurant,
        onOpenRead: this.readObject
      },
      Update: {
        modalTitle: "Actualizar restaurante",
        objectData: {},
        component: FormCreateUpdateRestaurant,
        onOpenUpdate: this.openUpdateObject,
        onConfirmUpdate: this.updateObject,
      },
      Delete: {
        modalTitle: "Eliminar restaurante",
        objectData: {},
        onConfirmDelete: this.deleteObject,
      },
      Deactivate: {
        modalTitle: "Desactivar restaurante",
        objectData: {},
        onConfirmDeactivate: this.deactivateObject,
      },
      Activate: {
        modalTitle: "Activar restaurante",
        objectData: {},
        onConfirmActivate: this.activateObject,
      },
      List: {
        columns: [
          { label: 'Nombre', field: 'name'},
          { label: 'Sitio web', field: 'website'},
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
      let fieldsForQuery = `
        id
        name
        logo
        slogan
        phoneNumber
        website
        email
        paginatedBranches(where: $whereBranches) {
          objects {
            id
            address
            addressDetail
            postalCode
            isMain
          }
        }
      `
      const { data } = await this.$apollo.query({
        fetchPolicy: "no-cache",
        query: readRestaurant(fieldsForQuery, [{variableName: "whereBranches", variableType: "BranchFilterInput"}]),
        variables: {
          where: {
            id: {
              exact: propsRow.row.id
            }
          },
          whereBranches: {
            isMain: {
              exact: true
            }
          }
        }
      })
      let finalData = JSON.parse(JSON.stringify(data.readRestaurant))
      finalData["branches"] = finalData.paginatedBranches?.objects ?? [{isMain: true}]
      delete finalData["paginatedBranches"]
      this.Update.objectData = finalData
    },
    async createObject(objectData) {
      await this.$apollo.mutate({
        mutation: createRestaurants(),
        variables: {
          input: [{...objectData, owner: this.$userLoggedIn?.id}]
        }
      })
      this.$apollo.queries.searchRestaurants.refetch()
    },
    async readObject(propsRow) {
      const { data } = await this.$apollo.query({
        fetchPolicy: "no-cache",
        query: readRestaurant(`
          id
          name
          logo
          slogan
          phoneNumber
          website
          email
          paginatedBranches {
            objects {
              id
              address
              addressDetail
              postalCode
              isMain
            }
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
      this.Read.objectData = data.readRestaurant
    },
    async updateObject(objectData) {
      objectData["branches"] = {connect: objectData["branches"]}
      await this.$apollo.mutate({
        mutation: updateRestaurants(),
        variables: {
          input: [objectData]
        }
      })
      this.$apollo.queries.searchRestaurants.refetch()
    },
    async deleteObject(objectData) {
      await this.$apollo.mutate({
        mutation: deleteRestaurants(),
        variables: {
          where: {
            id: {
              exact: objectData.id
            }
          }
        }
      })
      this.$apollo.queries.searchRestaurants.refetch()
    },
    async deactivateObject(objectData) {
      await this.$apollo.mutate({
        mutation: deactivateRestaurants(),
        variables: {
          where: {
            id: {
              exact: objectData.id
            }
          }
        }
      })
      this.$apollo.queries.searchRestaurants.refetch()
    },
    async activateObject(objectData) {
      await this.$apollo.mutate({
        mutation: activateRestaurants(),
        variables: {
          where: {
            id: {
              exact: objectData.id
            }
          }
        }
      })
      this.$apollo.queries.searchRestaurants.refetch()
    },
  },
  apollo: {
    searchRestaurants: {
      query: searchRestaurants(`
        id
        name
        owner {
          id
        }
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
            id: globalRestaurant?.id
          },
          advancedSearch
        }
      },
      result(response) {
        let { data } = response
        let { objects } = data.searchRestaurants
        this.List.totalRows = data.searchRestaurants.total
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