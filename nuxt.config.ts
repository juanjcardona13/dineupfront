// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  components: [
    {
      path: "components/generics",
    },
    {
      path: "components/bootstrap",
    },
    "components",
  ],
  plugins: [
    { src: "@/plugins/auth.js", ssr: false },
    { src: "@/plugins/vue-good-table-next.js", ssr: false },
    { src: "@/plugins/vue-sweetalert2.ts", ssr: false },
    { src: "@/plugins/vee-validate.ts", ssr: false },
    { src: "@/plugins/apollo.js", ssr: false },
    { src: "@/plugins/register-user-logged-in.js", ssr: false },
  ],
  css: [
    "@/assets/scss/styles.scss",
    "@/assets/styles/custom.css",
    "@/main.scss",
    "vue-final-modal/style.css",
    "@fortawesome/fontawesome-svg-core/styles.css",
  ],
  modules: ["@vee-validate/nuxt", "@pinia/nuxt", "@nuxtjs/i18n"],
  imports: {
    // global: true,
    dirs: ["graphql/schema_client_js/schema_cruddals"],
  },
  i18n: {
    locales: [
      { code: "es", name: "Español", file: "es.json", iso: "es-ES" },
      { code: "en", name: "Ingles", file: "en.json", iso: "en-US" },
    ],
    defaultLocale: "es",
    strategy: "no_prefix",
    lazy: true,
    langDir: "locales",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      alwaysRedirect: true,
      redirectOn: "root",
    },
    vueI18n: "./i18n.config.ts",
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: "https://backend.dineup.com.co"
    }
  }
});
