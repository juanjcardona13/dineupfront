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
    :Search="Search">
  </CRUDDALS>
</template>

<script>
import ComponentFormCreateUpdateMenuItem from "~/components/dineUp/menu/MenuItem/createUpdate.vue"
import ComponentVerDetalleMenuItem from "@/components/dineUp/menu/MenuItem/read.vue"
import { shallowRef } from 'vue';
import { useAppBusinessLogicStore } from "~/stores/app-business-logic";


const FormCreateUpdateMenuItem = shallowRef(ComponentFormCreateUpdateMenuItem);
const VerDetalleMenuItem = shallowRef(ComponentVerDetalleMenuItem);


definePageMeta({
  middleware: "middleware-auth",
})

export default {
  data() {
    return {
      header: {
        title: "Items de los menús",
      },
      Create: {
        modalTitle: "Crear nuevo ítem del menú",
        objectData: {},
        component: FormCreateUpdateMenuItem,
        onConfirmCreate: this.createObject,
      },
      Read: {
        modalTitle: "Detalle del ítem del menú",
        objectData: {},
        component: VerDetalleMenuItem,
        onOpenRead: this.readObject
      },
      Update: {
        modalTitle: "Actualizar ítem del menú",
        objectData: {},
        component: FormCreateUpdateMenuItem,
        onOpenUpdate: this.openUpdateObject,
        onConfirmUpdate: this.updateObject,
      },
      Delete: {
        modalTitle: "Eliminar ítem del menú",
        objectData: {},
        onConfirmDelete: this.deleteObject,
      },
      Deactivate: {
        modalTitle: "Desactivar ítem del menú",
        objectData: {},
        onConfirmDeactivate: this.deactivateObject,
      },
      Activate: {
        modalTitle: "Activar ítem del menú",
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
        query: readMenuItem(`
          id
          name
          description
          price
          hasMultiplePrice
          category {
            id
          }
          paginatedTags {
            objects {
              id
            }
          }
          position
          paginatedImages {
            objects {
              id
              image
            }
          }
          variant {
            id
            name
            paginatedVariantOptions {
              objects {
                id
                name
                price
                description
                isDefault
                position
              }
            }
          }
          paginatedOptionGroups {
            objects {
              id
              name
              nameType
              isRequired
              isMultiple
              minimum
              maximum
              position
              paginatedItemOptions {
                objects {
                  id
                  name
                  description
                  price
                  isDefault
                  position
                }
              }
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
      let copyData = JSON.parse(JSON.stringify(data.readMenuItem))
      copyData = {
        ...copyData,
        category: copyData.category?.id,
        variant: {
          ...copyData.variant,
          variantOptions: copyData.variant?.paginatedVariantOptions?.objects
        },
        images: copyData.paginatedImages?.objects,
        optionGroups: copyData.paginatedOptionGroups?.objects?.map(optionGroup => {
          let itemOptions = optionGroup.paginatedItemOptions?.objects
          delete optionGroup.paginatedItemOptions
          return {
            ...optionGroup,
            itemOptions
          }
        })
      }
      delete copyData.paginatedTags
      delete copyData.paginatedImages
      delete copyData.paginatedOptionGroups
      delete copyData.variant.paginatedVariantOptions
      this.Update.objectData = copyData
    },
    async createObject(objectData) {
      if (!objectData.menu) {
        const businessLogicStore = useAppBusinessLogicStore()
        const globalRestaurant = businessLogicStore.getGlobalRestaurant
        if (globalRestaurant?.id) {
          objectData.menu = globalRestaurant.paginatedMenus.objects[0].id
        }
      }
      let objectDataCopy = deepCopy(objectData)
      objectDataCopy = removeEmptyNestedObjectsAndArrays(objectDataCopy)
      if (objectDataCopy.hasMultiplePrice) {
        objectDataCopy = {
          ...objectDataCopy,
          variant: {
            ...objectDataCopy.variant,
            variantOptions: { connect: objectDataCopy.variant?.variantOptions }
          },
        }
      }
      if (objectDataCopy.optionGroups) {
        objectDataCopy = {
          ...objectDataCopy,
          optionGroups: objectDataCopy.optionGroups.map(optionGroup => {
            return {
              ...optionGroup,
              itemOptions: { connect: optionGroup.itemOptions }
            }
          })
        }
      }
      await executeMutation(createMenuItems(), { input: [objectDataCopy] })
      this.$apollo.queries.searchMenuItems.refetch()
    },
    async readObject(propsRow) {
      const { data } = await this.$apollo.query({
        fetchPolicy: "no-cache",
        query: readMenuItem(`
          id
          name
          menu {
            id
            name
          }
          description
          price
          hasMultiplePrice
          category {
            id
            name
          }
          position
          variant {
            id
            name
            paginatedVariantOptions {
              objects {
                id
                name
                price
                description
                isDefault
                position
              }
            }
          }
          paginatedImages {
            objects {
              id
              image
            }
          }
          paginatedOptionGroups {
            objects {
              id
              name
              nameType
              isRequired
              isMultiple
              minimum
              maximum
              position
              paginatedItemOptions {
                objects {
                  id
                  name
                  description
                  price
                  isDefault
                  position
                }
              }
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
      this.Read.objectData = data.readMenuItem
    },
    async updateObject(objectData) {
      if (objectData.hasMultiplePrice) {
        objectData = {
          ...objectData,
          variant: {
            ...objectData.variant,
            variantOptions: { connect: objectData.variant?.variantOptions }
          },
        }
      }
      if (objectData.images) {
        objectData = {
          ...objectData,
          images: { connect: objectData.images }
        }
      }
      if (objectData.optionGroups) {
        objectData = {
          ...objectData,
          optionGroups: {
            connect: objectData.optionGroups.map(optionGroup => {
              return {
                ...optionGroup,
                itemOptions: { connect: optionGroup.itemOptions }
              }
            })
          }
        }
      }
      await this.$apollo.mutate({
        mutation: updateMenuItems(),
        variables: {
          input: [objectData]
        }
      })
      this.$apollo.queries.searchMenuItems.refetch()
    },
    async deleteObject(objectData) {
      await this.$apollo.mutate({
        mutation: deleteMenuItems(),
        variables: {
          where: {
            id: {
              exact: objectData.id
            }
          }
        }
      })
      this.$apollo.queries.searchMenuItems.refetch()
    },
    async deactivateObject(objectData) {
      await this.$apollo.mutate({
        mutation: deactivateMenuItems(),
        variables: {
          where: {
            id: {
              exact: objectData.id
            }
          }
        }
      })
      this.$apollo.queries.searchMenuItems.refetch()
    },
    async activateObject(objectData) {
      await this.$apollo.mutate({
        mutation: activateMenuItems(),
        variables: {
          where: {
            id: {
              exact: objectData.id
            }
          }
        }
      })
      this.$apollo.queries.searchMenuItems.refetch()
    },
  },
  apollo: {
    searchMenuItems: {
      query: searchMenuItems(`
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
          fieldsOfModel: {
            menu: globalRestaurant?.menu?.id
          },
          advancedSearch
        }
      },
      result(response) {
        let { data } = response
        let { objects } = data.searchMenuItems
        this.List.totalRows = data.searchMenuItems.total
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