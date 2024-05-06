<template>
  <div class="row">
    <div class="col-4" v-if="showFields.employee">
      <div class="form-group mb-0">
        <v-select 
          :options="employees" 
          label="dineUpUser.user.username" 
          :reduce="employee => employee.id" 
          v-model="object.employee"
          class="last-v-select"
          placeholder="Seleccione el empleado"></v-select>
      </div>
    </div>
    <div class="col-4" v-if="showFields.branch">
      <div class="form-group mb-0">
        <v-select 
          :options="branches"
          label="name" 
          :reduce="branch => branch.id" 
          v-model="object.branch" 
          placeholder="Seleccione la sucursal"></v-select>
      </div>
    </div>
    <div class="col-4" v-if="showFields.roles">
      <div class="form-group mb-0">
        <v-select 
          :selectable="isOptionSelectableBasedOnSelectedOptions(object.roles)" 
          :options="roles"
          label="name" 
          :reduce="role => role.id" 
          v-model="object.roles" 
          multiple
          placeholder="Seleccione los roles"></v-select>
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
      },
      validator: (value) => {
        const defaultConfig = { }
        for (const key in defaultConfig) {
          if (!value.hasOwnProperty(key)) {
            value[key] = defaultConfig[key];
          }
        }
        return true;
      }
    },
    showFields: {
      type: Object,
      default: () => {
        return reactive({})
      },
      validator: (value) => {
        const defaultConfig = {
          employee: true,
          branch: true,
          roles: true,
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
  created() {
    this.$apollo.queries.searchEmployees.refetch()
    this.$apollo.queries.searchBranches.refetch()
    this.$apollo.queries.searchRoles.refetch()
  },
  data() {
    return {
      employees: [],
      branches: [],
      roles: [],
    }
  },
  apollo: {
    searchEmployees: {
      query: searchEmployees(`
          id
          dineUpUser {
            id
            user {
              id
              username
            }
          }
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
        let { objects } = data.searchEmployees
        this.employees = objects
      }
    },
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
      }
    },
    searchRoles: {
      query: searchRoles(`
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
        let { objects } = data.searchRoles
        this.roles = objects
      }
    },
  }
}
</script>

<style></style>