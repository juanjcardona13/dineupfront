<template>
  <div class="row">
    <div class="col-12">
      <!-- Sucursal -->
      <div class="form-group" v-if="showFields.branch">
        <v-select :options="branches" label="name" :reduce="branch => branch.id" v-model="object.branch"
          placeholder="Sucursal"></v-select>
      </div>
      <div class="form-group">
        <input class="form-control" placeholder="Identificador" v-model="object.identifier" />
      </div>
      <div class="form-group">
        <input class="form-control" placeholder="Descripción de la ubicación" v-model="object.locationDescription" />
      </div>
      <div class="form-group" v-if="showFields.capacity">
        <input class="form-control" placeholder="Capacidad" v-model="object.capacity" />
      </div>
      <div class="form-group" v-if="showFields.status">
        <select class="form-control" v-model="object.status">
          <option value="AVAILABLE">Disponible</option>
          <option value="OCCUPIED">Ocupada</option>
          <option value="RESERVED">Reservada</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: Object,
      default: () => {
        return reactive({})
      }
    },
    showFields: {
      type: Object,
      default: () => {
        return reactive({})
      },
      validator: (value) => {
        const defaultConfig = {
          identifier: true,
          locationDescription: true,
          capacity: true,
          status: true,
          branch: true,
        }
        for (const key in defaultConfig) {
          if (!value.hasOwnProperty(key)) {
            value[key] = defaultConfig[key];
          }
        }
        return true
      }
    }
  },
  data() {
    return {
      branches: []
    }
  },
  created() {
    this.$apollo.queries.searchBranches.refetch()
  },
  emits: ['update:modelValue'],
  computed: {
    object: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    }
  },
  apollo: {
    searchBranches: {
      query: searchBranches(`
          id
          name
          isActive
        `),
      variables() {
        return {
          fieldsOfModel: {
            isActive: true
          }
        }
      },
      result(response) {
        let { data } = response
        let { objects } = data.searchBranches
        this.branches = objects
      },
      skip() {
        return !this.showFields.branch
      }
    },
  }
}
</script>

<style></style>