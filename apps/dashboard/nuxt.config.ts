const API_URL = "http://localhost:3000/auth/";

// https://nuxt.com/docs/api/configuration/nuxt-config
// @ts-nocheck
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  devServer: {
    port: 3005,
  },
  modules: [
    "@sidebase/nuxt-auth",
    "@nuxtjs/tailwindcss",
    "shadcn-nuxt",
    "@nuxtjs/color-mode",
  ],
  colorMode: {
    classSuffix: "",
  },
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: "",
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: "./components/ui",
  },
  auth: {
    isEnabled: true,
    // disableServerSideAuth: false,
    // originEnvKey: "AUTH_ORIGIN",
    globalAppMiddleware: true,
    baseURL: API_URL,
    provider: {
      type: "local",
      endpoints: {
        signIn: { path: `login`, method: "post" },
        signUp: { path: `signup`, method: "post" },
        getSession: { path: `session`, method: "get" },
      },

      token: {
        signInResponseTokenPointer: "/data/accessToken",
        // signInResponseRefreshTokenPointer: "/data/refreshToken",
        type: "Bearer",
        cookieName: "auth.token",
        headerName: "Authorization",
        maxAgeInSeconds: 1800,
        sameSiteAttribute: "lax",
        // cookieDomain: 'sidebase.io',
        secureCookieAttribute: false,
        httpOnlyCookieAttribute: false,
      },
      refresh: {
        token: {
          signInResponseRefreshTokenPointer: "/data/refreshToken",
        },
      },
    },
  },
});
