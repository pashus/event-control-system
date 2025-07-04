import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: {
    host: true,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/api/v1"),
        secure: false,
      },
    },
  },
  build: {
    sourcemap: mode === "development",
  },
  // This allows to have sourcemaps in production. They are not loaded unless you open the devtools
  // Remove this line if you don't need to debug react-admin in production
  resolve: { alias: getAliasesToDebugInProduction() },
  base: "/event-control-system/",
}));

function getAliasesToDebugInProduction() {
  return [
    {
      find: "react-admin",
      replacement: path.resolve(__dirname, "./node_modules/react-admin/src"),
    },
    {
      find: "ra-core",
      replacement: path.resolve(__dirname, "./node_modules/ra-core/src"),
    },
    {
      find: "ra-ui-materialui",
      replacement: path.resolve(
        __dirname,
        "./node_modules/ra-ui-materialui/src",
      ),
    },
    {
      find: "ra-i18n-polyglot",
      replacement: path.resolve(
        __dirname,
        "./node_modules/ra-i18n-polyglot/src",
      ),
    },
    {
      find: "ra-language-english",
      replacement: path.resolve(
        __dirname,
        "./node_modules/ra-language-english/src",
      ),
    },
    {
      find: "ra-data-json-server",
      replacement: path.resolve(
        __dirname,
        "./node_modules/ra-data-json-server/src",
      ),
    },
    {
      find: "ra-data-simple-rest",
      replacement: path.resolve(
        __dirname,
        "./node_modules/ra-data-simple-rest/src",
      ),
    },
    {
      find: "ra-data-fakerest",
      replacement: path.resolve(
        __dirname,
        "./node_modules/ra-data-fakerest/src",
      ),
    },
    {
      find: "ra-language-russian",
      replacement: path.resolve(
        __dirname,
        "./node_modules/ra-language-russian/src",
      ),
    },
    // add any other react-admin packages you have
  ];
}
