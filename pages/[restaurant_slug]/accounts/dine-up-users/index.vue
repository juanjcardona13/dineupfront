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
import ComponentFormCreateUpdateDineUpUser from "~/components/dineUp/accounts/DineUpUser/createUpdate.vue"
import ComponentVerDetalleDineUpUser from "@/components/dineUp/accounts/DineUpUser/read.vue"
import { shallowRef } from 'vue';


const FormCreateUpdateDineUpUser = shallowRef(ComponentFormCreateUpdateDineUpUser);
const VerDetalleDineUpUser = shallowRef(ComponentVerDetalleDineUpUser);


definePageMeta({
  middleware: "middleware-auth",
})

export default {
  data() {
    return {
      header: {
        title: "Usuarios",
      },
      Create: {
        modalTitle: "Crear nuevo usuario",
        objectData: {},
        component: FormCreateUpdateDineUpUser,
        onConfirmCreate: this.createObject,
      },
      Read: {
        modalTitle: "Detalle del usuario",
        objectData: {},
        component: VerDetalleDineUpUser,
        onOpenRead: this.readObject
      },
      Update: {
        modalTitle: "Actualizar usuario",
        objectData: {},
        component: FormCreateUpdateDineUpUser,
        onOpenUpdate: this.openUpdateObject,
        onConfirmUpdate: this.updateObject,
      },
      Delete: {
        modalTitle: "Eliminar usuario",
        objectData: {},
        onConfirmDelete: this.deleteObject,
      },
      Deactivate: {
        modalTitle: "Desactivar usuario",
        objectData: {},
        onConfirmDeactivate: this.deactivateObject,
      },
      Activate: {
        modalTitle: "Activar usuario",
        objectData: {},
        onConfirmActivate: this.activateObject,
      },
      List: {
        columns: [
          { label: 'Nombre', field: 'user.username' },
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
        query: readDineUpUser(`
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
      this.Update.objectData = JSON.parse(JSON.stringify(data.readDineUpUser))
    },
    async createObject(objectData) {
      
      // await this.$apollo.mutate({
      //   mutation: createDineUpUsers(),
      //   variables: {
      //     input: [objectData]
      //   }
      // })
      // this.$apollo.queries.searchDineUpUsers.refetch()
    },
    async readObject(propsRow) {
      const { data } = await this.$apollo.query({
        fetchPolicy: "no-cache",
        query: readDineUpUser(`
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
      this.Read.objectData = data.readDineUpUser
    },
    async updateObject(objectData) {
      await this.$apollo.mutate({
        mutation: updateDineUpUsers(),
        variables: {
          input: [objectData]
        }
      })
      this.$apollo.queries.searchDineUpUsers.refetch()
    },
    async deleteObject(objectData) {
      await this.$apollo.mutate({
        mutation: deleteDineUpUsers(),
        variables: {
          where: {
            id: {
              exact: objectData.id
            }
          }
        }
      })
      this.$apollo.queries.searchDineUpUsers.refetch()
    },
    async deactivateObject(objectData) {
      await this.$apollo.mutate({
        mutation: deactivateDineUpUsers(),
        variables: {
          where: {
            id: {
              exact: objectData.id
            }
          }
        }
      })
      this.$apollo.queries.searchDineUpUsers.refetch()
    },
    async activateObject(objectData) {
      await this.$apollo.mutate({
        mutation: activateDineUpUsers(),
        variables: {
          where: {
            id: {
              exact: objectData.id
            }
          }
        }
      })
      this.$apollo.queries.searchDineUpUsers.refetch()
    },
  },
  apollo: {
    searchDineUpUsers: {
      query: searchDineUpUsers(`
        id
        user {
          username
          email
        }
        phoneNumber
        isActive
      `),
      variables() {
        let advancedSearch = this.Search.valueToSearch ? [
          {
            fieldsAndFilters: [
              { field: "user__username", filter: "icontains" }
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
        let { objects } = data.searchDineUpUsers
        this.List.totalRows = data.searchDineUpUsers.total
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