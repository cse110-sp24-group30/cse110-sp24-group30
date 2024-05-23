import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.jest,
        page: true, // Specific globals for jest-puppeteer
        browser: true,
        context: true,
        jestPuppeteer: true,
      }
    }
  },
  pluginJs.configs.recommended,
];
