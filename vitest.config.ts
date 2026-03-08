import solid from "vite-plugin-solid"
import { defineConfig } from "vitest/config"

export default defineConfig({
    plugins: [solid()],
    resolve: {
        conditions: ["development", "browser"],
    },
    ssr: {
        noExternal: [
            "@csstools/css-calc",
            "@asamuzakjp/css-color"
        ]
    },
    test: {
        environment: "jsdom",
        pool: "threads",
        server: {
            deps: {
                inline: [
                    "@csstools/css-calc",
                    "@asamuzakjp/css-color"
                ]
            }
        }
    }
})
