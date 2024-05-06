<template>
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
          /></NuxtLink>
          <NuxtLink :to="`/`"
            ><img
              src="@/assets/img/brand/logo-light.png"
              class="mobile-logo-dark logo-light"
              alt="logo"
          /></NuxtLink>
        </div>
        <div class="input-group">
          <div class="input-group-btn search-panel"></div>
          <input
            type="search"
            class="form-control rounded-0"
            placeholder="Search for anything..."
          />
          <button class="btn search-btn"><i class="fe fe-search"></i></button>
        </div>
      </div>
      <!-- <div class="mg-r-10">
        <form>
          <select v-model="locale">
            <option value="en">en</option>
            <option value="es">es</option>
          </select>
        </form>
      </div> -->
      <div class="main-header-right">
        <div class="me-3" style="cursor: pointer" @click="logout()" >
          <i class="fe fe-log-out"></i>
        </div>
      </div>

</template>

<script>
export default {
  components: {
    // Multiselect,
  },

  name: "Header",
  //sticky-pin
  created() {
    const scrolltop = window.addEventListener("scroll", this.handleScroll);
  },
  destroyed() {
    window.removeEventListener("scroll");
  },
  methods: {
    //rightsidebar
    openCloseSidebar1() {
      document.querySelector(".header-settings").classList.toggle("show");
      document.querySelector(".sidebar-right").classList.toggle("sidebar-open");
    },
    //Switcherbutton
    Switcherbutton() {
      {
        document.querySelector(".demo_changer").classList.toggle("active");
        document.querySelector(".demo_changer").style.right = "0px";
      }
    },
    //Darkmode
    Darkmode() {
      document.querySelector("body").classList.toggle("dark-theme");
    },
    HeaderToggleButton() {
      let body = document.querySelector("body");
      let innerWidth = window.innerWidth;
      if (body !== !body) {
        if (innerWidth >= 992) {
          document.querySelector("body")?.classList.toggle("main-sidebar-hide");
          document.querySelector("body")?.classList.remove("main-sidebar-show");
        } else if (document.body.classList.contains("horizontalmenu")) {
          document.querySelector("body")?.classList.toggle("main-navbar-show");
          document.querySelector("body")?.classList.remove("main-sidebar-show");
          document.querySelector("body")?.classList.remove("main-sidebar-hide");
        } else {
          document.querySelector("body")?.classList.toggle("main-sidebar-show");
          document.querySelector("body")?.classList.remove("main-sidebar-hide");
        }
      }
    },
    Fullscreen() {
      if (
        (document.fullScreenElement && document.fullScreenElement === null) ||
        (!document.mozFullScreen && !document.webkitIsFullScreen)
      ) {
        if (document.documentElement.requestFullScreen) {
          document.documentElement.requestFullScreen();
        } else if (document.documentElement.mozRequestFullScreen) {
          document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullScreen) {
          document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        }
      } else {
        if (document.cancelFullScreen) {
          document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        }
      }
    },
    //sticky-pin
    handleScroll() {
      if (window.scrollY > 30) {
        let Scolls = document.querySelectorAll(".sticky");
        Scolls.forEach((e) => {
          e.classList.add("sticky-pin");
        });
      } else {
        let Scolls = document.querySelectorAll(".sticky");
        Scolls.forEach((e) => {
          e.classList.remove("sticky-pin");
        });
      }
    },
    headerSearch() {
      let searchBtn = document.querySelector(".header-search");
      searchBtn.classList.add("show");
    },
  },
};
</script>
