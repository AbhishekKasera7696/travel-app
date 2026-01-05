import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import {sentryReactRouter, type SentryReactRouterBuildOptions} from "@sentry/react-router";


const sentryConfig: SentryReactRouterBuildOptions = {
  org: "learning-javascript",
  project: "travel-app",
  // An auth token is required for uploading source maps;
  // store it in an environment variable to keep it secure.
  authToken: "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",
  // ...
};

export default defineConfig(config => {
  return {
    plugins: [tailwindcss(),tsconfigPaths(),reactRouter(),sentryReactRouter(sentryConfig, config)],
    ssr: {
      noExternal: [/@syncfusion/]
    }
  };
});

