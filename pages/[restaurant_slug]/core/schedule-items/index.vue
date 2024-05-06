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
import ComponentFormCreateUpdateScheduleItem from "~/components/dineUp/core/ScheduleItem/createUpdate.vue"
import ComponentVerDetalleScheduleItem from "@/components/dineUp/core/ScheduleItem/read.vue"
import { shallowRef } from 'vue';


const FormCreateUpdateScheduleItem = shallowRef(ComponentFormCreateUpdateScheduleItem);
const VerDetalleScheduleItem = shallowRef(ComponentVerDetalleScheduleItem);


definePageMeta({
  middleware: "middleware-auth",
})

export default {
  data() {
    return {
      header: {
        title: "Items de horario",
      }, 
      Create: {
        modalTitle: "Crear nuevo ítem de horario",
        objectData: {},
        component: FormCreateUpdateScheduleItem,
        onConfirmCreate: this.createObject,
      },
      Read: {
        modalTitle: "Detalle del ítem de horario",
        objectData: {},
        component: VerDetalleScheduleItem,
        onOpenRead: this.readObject
      },
      Update: {
        modalTitle: "Actualizar ítem de horario",
        objectData: {},
        component: FormCreateUpdateScheduleItem,
        onOpenUpdate: this.openUpdateObject,
        onConfirmUpdate: this.updateObject,
      },
      Delete: {
        modalTitle: "Eliminar ítem de horario",
        objectData: {},
        onConfirmDelete: this.deleteObject,
      },
      Deactivate: {
        modalTitle: "Desactivar ítem de horario",
        objectData: {},
        onConfirmDeactivate: this.deactivateObject,
      },
      Activate: {
        modalTitle: "Activar ítem de horario",
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
        query: readScheduleItem(`
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
      this.Update.objectData = JSON.parse(JSON.stringify(data.readScheduleItem))
    },
    async createObject(objectData) {
      await this.$apollo.mutate({
        mutation: createSchedulesItem(),
        variables: {
          input: [objectData]
        }
      })
      this.$apollo.queries.searchSchedulesItem.refetch()
    },
    async readObject(propsRow) {
      const { data } = await this.$apollo.query({
        fetchPolicy: "no-cache",
        query: readScheduleItem(`
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
      this.Read.objectData = data.readScheduleItem
    },
    async updateObject(objectData) {
      await this.$apollo.mutate({
        mutation: updateSchedulesItem(),
        variables: {
          input: [objectData]
        }
      })
      this.$apollo.queries.searchSchedulesItem.refetch()
    },
    async deleteObject(objectData) {
      await this.$apollo.mutate({
        mutation: deleteSchedulesItem(),
        variables: {
          where: {
            id: {
              exact: objectData.id
            }
          }
        }
      })
      this.$apollo.queries.searchSchedulesItem.refetch()
    },
    async deactivateObject(objectData) {
      await this.$apollo.mutate({
        mutation: deactivateSchedulesItem(),
        variables: {
          where: {
            id: {
              exact: objectData.id
            }
          }
        }
      })
      this.$apollo.queries.searchSchedulesItem.refetch()
    },
    async activateObject(objectData) {
      await this.$apollo.mutate({
        mutation: activateSchedulesItem(),
        variables: {
          where: {
            id: {
              exact: objectData.id
            }
          }
        }
      })
      this.$apollo.queries.searchSchedulesItem.refetch()
    },
  },
  apollo: {
    searchSchedulesItem: {
      query: searchSchedulesItem(`
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
        let { objects } = data.searchSchedulesItem
        this.List.totalRows = data.searchSchedulesItem.total
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