<template>
  <!-- RESTAURANTES VISITADOS -->
  <div class="row row-sm mb-4">
    <div class="col-12">
      <h4>Estos son los ultimo restaurantes visitados</h4>
    </div>
    <div class="col-sm-6 col-md-6 col-xl-3">
      <div class="card custom-card">
        <div class="card-body user-card text-center">
          <div class="main-img-user avatar-lg online text-center">
            <img
              alt="avatar"
              class="rounded-circle"
              src="https://borealtech.com/wp-content/uploads/2018/10/codigo-qr-1024x1024-1.jpg"
            />
          </div>
          <div class="mt-2">
            <h5 class="mb-1">Sorento</h5>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- MIS RESTAURANTES -->
  <div class="row row-sm mb-4">
    <div class="col-12">
      <h4>Estos son tus propios restaurantes</h4>
    </div>
    <div class="col-sm-6 col-md-6 col-xl-3" v-for="(restaurant, i) in restaurants" :key="i">
      <div class="card custom-card">
        <div class="card-body user-card text-center">
          <div class="main-img-user avatar-lg online text-center">
            <img
              alt="logo"
              class="rounded-circle"
              :src="`${$envVar.apiBaseUrl}/${restaurant.logo}`"
            />

          </div>
          <div class="mt-2">
            <h5 class="mb-1">{{restaurant.name}}</h5>
            <p class="mb-1 tx-inverse">{{restaurant.slogan}}</p>
            <span class="text-muted"
              ><i class="far fa-check-circle text-success me-1"></i
              >Verificado</span
            >
          </div>
          <nuxt-link :to="`/${restaurant.slug}`" class="btn ripple btn-primary mt-3">Administrar</nuxt-link>
        </div>
      </div>
    </div>
    <div class="col-sm-6 col-md-6 col-xl-3 card custom-card" style="cursor: pointer;" @click="openModal()">
        <div class="card-body user-card text-center d-flex align-items-center justify-content-center">
          <span class="agregar-restaurante">+</span>
        </div>
    </div>
  </div>
  <!-- RESTAURANTES DONDE TRABAJO -->
  <div class="row row-sm mb-4" v-if="restaurantsWithEmployments && restaurantsWithEmployments.restaurants">
    <!-- TITULO -->
    <div class="col-12">
      <h4>Estos son los restaurantes para los que trabajas</h4>
    </div>
    <!-- CARDS -->
    <div class="col-md-12">
      <div class="card custom-card">
        <div class="row">
          <div class="col-4 px-0 border-end" v-for="(restaurant, i) in restaurantsWithEmployments.restaurants" :key="i">
            <div class="text-center pb-0 ps-0 pe-0 row">
              <div class="col-12 mb-2 mt-3">
                <h4>{{ restaurant.name }}</h4>
              </div>
              <div class="col-6 p-3 border-end border-top" v-for="(branch, n) in restaurant.branches" :key="n">
                <h6 class="mb-2">{{ branch.name }}</h6>
                <p class="mb-0 text-muted" v-for="(role, index) in branch.roles" :key="index">
                  - {{ role.name}}
                </p>
                <nuxt-link :to="`/${restaurant.slug}/${branch.slug}`" class="btn ripple btn-primary mt-3">Administrar</nuxt-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
</template>

<script>
import Modal from "@/components/generics/Modal.vue"
import ComponentFormCreateUpdateRestaurant from "~/components/dineUp/restaurant/Restaurant/createUpdate.vue"
import { useModal, useModalSlot } from 'vue-final-modal'

const FormCreateUpdateRestaurant = shallowRef(ComponentFormCreateUpdateRestaurant);


definePageMeta({
  middleware: "middleware-auth",
  layout: "index-layout"
})

export default {
  name: "MainDashboard",
  data() {
    return {
      propsUseModal: {},
      restaurantToCreate: {},
      restaurants: [],
      restaurantsWithEmployments: [],
    }
  },
  methods: {
    async createRestaurant() {
      let r = await executeMutation(
        createRestaurants(),
        {
          input: [{...this.restaurantToCreate, owner: this.$userLoggedIn?.id}]
        }
      )
      this.restaurantToCreate = reactive({})
      this.$apollo.queries.searchRestaurants.refetch()
      this.propsUseModal.close()
    },
    openModal() {
      const propsModal = useModal({
        defaultModelValue: true,
        component: Modal,
        attrs: {
          title: "Crear nuevo restaurante",
          onConfirm: this.createRestaurant,
          onCancel(...args) { },
          onClosed(...args) { },
        },
        slots: {
          default: useModalSlot({
            component: FormCreateUpdateRestaurant,
            attrs: {
              modelValue: this.restaurantToCreate,
            }
          })
        }
      })
      this.propsUseModal = reactive(propsModal)
    },
    transformEmployees(input) {
      if (input) {
        const output = {
          restaurants: []
        };

        input.restaurants.forEach(restaurant => {
          const transformedRestaurant = {
            id: restaurant.id,
            name: restaurant.name,
            slug: restaurant.slug,
            branches: []
          };

          input.jobFunctions.forEach(jobFunction => {
            if (jobFunction.branch.restaurant.id === restaurant.id) {
              const existingBranchIndex = transformedRestaurant.branches.findIndex(branch => branch.id === jobFunction.branch.id);

              if (existingBranchIndex === -1) {
                transformedRestaurant.branches.push({
                  id: jobFunction.branch.id,
                  name: jobFunction.branch.name,
                  slug: jobFunction.branch.slug,
                  roles: jobFunction.roles
                });
              } else {
                transformedRestaurant.branches[existingBranchIndex].roles.push(...jobFunction.roles);
              }
            }
          });

          output.restaurants.push(transformedRestaurant);
        });

        return output;
      }
      
    }
  },
  apollo: {
    searchRestaurants: {
      fetchPolicy: "no-cache",
      query: searchRestaurants(`
        id
        name
        slug
        logo
        slogan
        isActive
      `),
      result(response) {
        let { data } = response
        let { objects } = data.searchRestaurants
        this.restaurants = objects
      }
    },
    // searchEmployees: {
    //   fetchPolicy: "no-cache",
    //   query: searchEmployees(`
    //     id
    //     restaurants {
    //       id
    //       name
    //       slug
    //     }
    //     jobFunctions {
    //       id
    //       branch {
    //         id
    //         name
    //         slug
    //         restaurant {
    //           id
    //         }
    //       }
    //       roles {
    //         id
    //         name
    //       }
    //     }
    //     isActive
    //   `),
    //   variables() {
    //     return {
    //       pageSize: 9999,
    //       // fieldsOfModel: {
    //       //   dineUpUser: "" //TODO: Solo las del usuario logueado
    //       // }
    //     }
    //   },
    //   result(response) {
    //     let { data } = response
    //     let { objects } = data.searchEmployees
    //     let copyObjects = JSON.parse(JSON.stringify(objects))
    //     let object = this.transformEmployees(copyObjects[0])
    //     this.restaurantsWithEmployments = object
    //   }
    // }
  }
};
</script>

<style>
.agregar-restaurante {
  font-size: 100px; 
  font-weight: 100; 
  color: #ccc;
}
.agregar-restaurante:hover {
  transform: scale(0.75);
}
</style>
