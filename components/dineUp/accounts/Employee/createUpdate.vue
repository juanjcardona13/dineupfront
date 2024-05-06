<template>
  <div class="row">
    <div class="col-12">
      <div class="form-group" v-if="showFields.dineUpUser">
        <input class="form-control" placeholder="E-mail" v-model="object.dineUpUser.user.email" @blur="getDineUpUserForUserEmail(object.dineUpUser.user.email)" />
      </div>
      <div class="form-group" v-if="showFields.leader">
        <v-select :options="employees"
          label="name" :reduce="employee => employee.id" v-model="object.leader"
          placeholder="Seleccione el líder"></v-select>
      </div>
      <div class="form-group" v-if="showFields.restaurants">
        <v-select 
          :options="restaurants"
          :selectable="isOptionSelectableBasedOnSelectedOptions(object.restaurants)"
          multiple
          label="name" 
          :reduce="restaurant => restaurant.id" 
          v-model="object.restaurants"
          placeholder="Seleccione el restaurante"></v-select>
      </div>
    </div>

    
    <!-- Agregar job functions -->
    <div class="col-10 mb-3">
      <template v-for="(image, i) in object.jobFunctions" :key="i">
        <DineUpAccountsJobFunctionCreateUpdate class="mb-3" v-model="object.jobFunctions[i]" :showFields="{employee: false}" />
      </template>
    </div>
    <!-- botones -->
    <div class="col-2 mb-3">
      <!-- boton eliminar job function -->
      <button v-for="(i) in object.jobFunctions.length-1" :key="i" class="btn ripple btn-outline-danger btn-icon btn-rounded mb-3" data-bs-placement="right"
        data-bs-toggle="tooltip-danger" title="Quitar job function" @click="object.jobFunctions.splice(i, 1)">
        <i class="fa fa-minus"></i>
      </button>
      <!-- boton agregar mas job function -->
      <button class="btn ripple btn-outline-primary btn-icon btn-rounded" data-bs-placement="right"
        data-bs-toggle="tooltip-primary" title="Agregar otra job function" @click="object.jobFunctions.push({})">
        <i class="fa-regular fa-plus"></i>
      </button>
    </div>


  </div>
</template>

<script>
import DineUpAccountsJobFunctionCreateUpdate from '@/components/dineUp/accounts/JobFunction/createUpdate.vue'

export default {
  props: {
    modelValue: {
      type: Object,
      default: () => {
        return reactive({})
      },
      validator: (value) => {
        const defaultConfig = {
          dineUpUser: {
            user: {},
          },
          jobFunctions: [{}],
        }
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
          dineUpUser: true,
          leader: true,
          restaurants: true,
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
  components: {
    DineUpAccountsJobFunctionCreateUpdate
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
  methods: {
    async getDineUpUserForUserEmail(userEmail) {
      if (userEmail) {
        const { data } = await this.$apollo.query({
          query: readDineUpUser(`id`),
          variables: {
            where: {
              user: {
                username: {
                  exact: userEmail
                }
              }
            }
          }
        })
        const { total, objects } = data.readDineUpUser
        if (total == 1) {
          this.object.dineUpUser.id = objects[0].id
        }
      }
    }
  },
  created() {
    this.$apollo.queries.searchEmployees.refetch()
    this.$apollo.queries.searchRestaurants.refetch()
  },
  data() {
    return {
      employees: [],
      restaurants: [],
    }
  },
  apollo: {
    searchEmployees: {
      query: searchEmployees(`
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
        let { objects } = data.searchEmployees
        this.employees = objects
      },
      skip() {
        return !this.showFields.leader
      }
    },
    searchRestaurants: {
      query: searchRestaurants(`
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
        let { objects } = data.searchRestaurants
        this.restaurants = objects
      },
      skip() {
        return !this.showFields.leader
      }
    },
  }
}
</script>

<style></style>