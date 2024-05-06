<template>
  <!-- Sidemenu -->
  <div class="sticky" @mouseenter="showInfoBar(index)" @mouseleave="hideInfoBar(index)">
    <div class="main-menu main-sidebar main-sidebar-sticky side-menu is-expanded sidemenu-scroll" >
      <div>
        <div class="main-sidebar-header main-container-1">
          <!-- Logo -->
          <div class="sidemenu-logo">
            <NuxtLink :to="`/`">
              <img
                src="@/assets/img/brand/logo-light.png"
                class="header-brand-img desktop-logo"
                alt="logo 1"
                style="width: 80%;"
              />
              <img
                src="@/assets/img/brand/icon-light.png"
                class="header-brand-img icon-logo"
                alt="logo 2"
              />
              <img
                src="@/assets/img/brand/logo.png"
                class="header-brand-img desktop-logo theme-logo"
                alt="logo 3"
              />
              <img
                src="@/assets/img/brand/icon.png"
                class="header-brand-img icon-logo theme-logo"
                alt="logo 4"
              />
            </NuxtLink>
          </div>
          <!-- Menu items -->
          <div class="main-sidebar-body main-body-1">
            <!-- left-arrow -->
            <div class="slide-left disabled" id="slide-left">
              <svg xmlns="http://www.w3.org/2000/svg" fill="#7b8191" width="24" height="24" viewBox="0 0 24 24" >
                <path d="M13.293 6.293 7.586 12l5.707 5.707 1.414-1.414L10.414 12l4.293-4.293z" />
              </svg>
            </div>
            <!-- List navigation items -->
            <ul class="menu-nav nav">
              <template v-for="navigationItem in NAVIGATION_ITEMS" :key="navigationItem.headTitle">
                <NavigationItems
                  :navigation-item="navigationItem"
                  :setNavActive="setNavActive"
                  :toggleNavActive="toggleNavActive"
                ></NavigationItems>
              </template>
            </ul>
            <!-- right-arrow  -->
            <div class="slide-right" id="slide-right">
              <svg xmlns="http://www.w3.org/2000/svg" fill="#7b8191" width="24" height="24" viewBox="0 0 24 24" >
                <path d="M10.707 17.707 16.414 12l-5.707-5.707-1.414 1.414L13.586 12l-4.293 4.293z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavigationItems from "~/components/generics/NavigationItems.vue";

export default {
  name: "Sidebar",
  components: {
    NavigationItems
  },
  data() {
    const restaurantSlug = this.$route.params.restaurant_slug || "all"
    return {
      NAVIGATION_ITEMS: [
        {
          headTitle: "dashboard",
          children: [
            {
              path: `/${restaurantSlug}/`,
              title: "Inicio",
              type: "link",
              icon: "fa fa-house-chimney",
              active: true,
              defaultActive: true,
            },
          ]
        },
        {
          headTitle: "restaurante",
          children: [
            {
              title: "Info del restaurante",
              path: `/${restaurantSlug}/restaurant/restaurants/`,
              icon: "fa fa-store",
              type: "link",
              active: false,
              defaultActive: false,
            },
            // {
            //   title: "Sucursales",
            //   path: `/${restaurantSlug}/restaurant/branches/`,
            //   icon: "fa fa-utensils",
            //   type: "link",
            //   active: false,
            //   defaultActive: false,
            // },
            {
              title: "Mesas",
              path: `/${restaurantSlug}/restaurant/tables/`,
              icon: "fa fa-chair",
              type: "link",
              active: false,
              defaultActive: false,
            },
            // {
            //   title: "Redes sociales",
            //   path: `/${restaurantSlug}/restaurant/social-media/`,
            //   icon: "fa fa-comments",
            //   type: "link",
            //   active: false,
            //   defaultActive: false,
            // },
          ]
        },
        {
          headTitle: "menú",
          children: [
            {
              path: `/${restaurantSlug}/menu/categories/`,
              title: "Categorías",
              type: "link",
              icon: "fa fa-tags",
              active: false,
              defaultActive: false,
            },
            {
              path: `/${restaurantSlug}/menu/menu-items/`,
              title: "Items del Menús",
              type: "link",
              icon: "fa fa-plate-wheat",
              active: false,
              defaultActive: false,
            },
            // {
            //   path: `/${restaurantSlug}/menu/menus/`,
            //   title: "Menús",
            //   type: "link",
            //   icon: "fa fa-book-open",
            //   active: false,
            //   defaultActive: false,
            // },
          ]
        },
        {
          headTitle: "Pedidos",
          children: [
          {
              path: `/${restaurantSlug}/orders/orders/`,
              title: "Admin total de pedidos",
              type: "link",
              icon: "fa fa-bell-concierge",
              active: false,
              defaultActive: false,
            }
          ]
        },
        {
          headTitle: "Empleados",
          children: [
            {
              path: `/${restaurantSlug}/accounts/roles/`,
              title: "Roles",
              type: "link",
              icon: "fa fa-user-tag",
              active: false,
              defaultActive: false,
            },
            {
              path: `/${restaurantSlug}/accounts/employees/`,
              title: "Empleados",
              type: "link",
              icon: "fa fa-users",
              active: false,
              defaultActive: false,
            },
          ]
        },
        {
          headTitle: "Configuración",
          children: [
            {
              path: `/${restaurantSlug}/settings/`,
              title: "Configuraciones",
              type: "link",
              icon: "fe fe-settings",
              active: false,
              defaultActive: false,
            },
          ]
        },
      ],
    };
  },
  methods: {
    checkNavActiveOnLoad() {
      const checkPathAndSetActive = (items, path) => {
        items.forEach((menuItem) => {
          if (menuItem.path === path) {
            this.setNavActive(menuItem);
          }
          if (menuItem.children) {
            checkPathAndSetActive(menuItem.children, path);
          }
        });
      };

      const path = location.pathname; //Posible error, gpt recomiendo window.location.....
      checkPathAndSetActive(this.NAVIGATION_ITEMS, path);

      setTimeout(() => {
        if ( document.body.classList.contains("horizontalmenu") && window.innerWidth > 992 ) {
          this.closeNavActive();
        }
      }, 200);
    },
    setNavActive(item) {
      const deactivateItems = (items) => {
        items.forEach((menuItem) => {
          menuItem.active = false;
          menuItem.defaultActive = false;
          if (menuItem.children) {
            deactivateItems(menuItem.children);
          }
        });
      };

      const activateItem = (items, itemToActivate) => {
        items.forEach((menuItem) => {
          if (menuItem === itemToActivate) {
            menuItem.active = true;
            menuItem.defaultActive = true;
          } else if (menuItem.children) {
            activateItem(menuItem.children, itemToActivate);
          }
        });
      };

      deactivateItems(this.NAVIGATION_ITEMS);
      activateItem(this.NAVIGATION_ITEMS, item);

      if ( document.body.classList.contains("horizontalmenu-hover") && window.innerWidth >= 992 ) {
        this.closeNavActive();
      }
    },
    toggleNavActive(item, items = this.NAVIGATION_ITEMS) {
      if ( !document.body.classList.contains("horizontalmenu-hover") || window.innerWidth < 992 ) {
        if (item.active) {
          if (item.type == "sub") {
            item.active = false;
          }
        }  else {
          
          items.forEach(a => {
            if (items.includes(item)) {
              a.active = false;
            }
            if (!a.children) {
              return false;
            }
            this.toggleNavActive(item, a.children);
          });

          item.active = true;
        }
      }
    },
    closeNavActive() {
      this.NAVIGATION_ITEMS.forEach((a) => {
        if (this.NAVIGATION_ITEMS) {
          a.active = false;
        }
        if (!a.children) {
          return false;
        }
        a.children.forEach((b) => {
          if (a.children) {
            b.active = false;
          }
        });
        return;
      });
    },
    MovetoChatpage() {
      this.$router.replace({ path: `/dashboard` });
    },
    showInfoBar() {
      if (document.body.classList.contains("main-sidebar-hide")) {
        document.body.classList.add("main-sidebar-open");
      }
    },
    hideInfoBar() {
      document.body.classList.remove("main-sidebar-open");
    },
  },
  created() {
    this.checkNavActiveOnLoad();
    window.addEventListener("resize", () => {
      if (window.innerWidth <= 992) {
        this.checkNavActiveOnLoad();
      }
      if (
        document.body.classList.contains("horizontalmenu-hover") &&
        window.innerWidth >= 992
      ) {
        this.closeNavActive();
      }
    });
  },
  watch: {
    $route(to, from) {
      if (to.path !== from.path) {
        this.checkNavActiveOnLoad();
      }
    },
  },
};
</script>
