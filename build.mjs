
import * as esbuild from "esbuild";
import {entryPoints} from "./entryPoints.mjs";
import { solidPlugin } from "esbuild-plugin-solid";

// The fix was posted here:
// https://medium.com/geekculture/build-a-library-with-esbuild-23235712f3c
await esbuild.build({
    entryPoints: entryPoints,
    bundle: true,
    minify: true,
    // splitting: true,
    write: true,
    treeShaking: true,
    sourcemap: true,
    format: "esm",
    define: { gobal: "window" },
    target: ["esnext"],
    outdir: "dist/js",
    logLevel: "info",
    legalComments: "none",
    external: [
        "solid-js",
        "solid-js/*",
    ],
    // outExtension: { '.js': '.cjs' },
    // target: ['chrome58', 'firefox57', 'safari11', 'edge16'],
    plugins:[
        solidPlugin()
    ]
}).catch(() => process.exit(1));
