<template>
  <div>
    <div class="page-header">
      <div>
        <h2 class="main-content-title tx-24 mg-b-5">Configuraciones</h2>
      </div>
    </div>
    <div class="row row-sm">
      <div class="col-lg-12 col-xl-4 col-md-12 col-12 col-sm-12" v-for="(_module, i) in modules" :key="i">
        <div class="card custom-card">
          <div class="card-header custom-card-header border-bottom-0">
            <h5 class="main-content-label tx-dark tx-medium mb-0">{{ _module.name }}</h5>
          </div>
          <div class="card-body">
            <h6>{{ _module.description }}</h6>
            <ul>
              <li v-for="(subModule, n) in _module.subModules" :key="n">
                <nuxt-link :to="subModule.path">{{ subModule.title }}</nuxt-link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
definePageMeta({
  middleware: "middleware-auth",
})
export default {
  components: {},
  data() {
    const restaurantSlug = this.$route.params.restaurant_slug || "all"
    return {
      modules: [
        {
          name: "Modulo de restaurantes",
          description: "",
          subModules: [
            {
              title: "Restaurantes",
              path: `/${restaurantSlug}/restaurant/restaurants/`
            },
            {
              title: "Sucursales",
              path: `/${restaurantSlug}/restaurant/branches/`
            },
            {
              title: "Números telefónicos",
              path: `/${restaurantSlug}/restaurant/branch-phone-numbers/`
            },
            {
              title: "Mesas",
              path: `/${restaurantSlug}/restaurant/tables/`
            },
            {
              title: "Plataformas de redes sociales",
              path: `/${restaurantSlug}/restaurant/social-media-platforms/`
            },
            {
              title: "Redes sociales",
              path: `/${restaurantSlug}/restaurant/social-media/`
            }
          ]
        },
        {
          name: "Modulo de menú",
          description: "",
          subModules: [
            {
              title: "Menu",
              path: `/${restaurantSlug}/menu/menus/`
            },
            {
              title: "Categorías",
              path: `/${restaurantSlug}/menu/categories/`
            },
            {
              title: "Items del menu",
              path: `/${restaurantSlug}/menu/menu-items/`
            },
            {
              title: "Variantes de los items del menu",
              path: `/${restaurantSlug}/menu/menu-item-variants/`
            },
            {
              title: "Opciones de las variantes",
              path: `/${restaurantSlug}/menu/variant-options/`
            },
            {
              title: "Imágenes de los items del menu",
              path: `/${restaurantSlug}/menu/item-images/`
            },
            {
              title: "Grupo de opciones",
              path: `/${restaurantSlug}/menu/option-groups/`
            },
            {
              title: "Opciones",
              path: `/${restaurantSlug}/menu/item-options/`
            },
            {
              title: "Etiquetas",
              path: `/${restaurantSlug}/menu/item-tags/`
            },
          ]
        },
        {
          name: "Modulo de pedidos",
          description: "",
          subModules: [
            {
              title: "Estados para los pedidos",
              path: `/${restaurantSlug}/orders/order-status/`
            },
            {
              title: "Pedidos",
              path: `/${restaurantSlug}/orders/orders/`
            },
            {
              title: "Items de los pedidos",
              path: `/${restaurantSlug}/orders/order-items/`
            },
            {
              title: "Opciones personalizadas del pedido",
              path: `/${restaurantSlug}/orders/order-item-options/`
            }
          ]
        },
        {
          name: "Modulo de usuarios",
          description: "",
          subModules: [
            {
              title: "Usuarios",
              path: `/${restaurantSlug}/accounts/dine-up-users/`
            },
            {
              title: "Roles",
              path: `/${restaurantSlug}/accounts/roles/`
            },
            {
              title: "Empleados",
              path: `/${restaurantSlug}/accounts/employees/`
            },
            {
              title: "Funciones laborales",
              path: `/${restaurantSlug}/accounts/job-functions/`
            },
          ]
        },
        {
          name: "Modulo de configuración",
          description: "",
          subModules: [
            {
              title: "Horarios",
              path: `/${restaurantSlug}/core/schedules/`
            },
            {
              title: "Items de Horarios",
              path: `/${restaurantSlug}/core/schedule-items/`
            },
            {
              title: "Franja horaria",
              path: `/${restaurantSlug}/core/time-slots/`
            },
          ]
        },
      ]
    }
  },
  methods: {},
  apollo: {}
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