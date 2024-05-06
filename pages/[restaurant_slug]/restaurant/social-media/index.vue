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
import ComponentFormCreateUpdateSocialMedia from "~/components/dineUp/restaurant/SocialMedia/createUpdate.vue"
import ComponentVerDetalleSocialMedia from "@/components/dineUp/restaurant/SocialMedia/read.vue"
import { shallowRef } from 'vue';


const FormCreateUpdateSocialMedia = shallowRef(ComponentFormCreateUpdateSocialMedia);
const VerDetalleSocialMedia = shallowRef(ComponentVerDetalleSocialMedia);


definePageMeta({
  middleware: "middleware-auth",
})

export default {
  data() {
    return {
      header: {
        title: "Redes sociales",
      }, 
      Create: {
        modalTitle: "Crear nueva red social",
        objectData: {},
        component: FormCreateUpdateSocialMedia,
        onConfirmCreate: this.createObject,
      },
      Read: {
        modalTitle: "Detalle de la red social",
        objectData: {},
        component: VerDetalleSocialMedia,
        onOpenRead: this.readObject
      },
      Update: {
        modalTitle: "Actualizar red social",
        objectData: {},
        component: FormCreateUpdateSocialMedia,
        onOpenUpdate: this.openUpdateObject,
        onConfirmUpdate: this.updateObject,
      },
      Delete: {
        modalTitle: "Eliminar red social",
        objectData: {},
        onConfirmDelete: this.deleteObject,
      },
      Deactivate: {
        modalTitle: "Desactivar red social",
        objectData: {},
        onConfirmDeactivate: this.deactivateObject,
      },
      Activate: {
        modalTitle: "Activar red social",
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
        query: readSocialMedia(`
          id
          name
          url
        `),
        variables: {
          where: {
            id: {
              exact: propsRow.row.id
            }
          }
        }
      })
      this.Update.objectData = JSON.parse(JSON.stringify(data.readSocialMedia))
    },
    async createObject(objectData) {
      await this.$apollo.mutate({
        mutation: createSocialMedia(),
        variables: {
          input: [objectData]
        }
      })
      this.$apollo.queries.searchSocialMedia.refetch()
    },
    async readObject(propsRow) {
      const { data } = await this.$apollo.query({
        fetchPolicy: "no-cache",
        query: readSocialMedia(`
          id
          name
          url
        `),
        variables: {
          where: {
            id: {
              exact: propsRow.row.id
            }
          }
        }
      })
      this.Read.objectData = data.readSocialMedia
    },
    async updateObject(objectData) {
      await this.$apollo.mutate({
        mutation: updateSocialMedia(),
        variables: {
          input: [objectData]
        }
      })
      this.$apollo.queries.searchSocialMedia.refetch()
    },
    async deleteObject(objectData) {
      await this.$apollo.mutate({
        mutation: deleteSocialMedia(),
        variables: {
          where: {
            id: {
              exact: objectData.id
            }
          }
        }
      })
      this.$apollo.queries.searchSocialMedia.refetch()
    },
    async deactivateObject(objectData) {
      await this.$apollo.mutate({
        mutation: deactivateSocialMedia(),
        variables: {
          where: {
            id: {
              exact: objectData.id
            }
          }
        }
      })
      this.$apollo.queries.searchSocialMedia.refetch()
    },
    async activateObject(objectData) {
      await this.$apollo.mutate({
        mutation: activateSocialMedia(),
        variables: {
          where: {
            id: {
              exact: objectData.id
            }
          }
        }
      })
      this.$apollo.queries.searchSocialMedia.refetch()
    },
  },
  apollo: {
    searchSocialMedia: {
      query: searchSocialMedia(`
        id
        name
        url
        isActive
      `),
      variables() {
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
          advancedSearch
        }
      },
      result(response) {
        let { data } = response
        let { objects } = data.searchSocialMedia
        this.List.totalRows = data.searchSocialMedia.total
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