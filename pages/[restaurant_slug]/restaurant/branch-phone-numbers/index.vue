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
import ComponentFormCreateUpdateBranchPhoneNumber from "~/components/dineUp/restaurant/BranchPhoneNumber/createUpdate.vue"
import ComponentVerDetalleBranchPhoneNumber from "@/components/dineUp/restaurant/BranchPhoneNumber/read.vue"
import { shallowRef } from 'vue';


const FormCreateUpdateBranchPhoneNumber = shallowRef(ComponentFormCreateUpdateBranchPhoneNumber);
const VerDetalleBranchPhoneNumber = shallowRef(ComponentVerDetalleBranchPhoneNumber);


definePageMeta({
  middleware: "middleware-auth",
})

export default {
  data() {
    return {
      header: {
        title: "Números telefónicos",
      }, 
      Create: {
        modalTitle: "Crear nuevo número telefónico",
        objectData: {},
        component: FormCreateUpdateBranchPhoneNumber,
        onConfirmCreate: this.createObject,
      },
      Read: {
        modalTitle: "Detalle del número telefónico",
        objectData: {},
        component: VerDetalleBranchPhoneNumber,
        onOpenRead: this.readObject
      },
      Update: {
        modalTitle: "Actualizar número telefónico",
        objectData: {},
        component: FormCreateUpdateBranchPhoneNumber,
        onOpenUpdate: this.openUpdateObject,
        onConfirmUpdate: this.updateObject,
      },
      Delete: {
        modalTitle: "Eliminar número telefónico",
        objectData: {},
        onConfirmDelete: this.deleteObject,
      },
      Deactivate: {
        modalTitle: "Desactivar número telefónico",
        objectData: {},
        onConfirmDeactivate: this.deactivateObject,
      },
      Activate: {
        modalTitle: "Activar número telefónico",
        objectData: {},
        onConfirmActivate: this.activateObject,
      },
      List: {
        columns: [
          { label: 'Numero telefónico', field: 'phoneNumber'},
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
        query: readBranchPhoneNumber(`
          id
          phoneNumber
        `),
        variables: {
          where: {
            id: {
              exact: propsRow.row.id
            }
          }
        }
      })
      this.Update.objectData = JSON.parse(JSON.stringify(data.readBranchPhoneNumber))
    },
    async createObject(objectData) {
      await this.$apollo.mutate({
        mutation: createBranchPhoneNumbers(),
        variables: {
          input: [objectData]
        }
      })
      this.$apollo.queries.searchBranchPhoneNumbers.refetch()
    },
    async readObject(propsRow) {
      const { data } = await this.$apollo.query({
        fetchPolicy: "no-cache",
        query: readBranchPhoneNumber(`
          id
          phoneNumber
        `),
        variables: {
          where: {
            id: {
              exact: propsRow.row.id
            }
          }
        }
      })
      this.Read.objectData = data.readBranchPhoneNumber
    },
    async updateObject(objectData) {
      await this.$apollo.mutate({
        mutation: updateBranchPhoneNumbers(),
        variables: {
          input: [objectData]
        }
      })
      this.$apollo.queries.searchBranchPhoneNumbers.refetch()
    },
    async deleteObject(objectData) {
      await this.$apollo.mutate({
        mutation: deleteBranchPhoneNumbers(),
        variables: {
          where: {
            id: {
              exact: objectData.id
            }
          }
        }
      })
      this.$apollo.queries.searchBranchPhoneNumbers.refetch()
    },
    async deactivateObject(objectData) {
      await this.$apollo.mutate({
        mutation: deactivateBranchPhoneNumbers(),
        variables: {
          where: {
            id: {
              exact: objectData.id
            }
          }
        }
      })
      this.$apollo.queries.searchBranchPhoneNumbers.refetch()
    },
    async activateObject(objectData) {
      await this.$apollo.mutate({
        mutation: activateBranchPhoneNumbers(),
        variables: {
          where: {
            id: {
              exact: objectData.id
            }
          }
        }
      })
      this.$apollo.queries.searchBranchPhoneNumbers.refetch()
    },
  },
  apollo: {
    searchBranchPhoneNumbers: {
      query: searchBranchPhoneNumbers(`
        id
        phoneNumber
        isActive
      `),
      variables() {
        let advancedSearch = this.Search.valueToSearch ? [
            {
              fieldsAndFilters: [
                {field: "phone_number", filter: "icontains"}
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
        let { objects } = data.searchBranchPhoneNumbers
        this.List.totalRows = data.searchBranchPhoneNumbers.total
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