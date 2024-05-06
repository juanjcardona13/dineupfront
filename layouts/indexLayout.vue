<template>
  <div className="horizontalMenucontainer" :key="userLoggedIn.id">
    <div className="page">
      <!--HEADER-->
      <div class="main-header sticky">
        <div class="main-container container">
          <div class="main-header-left">
            <a class="main-header-menu-icon" href="javascript:;" id="mainSidebarToggle" v-on:click="HeaderToggleButton()">
              <span></span>
            </a>
            <div class="hor-logo">
              <NuxtLink class="main-logo" :to="`/`">
                <img
                  src="@/assets/img/brand/logo.png"
                  class="header-brand-img desktop-logo logo-light"
                  alt="logo"
                  style="width: 40%;"
                />
                <img
                  src="@/assets/img/brand/logo-light.png"
                  class="header-brand-img desktop-logo-dark logo-light"
                  alt="logo"
                />
              </NuxtLink>
            </div>
          </div>
          <div class="main-header-center">
            <div class="responsive-logo">
              <NuxtLink :to="`/`"
                ><img
                  src="@/assets/img/brand/logo.png"
                  class="mobile-logo logo-light"
                  alt="logo"
                  style="width: 30%;"
              /></NuxtLink>
              <NuxtLink :to="`/`"
                ><img
                  src="@/assets/img/brand/logo-light.png"
                  class="mobile-logo-dark logo-light"
                  alt="logo"
              /></NuxtLink>
            </div>
          </div>
          <div class="main-header-right">
            <div class="me-3" style="cursor: pointer" @click="logout()" >
              <i class="fe fe-log-out"></i>
            </div>
          </div>
        </div>
      </div>
      <!--CONTENT-->
      <div className="main-content pt-0">
        <div className="main-container container">
          <div className="inner-body" style="margin-top: 5.8rem;">
            <slot/>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>
<script>
import Footer from "~/components/layout/Footer.vue";

export default {
  components: {
    Footer,
  },
  setup(props) {
    useHead({
      bodyAttrs: {
        class: 'ltr main-body horizontalmenu'
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
