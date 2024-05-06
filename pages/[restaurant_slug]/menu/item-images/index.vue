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
import ComponentFormCreateUpdateItemImage from "~/components/dineUp/menu/ItemImage/createUpdate.vue"
import ComponentVerDetalleItemImage from "@/components/dineUp/menu/ItemImage/read.vue"
import { shallowRef } from 'vue';


const FormCreateUpdateItemImage = shallowRef(ComponentFormCreateUpdateItemImage);
const VerDetalleItemImage = shallowRef(ComponentVerDetalleItemImage);


definePageMeta({
  middleware: "middleware-auth",
})

export default {
  data() {
    return {
      header: {
        title: "Imágenes del ítem del menú",
      }, 
      Create: {
        modalTitle: "Crear nueva imagen al ítem del menú",
        objectData: {},
        component: FormCreateUpdateItemImage,
        onConfirmCreate: this.createObject,
      },
      Read: {
        modalTitle: "Detalle de la imagen al ítem del menú",
        objectData: {},
        component: VerDetalleItemImage,
        onOpenRead: this.readObject
      },
      Update: {
        modalTitle: "Actualizar imagen al ítem del menú",
        objectData: {},
        component: FormCreateUpdateItemImage,
        onOpenUpdate: this.openUpdateObject,
        onConfirmUpdate: this.updateObject,
      },
      Delete: {
        modalTitle: "Eliminar imagen al ítem del menú",
        objectData: {},
        onConfirmDelete: this.deleteObject,
      },
      Deactivate: {
        modalTitle: "Desactivar imagen al ítem del menú",
        objectData: {},
        onConfirmDeactivate: this.deactivateObject,
      },
      Activate: {
        modalTitle: "Activar imagen al ítem del menú",
        objectData: {},
        onConfirmActivate: this.activateObject,
      },
      List: {
        columns: [
          { label: 'Nombre', field: 'image'},
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
        query: readItemImage(`
          id
          image
        `),
        variables: {
          where: {
            id: {
              exact: propsRow.row.id
            }
          }
        }
      })
      this.Update.objectData = JSON.parse(JSON.stringify(data.readItemImage))
    },
    async createObject(objectData) {
      await this.$apollo.mutate({
        mutation: createItemImages(),
        variables: {
          input: [objectData]
        }
      })
      this.$apollo.queries.searchItemImages.refetch()
    },
    async readObject(propsRow) {
      const { data } = await this.$apollo.query({
        fetchPolicy: "no-cache",
        query: readItemImage(`
          id
          image
        `),
        variables: {
          where: {
            id: {
              exact: propsRow.row.id
            }
          }
        }
      })
      this.Read.objectData = data.readItemImage
    },
    async updateObject(objectData) {
      await this.$apollo.mutate({
        mutation: updateItemImages(),
        variables: {
          input: [objectData]
        }
      })
      this.$apollo.queries.searchItemImages.refetch()
    },
    async deleteObject(objectData) {
      await this.$apollo.mutate({
        mutation: deleteItemImages(),
        variables: {
          where: {
            id: {
              exact: objectData.id
            }
          }
        }
      })
      this.$apollo.queries.searchItemImages.refetch()
    },
    async deactivateObject(objectData) {
      await this.$apollo.mutate({
        mutation: deactivateItemImages(),
        variables: {
          where: {
            id: {
              exact: objectData.id
            }
          }
        }
      })
      this.$apollo.queries.searchItemImages.refetch()
    },
    async activateObject(objectData) {
      await this.$apollo.mutate({
        mutation: activateItemImages(),
        variables: {
          where: {
            id: {
              exact: objectData.id
            }
          }
        }
      })
      this.$apollo.queries.searchItemImages.refetch()
    },
  },
  apollo: {
    searchItemImages: {
      query: searchItemImages(`
        id
        image
        isActive
      `),
      variables() {
        let advancedSearch = this.Search.valueToSearch ? [
            {
              fieldsAndFilters: [
                {field: "image", filter: "icontains"}
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
        let { objects } = data.searchItemImages
        this.List.totalRows = data.searchItemImages.total
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