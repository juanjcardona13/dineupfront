<template>
  <div class="app" v-bind:class="{ 
		'app-header-menu-search-toggled': appOption.appHeaderSearchToggled,
		'app-sidebar-minified': appOption.appSidebarMinified,
		'app-sidebar-collapsed': appOption.appSidebarCollapsed,
		'app-sidebar-mobile-toggled': appOption.appSidebarMobileToggled,
		'app-sidebar-mobile-closed': appOption.appSidebarMobileClosed,
		'app-content-full-height': appOption.appContentFullHeight,
		'app-content-full-width': appOption.appSidebarHide,
		'app-without-sidebar': appOption.appSidebarHide,
		'app-without-header': appOption.appHeaderHide,
		'app-boxed-layout': appOption.appBoxedLayout,
		'app-footer-fixed': appOption.appFooterFixed,
	}">
  <div class="app-content" v-bind:class="appOption.appContentClass">
    <NuxtPage />
  </div>
  </div>
</template>

<script>
import { getCurrentInstance } from 'vue';
import { useAppOptionStore } from '~/stores/app-option';
// import { ProgressFinisher, useProgress } from '@marcoschulte/vue3-progress';
// import AppSidebar from '@/components/app/Sidebar.vue';
// import AppHeader from '@/components/app/Header.vue';
// import AppFooter from '@/components/app/Footer.vue';
// import AppThemePanel from '@/components/app/ThemePanel.vue';

export default {
  setup(props) {

    const { $pinia } = useNuxtApp()
    const appOption = useAppOptionStore($pinia);
    
    const internalInstance = getCurrentInstance();

    const progresses = [];

    const router = useRouter();

    router.beforeEach(async (to, from) => {
      // progresses.push(useProgress().start());
      appOption.appSidebarMobileToggled = false;
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
      
      var targetElm = [].slice.call(document.querySelectorAll('.app-sidebar .menu-submenu'));
      targetElm.map(function(elm) {
        elm.style.display = '';
      });
    })
    router.afterEach(async (to, from) => {
      progresses.pop()?.finish();
    })

    document.querySelector('body').classList.add('app-init');

    return {
      appOption
    }
  }
};
</script>
