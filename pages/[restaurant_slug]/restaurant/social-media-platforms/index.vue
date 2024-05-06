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
import ComponentFormCreateUpdateSocialMediaPlatform from "~/components/dineUp/restaurant/SocialMediaPlatform/createUpdate.vue"
import ComponentVerDetalleSocialMediaPlatform from "@/components/dineUp/restaurant/SocialMediaPlatform/read.vue"
import { shallowRef } from 'vue';


const FormCreateUpdateSocialMediaPlatform = shallowRef(ComponentFormCreateUpdateSocialMediaPlatform);
const VerDetalleSocialMediaPlatform = shallowRef(ComponentVerDetalleSocialMediaPlatform);


definePageMeta({
  middleware: "middleware-auth",
})

export default {
  data() {
    return {
      header: {
        title: "Plataformas de redes sociales",
      }, 
      Create: {
        modalTitle: "Crear nueva plataforma red social",
        objectData: {},
        component: FormCreateUpdateSocialMediaPlatform,
        onConfirmCreate: this.createObject,
      },
      Read: {
        modalTitle: "Detalle de la plataforma red social",
        objectData: {},
        component: VerDetalleSocialMediaPlatform,
        onOpenRead: this.readObject
      },
      Update: {
        modalTitle: "Actualizar plataforma red social",
        objectData: {},
        component: FormCreateUpdateSocialMediaPlatform,
        onOpenUpdate: this.openUpdateObject,
        onConfirmUpdate: this.updateObject,
      },
      Delete: {
        modalTitle: "Eliminar plataforma red social",
        objectData: {},
        onConfirmDelete: this.deleteObject,
      },
      Deactivate: {
        modalTitle: "Desactivar plataforma red social",
        objectData: {},
        onConfirmDeactivate: this.deactivateObject,
      },
      Activate: {
        modalTitle: "Activar plataforma red social",
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
        query: readSocialMediaPlatform(`
          id
          name
          logo
        `),
        variables: {
          where: {
            id: {
              exact: propsRow.row.id
            }
          }
        }
      })
      this.Update.objectData = JSON.parse(JSON.stringify(data.readSocialMediaPlatform))
    },
    async createObject(objectData) {
      await this.$apollo.mutate({
        mutation: createSocialMediaPlatforms(),
        variables: {
          input: [objectData]
        }
      })
      this.$apollo.queries.searchSocialMediaPlatforms.refetch()
    },
    async readObject(propsRow) {
      const { data } = await this.$apollo.query({
        fetchPolicy: "no-cache",
        query: readSocialMediaPlatform(`
          id
          name
          logo
        `),
        variables: {
          where: {
            id: {
              exact: propsRow.row.id
            }
          }
        }
      })
      this.Read.objectData = data.readSocialMediaPlatform
    },
    async updateObject(objectData) {
      await this.$apollo.mutate({
        mutation: updateSocialMediaPlatforms(),
        variables: {
          input: [objectData]
        }
      })
      this.$apollo.queries.searchSocialMediaPlatforms.refetch()
    },
    async deleteObject(objectData) {
      await this.$apollo.mutate({
        mutation: deleteSocialMediaPlatforms(),
        variables: {
          where: {
            id: {
              exact: objectData.id
            }
          }
        }
      })
      this.$apollo.queries.searchSocialMediaPlatforms.refetch()
    },
    async deactivateObject(objectData) {
      await this.$apollo.mutate({
        mutation: deactivateSocialMediaPlatforms(),
        variables: {
          where: {
            id: {
              exact: objectData.id
            }
          }
        }
      })
      this.$apollo.queries.searchSocialMediaPlatforms.refetch()
    },
    async activateObject(objectData) {
      await this.$apollo.mutate({
        mutation: activateSocialMediaPlatforms(),
        variables: {
          where: {
            id: {
              exact: objectData.id
            }
          }
        }
      })
      this.$apollo.queries.searchSocialMediaPlatforms.refetch()
    },
  },
  apollo: {
    searchSocialMediaPlatforms: {
      query: searchSocialMediaPlatforms(`
        id
        name
        logo
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
        let { objects } = data.searchSocialMediaPlatforms
        this.List.totalRows = data.searchSocialMediaPlatforms.total
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