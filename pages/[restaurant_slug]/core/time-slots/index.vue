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
import FormCreateUpdateTimeSlot from "~/components/dineUp/core/TimeSlot/createUpdate.vue"
import VerDetalleTimeSlot from "@/components/dineUp/core/TimeSlot/read.vue"

definePageMeta({
  middleware: "middleware-auth",
})

export default {
  data() {
    return {
      header: {
        title: "Franjas horarias",
      }, 
      Create: {
        modalTitle: "Crear nuevo franja de tiempo",
        objectData: {},
        component: FormCreateUpdateTimeSlot,
        onConfirmCreate: this.createObject,
      },
      Read: {
        modalTitle: "Detalle del franja de tiempo",
        objectData: {},
        component: VerDetalleTimeSlot,
        onOpenRead: this.readObject
      },
      Update: {
        modalTitle: "Actualizar franja de tiempo",
        objectData: {},
        component: FormCreateUpdateTimeSlot,
        onOpenUpdate: this.openUpdateObject,
        onConfirmUpdate: this.updateObject,
      },
      Delete: {
        modalTitle: "Eliminar franja de tiempo",
        objectData: {},
        onConfirmDelete: this.deleteObject,
      },
      Deactivate: {
        modalTitle: "Desactivar franja de tiempo",
        objectData: {},
        onConfirmDeactivate: this.deactivateObject,
      },
      Activate: {
        modalTitle: "Activar franja de tiempo",
        objectData: {},
        onConfirmActivate: this.activateObject,
      },
      List: {
        columns: [
          { label: 'Inicio', field: 'startTime'},
          { label: 'Fin', field: 'endTime'},
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
        query: readTimeSlot(`
          id
          startTime
          endTime
        `),
        variables: {
          where: {
            id: {
              exact: propsRow.row.id
            }
          }
        }
      })
      this.Update.objectData = JSON.parse(JSON.stringify(data.readTimeSlot))
    },
    async createObject(objectData) {
      await this.$apollo.mutate({
        mutation: createTimeSlots(),
        variables: {
          input: [objectData]
        }
      })
      this.$apollo.queries.searchTimeSlots.refetch()
    },
    async readObject(propsRow) {
      const { data } = await this.$apollo.query({
        fetchPolicy: "no-cache",
        query: readTimeSlot(`
          id
          startTime
          endTime
        `),
        variables: {
          where: {
            id: {
              exact: propsRow.row.id
            }
          }
        }
      })
      this.Read.objectData = data.readTimeSlot
    },
    async updateObject(objectData) {
      await this.$apollo.mutate({
        mutation: updateTimeSlots(),
        variables: {
          input: [objectData]
        }
      })
      this.$apollo.queries.searchTimeSlots.refetch()
    },
    async deleteObject(objectData) {
      await this.$apollo.mutate({
        mutation: deleteTimeSlots(),
        variables: {
          where: {
            id: {
              exact: objectData.id
            }
          }
        }
      })
      this.$apollo.queries.searchTimeSlots.refetch()
    },
    async deactivateObject(objectData) {
      await this.$apollo.mutate({
        mutation: deactivateTimeSlots(),
        variables: {
          where: {
            id: {
              exact: objectData.id
            }
          }
        }
      })
      this.$apollo.queries.searchTimeSlots.refetch()
    },
    async activateObject(objectData) {
      await this.$apollo.mutate({
        mutation: activateTimeSlots(),
        variables: {
          where: {
            id: {
              exact: objectData.id
            }
          }
        }
      })
      this.$apollo.queries.searchTimeSlots.refetch()
    },
  },
  apollo: {
    searchTimeSlots: {
      query: searchTimeSlots(`
        id
        startTime
        endTime
        isActive
      `),
      variables() {
        let advancedSearch = this.Search.valueToSearch ? [
            {
              fieldsAndFilters: [
                {field: "start_time", filter: "icontains"},
                {field: "end_time", filter: "icontains"}
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
        let { objects } = data.searchTimeSlots
        this.List.totalRows = data.searchTimeSlots.total
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