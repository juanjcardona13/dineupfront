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
import ComponentFormCreateUpdateSchedule from "~/components/dineUp/core/Schedule/createUpdate.vue"
import ComponentVerDetalleSchedule from "@/components/dineUp/core/Schedule/read.vue"
import { shallowRef } from 'vue';


const FormCreateUpdateSchedule = shallowRef(ComponentFormCreateUpdateSchedule);
const VerDetalleSchedule = shallowRef(ComponentVerDetalleSchedule);


definePageMeta({
  middleware: "middleware-auth",
})

export default {
  data() {
    return {
      header: {
        title: "Horarios",
      }, 
      Create: {
        modalTitle: "Crear nuevo horario",
        objectData: {},
        component: FormCreateUpdateSchedule,
        onConfirmCreate: this.createObject,
      },
      Read: {
        modalTitle: "Detalle del horario",
        objectData: {},
        component: VerDetalleSchedule,
        onOpenRead: this.readObject
      },
      Update: {
        modalTitle: "Actualizar horario",
        objectData: {},
        component: FormCreateUpdateSchedule,
        onOpenUpdate: this.openUpdateObject,
        onConfirmUpdate: this.updateObject,
      },
      Delete: {
        modalTitle: "Eliminar horario",
        objectData: {},
        onConfirmDelete: this.deleteObject,
      },
      Deactivate: {
        modalTitle: "Desactivar horario",
        objectData: {},
        onConfirmDeactivate: this.deactivateObject,
      },
      Activate: {
        modalTitle: "Activar horario",
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
        query: readSchedule(`
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
      this.Update.objectData = JSON.parse(JSON.stringify(data.readSchedule))
    },
    async createObject(objectData) {
      await this.$apollo.mutate({
        mutation: createSchedules(),
        variables: {
          input: [objectData]
        }
      })
      this.$apollo.queries.searchSchedules.refetch()
    },
    async readObject(propsRow) {
      const { data } = await this.$apollo.query({
        fetchPolicy: "no-cache",
        query: readSchedule(`
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
      this.Read.objectData = data.readSchedule
    },
    async updateObject(objectData) {
      await this.$apollo.mutate({
        mutation: updateSchedules(),
        variables: {
          input: [objectData]
        }
      })
      this.$apollo.queries.searchSchedules.refetch()
    },
    async deleteObject(objectData) {
      await this.$apollo.mutate({
        mutation: deleteSchedules(),
        variables: {
          where: {
            id: {
              exact: objectData.id
            }
          }
        }
      })
      this.$apollo.queries.searchSchedules.refetch()
    },
    async deactivateObject(objectData) {
      await this.$apollo.mutate({
        mutation: deactivateSchedules(),
        variables: {
          where: {
            id: {
              exact: objectData.id
            }
          }
        }
      })
      this.$apollo.queries.searchSchedules.refetch()
    },
    async activateObject(objectData) {
      await this.$apollo.mutate({
        mutation: activateSchedules(),
        variables: {
          where: {
            id: {
              exact: objectData.id
            }
          }
        }
      })
      this.$apollo.queries.searchSchedules.refetch()
    },
  },
  apollo: {
    searchSchedules: {
      query: searchSchedules(`
        id
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
        let { objects } = data.searchSchedules
        this.List.totalRows = data.searchSchedules.total
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