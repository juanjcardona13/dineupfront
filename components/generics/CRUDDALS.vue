<template>
  <div>
    <!--TITULO Y BOTON-->
    <div class="page-header">
      <slot name="header">
        <!--TITULO-->
        <div>
          <slot name="headerLeft">
            <slot name="headerTitle">
              <h2 class="main-content-title tx-24 mg-b-5">{{header.title}}</h2>
            </slot>
          </slot>
        </div>
        <!--BOTON-->
        <div class="d-flex">
          <slot name="headerRight">
            <div class="justify-content-center">
              <!--BOTONES-->
              <slot name="headerButtons">
                <button v-for="(headerButton, i) in header.buttons" :key="i" type="button" :class="headerButton.class" @click="headerButton.function($event, this)" >
                  <i :class="`${headerButton.icon} me-2`"></i> {{headerButton.label}}
                </button>
              </slot>
              <!--BOTON AÑADIR-->
              <button :class="Create.button.class" type="button" @click="Create.button.function($event, this)" >
                <i :class="`${Create.button.icon}`"></i> {{Create.button.label}}
              </button>
            </div>
          </slot>
        </div>
      </slot>
    </div>
    <!--TABLA-->
    <div>
      <slot name="table">
        <vue-good-table styleClass="vgt-table striped" v-bind="List" v-on="tableEvents" :search-options="Search">
          <template #table-row="props">
            <slot name="table-row" :props="props">
              <!--BOTON DE ACCIONES-->
              <div class="row" v-if="props.column.field == 'actions'">
                <div class="col-2">
                  <button :class="Read.button.class" type="button" @click="Read.button.function(props, $event, this)">
                    <i :class="`${Read.button.icon}`"></i> {{Read.button.label}}
                  </button>
                </div>
                <div class="col-2">
                  <button :class="Update.button.class" type="button" @click="Update.button.function(props, $event, this)">
                    <i :class="`${Update.button.icon}`"></i> {{Update.button.label}}
                  </button>
                </div>
                <div class="col-2">
                  <button :class="Delete.button.class" type="button" @click="Delete.button.function(props, $event, this)">
                    <i :class="`${Delete.button.icon}`"></i> {{Delete.button.label}}
                  </button>
                </div>
                <div class="col-2" v-if="props.row.isActive">
                  <button :class="Deactivate.button.class" type="button" @click="Deactivate.button.function(props, $event, this)">
                    <i :class="`${Deactivate.button.icon}`"></i> {{Deactivate.button.label}}
                  </button>
                </div>
                <div class="col-2" v-if="!props.row.isActive">
                  <button :class="Activate.button.class" type="button" @click="Activate.button.function(props, $event, this)">
                    <i :class="`${Activate.button.icon}`"></i> {{Activate.button.label}}
                  </button>
                </div>
              </div>
              <!--TEXTO-->
              <span v-else>
                {{props.formattedRow[props.column.field]}} <span v-if="!props.row.isActive" class="badge bg-pill bg-danger ms-2" style="position: relative; top: -2px">Inactivo</span>
              </span>
            </slot>
          </template>
        </vue-good-table>
      </slot>
      <Modal v-if="Create" 
            v-model="showModalCreate"
            :title="Create.modalTitle"
            @confirm="confirm('Create', $event)"
            @cancel="cancel('Create', $event)" 
            @closed="closed('Create', $event)">
        <component :is="Create.component" v-model="Create.objectData" :showFields="Create.showFields"></component>
      </Modal>
      <Modal v-if="Read" 
            v-model="showModalRead"
            :title="Read.modalTitle" :hiddenFooter="true" 
            @closed="closed('Read', $event)">
        <component :is="Read.component" :object="Read.objectData"></component>
      </Modal>
      <Modal v-if="Update" 
            v-model="showModalUpdate"
            :title="Update.modalTitle"
            @confirm="confirm('Update', $event)"
            @cancel="cancel('Update', $event)" 
            @closed="closed('Update', $event)">
        <component :is="Update.component" v-model="Update.objectData" :showFields="Update.showFields"></component>
      </Modal>
      <Modal v-if="Delete" 
            v-model="showModalDelete"
            :title="Delete.modalTitle"
            @confirm="confirm('Delete', $event)"
            @cancel="cancel('Delete', $event)" 
            @closed="closed('Delete', $event)">
        <component v-if="Delete.component" :is="Delete.component" v-model="Delete.objectData"></component>
        <div class="row" v-else>
          <div class="col-12">
            <span v-if="Delete.modalMessage">{{Delete.modalMessage}}</span>
            <span v-else> ¿ Esta seguro de eliminar este dato ?</span>
          </div>
        </div>
      </Modal>
      <Modal v-if="Deactivate" 
            v-model="showModalDeactivate"
            :title="Deactivate.modalTitle"
            @confirm="confirm('Deactivate', $event)"
            @cancel="cancel('Deactivate', $event)" 
            @closed="closed('Deactivate', $event)">
        <component v-if="Deactivate.component" :is="Deactivate.component" v-model="Deactivate.objectData"></component>
        <div class="row" v-else>
          <div class="col-12">
            <span v-if="Deactivate.modalMessage">{{Deactivate.modalMessage}}</span>
            <span v-else> ¿ Esta seguro de desactivar este dato ?</span>
          </div>
        </div>
      </Modal>
      <Modal v-if="Activate" 
            v-model="showModalActivate"
            :title="Activate.modalTitle"
            @confirm="confirm('Activate', $event)"
            @cancel="cancel('Activate', $event)" 
            @closed="closed('Activate', $event)">
        <component v-if="Activate.component" :is="Activate.component" v-model="Activate.objectData"></component>
        <div class="row" v-else>
          <div class="col-12">
            <span v-if="Activate.modalMessage">{{Activate.modalMessage}}</span>
            <span v-else> ¿ Esta seguro de desactivar este dato ?</span>
          </div>
        </div>
      </Modal>
    </div>
  </div>
</template>

<script>
import Modal from "@/components/generics/Modal.vue"

definePageMeta({
  middleware: "middleware-auth",
})

export default {
  name: "CRUDDALS",
  components: {
    Modal
  },
  props: {
    header: {
      type: Object,
      default: () => {
        return {
          title: "Title",
          buttons: [],
        }
      }
    },
    tableEvents: {
      type: Object,
      default: () => {
        return {}
      }, 
    },
    Create: {
      type: Object,
      default: () => {
        return {}
      },
      validator: (value) => {
        const defaultConfig = {
          modalTitle: "Crear",
          objectData: {},
          showFields: {},
          onOpenCread() {},
          onConfirmCreate() {},
          onCancelCreate() {},
          onCloseCreate() {},
          button: {
            icon: "fe fe-plus",
            label: "Añadir",
            class: "btn btn-primary my-2 btn-icon-text",
            function($event, context) {
                context.showModalCreate = true
                context.Create.onOpenCread($event, context)
            }
          }
        }
        for (const key in defaultConfig) {
          if (!value.hasOwnProperty(key)) {
            value[key] = defaultConfig[key];
          }
        }
        return true;
      }
    },
    Read: {
      type: Object,
      default: () => {
        return {}
      },
      validator: (value) => {
        const defaultConfig = {
          modalTitle: "Ver detalle",
          objectData: {},
          onOpenRead() {},
          onCloseRead() {},
          button: {
            icon: null,
            label: "Ver",
            class: "btn btn-info",
            function(props, $event, context) {
              context.showModalRead=true
              context.Read.onOpenRead(props, $event, context)
            }
          }
        }
        for (const key in defaultConfig) {
          if (!value.hasOwnProperty(key)) {
            value[key] = defaultConfig[key];
          }
        }
        return true;
      }
    },
    Update: {
      type: Object,
      default: () => {
        return {}
      },
      validator: (value) => {
        const defaultConfig = {
          modalTitle: "Actualizar",
          objectData: {},
          showFields: {},
          onOpenUpdate() {},
          onConfirmUpdate() {},
          onCancelUpdate() {},
          onCloseUpdate() {},
          button: {
            icon: null,
            label: "Actualizar",
            class: "btn btn-primary",
            function(props, $event, context) {
              context.showModalUpdate=true
              context.Update.onOpenUpdate(props, $event, context)
            }
          }
        }
        for (const key in defaultConfig) {
          if (!value.hasOwnProperty(key)) {
            value[key] = defaultConfig[key];
          }
        }
        return true;
      }
    },
    Delete: {
      type: Object,
      default: () => {
        return {}
      },
      validator: (value) => {
        const defaultConfig = {
          modalTitle: "Eliminar",
          modalMessage: "",
          component: null,
          objectData: {},
          onOpenDelete() {},
          onConfirmDelete() {},
          onCancelDelete() {},
          onCloseDelete() {},
          button: {
            icon: null,
            label: "Eliminar",
            class: "btn btn-danger",
            function(props, $event, context) {
              context.showModalDelete=true
              context.Delete.objectData = props.row
              context.Delete.onOpenDelete(props, $event, context)
            }
          }
        }
        for (const key in defaultConfig) {
          if (!value.hasOwnProperty(key)) {
            value[key] = defaultConfig[key];
          }
        }
        return true;
      }
    },
    Deactivate: {
      type: Object,
      default: () => {
        return {}
      },
      validator: (value) => {
        const defaultConfig = {
          modalTitle: "Desactivar",
          modalMessage: "",
          component: null,
          objectData: {},
          onOpenDeactivate() {},
          onConfirmDeactivate() {},
          onCancelDeactivate() {},
          onCloseDeactivate() {},
          button: {
            icon: null,
            label: "Desactivar",
            class: "btn btn-warning",
            function(props, $event, context) {
              context.showModalDeactivate=true
              context.Deactivate.objectData = props.row
              context.Deactivate.onOpenDeactivate(props, $event, context)
            }
          }
        }
        for (const key in defaultConfig) {
          if (!value.hasOwnProperty(key)) {
            value[key] = defaultConfig[key];
          }
        }
        return true;
      }
    },
    Activate: {
      type: Object,
      default: () => {
        return {}
      },
      validator: (value) => {
        const defaultConfig = {
          modalTitle: "Activar",
          modalMessage: "",
          component: null,
          objectData: {},
          onOpenActivate() {},
          onConfirmActivate() {},
          onCancelActivate() {},
          onCloseActivate() {},
          button: {
            icon: null,
            label: "Activar",
            class: "btn btn-success",
            function(props, $event, context) {
              context.showModalActivate=true
              context.Activate.objectData = props.row
              context.Activate.onOpenActivate(props, $event, context)
            }
          }
        }
        for (const key in defaultConfig) {
          if (!value.hasOwnProperty(key)) {
            value[key] = defaultConfig[key];
          }
        }
        return true;
      }
    },
    List: {
      type: Object,
      default: () => {
        return {}
      },
      validator: (value) => {
        const defaultConfig = {
          mode: "remote",
          columns: [],
          rows: [],
          rowStyleClass: "selectable-row",
          paginationOptions: { enabled: true },
        }
        const defaultConfigForPagination = { 
          enabled: true,
          perPageDropdownEnabled: true,
          perPageDropdown: [ 1, 5, 10, 20, 50],
          dropdownAllowAll: true,
          setCurrentPage: 1,
          perPage: 10,
          nextLabel: 'Siguiente',
          prevLabel: 'Anterior',
          rowsPerPageLabel: '',
          ofLabel: 'de',
          allLabel: 'Todos',
          // position: 'top',
          // mode: 'records',
          // infoFn: (params) => `my own page ${params.firstRecordOnPage}`,
        }
        for (const key in defaultConfig) {
          if (!value.hasOwnProperty(key)) {
            value[key] = defaultConfig[key];
          }
        }
        for (const key in defaultConfigForPagination) {
          if (!value.paginationOptions.hasOwnProperty(key)) {
            value.paginationOptions[key] = defaultConfigForPagination[key];
          }
        }
        return true;
      }
    },
    Search: {
      type: Object,
      default: () => {
        return {}
      },
      validator: (value) => {
        const defaultConfig = {
          onSearch() {}
        }
        for (const key in defaultConfig) {
          if (!value.hasOwnProperty(key)) {
            value[key] = defaultConfig[key];
          }
        }
        return true;
      }
    },
  },
  data() {
    return {
      showModalCreate: false,
      showModalRead: false,
      showModalUpdate: false,
      showModalDelete: false,
      showModalDeactivate: false,
      showModalActivate: false,
    }
  },
  created() {
    this.setDefaultTableEvents();
  },
  methods: {
    setDefaultTableEvents() {
      var context = this
      const defaultEvents = {
        'page-change': (params) => {
          context.List.paginationOptions.setCurrentPage = params.currentPage
        },
        'per-page-change': (params) => {
          context.List.paginationOptions.perPage = params.currentPerPage
        },
        'search': (params) => {
          context.Search.valueToSearch = params.searchTerm
        }
      }
      for (const key in defaultEvents) {
        if (!this.tableEvents.hasOwnProperty(key)) {
          this.tableEvents[key] = defaultEvents[key];
        }
      }
    },
    confirm(func, $event) {
      // this[`showModal${func}`] = false
      deleteKeys(this[`${func}`].objectData)
      this[`${func}`][`onConfirm${func}`](this[`${func}`].objectData, $event, this)
    },
    cancel(func, $event) {
      this[`showModal${func}`] = false
      this[`${func}`][`onCancel${func}`](this[`${func}`].objectData, $event, this)
      this[`${func}`].objectData = {}
    },
    closed(func, $event) {
      this[`showModal${func}`] = false
      this[`${func}`][`onClose${func}`](this[`${func}`].objectData, $event, this)
      this[`${func}`].objectData = {}
    }
  },
}
</script>

<style>
/* TODOS ESTOS ESTILOS SON PARA LA TABLA GENERAL CRUDDALS */
.selectable-row {
  cursor: pointer;
}
.selectable-row:hover {
  background-color: #eee;
}
.vgt-global-search {
  padding: 12px 10px;
  border: 1px solid #DCDFE6;
  border-radius: 6px;
  margin-bottom: 5px;
}
.vgt-global-search__input .input__icon .magnifying-glass:before {
  background: #6259ca;
}
.vgt-global-search__input .input__icon .magnifying-glass {
  border: 2px solid #6259ca;
}
.vgt-wrap__footer .footer__row-count__label {
  display: none
}
.vgt-wrap__footer .footer__row-count__select {
  padding: 4px 8px;
  border: 1px solid #6259ca;
  border-radius: 4px;
  font-weight: 400;
}
.vgt-wrap__footer .footer__row-count::after {
  content: "";
  display: block;
  position: absolute;
  height: 0px;
  width: 0px;
  right: 11px;
  top: 50%;
  margin-top: -3px; 
}
.vgt-wrap__footer {
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
}
.vgt-wrap__footer .footer__navigation > button:first-of-type {
  margin-right: 100px;
}
.vgt-wrap__footer .footer__navigation__page-info {
  position: relative;
  left: 202px;
}
.vgt-wrap__footer .footer__navigation__page-btn {
  font-weight: 400;
}
</style>