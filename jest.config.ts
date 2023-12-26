import type { Config } from "@jest/types";

// Solutions for jest:
// jsdom: https://stackoverflow.com/a/69228464/2887989
// watch: https://stackoverflow.com/a/39091907/2887989
// this file: https://stackoverflow.com/a/76995084/2887989
const config: Config.InitialOptions = {
    verbose: true,
    testEnvironment: "jsdom",
    transform: {
        "^.+\\.ts?$": ["ts-jest", {tsconfig: "./tsconfig.json"}],
    },
    preset: "ts-jest",
    moduleNameMapper: {
      "React": "<rootDir>/node_modules/solid-js/h/jsx-runtime/dist/jsx.cjs",
      "solid-js/web": "<rootDir>/node_modules/solid-js/web/dist/web.cjs",
      "solid-js": "<rootDir>/node_modules/solid-js/dist/solid.cjs"
    }
};

export default config;
