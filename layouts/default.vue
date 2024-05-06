<template>
  <div className="horizontalMenucontainer" :key="userLoggedIn.id">
    <div className="page">
      <div class="main-header side-header sticky">
        <div class="main-container container-fluid">
          <Header  />
        </div>
      </div>
      <Sidebar />
      <div className="main-content side-content pt-0">
        <div className="main-container container-fluid">
          <div className="inner-body" style="margin-top: 5.8rem;">
            <slot></slot>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>
<script>
import Header from "~/components/layout/Header.vue";
import Sidebar from "~/components/layout/Sidebar.vue";
import Footer from "~/components/layout/Footer.vue";
import { useAppBusinessLogicStore } from "~/stores/app-business-logic";

export default {
  components: {
    Header,
    Sidebar,
    Footer,
  },
  setup(props) {
    const businessLogicStore = useAppBusinessLogicStore()
    businessLogicStore.setGlobalRestaurant()

    useHead({
      bodyAttrs: {
        class: 'ltr main-body leftmenu'
      },
    })
  },
  computed: {
    userLoggedIn() {
      return this.$getUserLoggedIn()
    }
  }
};
</script>
