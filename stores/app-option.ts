import { defineStore } from "pinia";

export const useAppOptionStore = defineStore('appOption', {
  state: () => {
    return {
    	appThemeClass: '',
    	appCoverClass: '',
			appBoxedLayout: false,
			appHeaderHide: false,
			appHeaderSearchToggled: false,
			appSidebarCollapsed: false,
			appSidebarMobileToggled: false,
			appSidebarMobileClosed: false,
			appSidebarHide: false,
			appContentFullHeight: false,
			appContentClass: '',
			appFooter: false,
			appFooterFixed: false,
			appThemePanelToggled: false
		}
  }
});
