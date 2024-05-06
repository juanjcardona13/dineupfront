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
import ComponentFormCreateUpdateCategory from "~/components/dineUp/menu/Category/createUpdate.vue"
import ComponentVerDetalleCategory from "@/components/dineUp/menu/Category/read.vue"
import { useAppBusinessLogicStore } from "~/stores/app-business-logic";


const FormCreateUpdateCategory = shallowRef(ComponentFormCreateUpdateCategory);
const VerDetalleCategory = shallowRef(ComponentVerDetalleCategory);


definePageMeta({
  middleware: "middleware-auth",
})

export default {
  data() {
    return {
      header: {
        title: "Categorías",
      }, 
      Create: {
        modalTitle: "Crear nueva categoría",
        objectData: {},
        showFields: {
          restaurant: false,
          menus: false
        },
        component: FormCreateUpdateCategory,
        onConfirmCreate: this.createObject,
      },
      Read: {
        modalTitle: "Detalle del categoría",
        objectData: {},
        component: VerDetalleCategory,
        onOpenRead: this.readObject
      },
      Update: {
        modalTitle: "Actualizar categoría",
        objectData: {},
        showFields: {
          restaurant: false,
          menus: false
        },
        component: FormCreateUpdateCategory,
        onOpenUpdate: this.openUpdateObject,
        onConfirmUpdate: this.updateObject,
      },
      Delete: {
        modalTitle: "Eliminar categoría",
        objectData: {},
        onConfirmDelete: this.deleteObject,
      },
      Deactivate: {
        modalTitle: "Desactivar categoría",
        objectData: {},
        onConfirmDeactivate: this.deactivateObject,
      },
      Activate: {
        modalTitle: "Activar categoría",
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
        query: readCategory(`
          id
          name
          icon
          description
        `),
        variables: {
          where: {
            id: {
              exact: propsRow.row.id
            }
          }
        }
      })
      this.Update.objectData = JSON.parse(JSON.stringify(data.readCategory))
    },
    async createObject(objectData) {
      const businessLogicStore = useAppBusinessLogicStore()
      const globalRestaurant = businessLogicStore.getGlobalRestaurant
      if (globalRestaurant?.id) {
        if (!objectData.restaurant) {
          objectData.restaurant = globalRestaurant.id
        }
        if (objectData.menus) {
          if (Array.isArray(objectData.menus)) {
              objectData.menus.push(globalRestaurant.paginatedMenus.objects[0].id)
          } else {
            objectData.menus = [globalRestaurant.paginatedMenus.objects[0].id]   
          }
        } else {
          objectData.menus = [globalRestaurant.paginatedMenus.objects[0].id] 
        }
      }
      await executeMutation(createCategories(), { input: [objectData] })
      this.$apollo.queries.searchCategories.refetch()
    },
    async readObject(propsRow) {
      const { data } = await this.$apollo.query({
        fetchPolicy: "no-cache",
        query: readCategory(`
          id
          name
          icon
          description
        `),
        variables: {
          where: {
            id: {
              exact: propsRow.row.id
            }
          }
        }
      })
      this.Read.objectData = data.readCategory
    },
    async updateObject(objectData) {
      await this.$apollo.mutate({
        mutation: updateCategories(),
        variables: {
          input: [objectData]
        }
      })
      this.$apollo.queries.searchCategories.refetch()
    },
    async deleteObject(objectData) {
      await this.$apollo.mutate({
        mutation: deleteCategories(),
        variables: {
          where: {
            id: {
              exact: objectData.id
            }
          }
        }
      })
      this.$apollo.queries.searchCategories.refetch()
    },
    async deactivateObject(objectData) {
      await this.$apollo.mutate({
        mutation: deactivateCategories(),
        variables: {
          where: {
            id: {
              exact: objectData.id
            }
          }
        }
      })
      this.$apollo.queries.searchCategories.refetch()
    },
    async activateObject(objectData) {
      await this.$apollo.mutate({
        mutation: activateCategories(),
        variables: {
          where: {
            id: {
              exact: objectData.id
            }
          }
        }
      })
      this.$apollo.queries.searchCategories.refetch()
    },
  },
  apollo: {
    searchCategories: {
      query: searchCategories(`
        id
        name
        description
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
        let { objects } = data.searchCategories
        this.List.totalRows = data.searchCategories.total
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