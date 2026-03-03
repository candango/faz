
import { context } from "esbuild";
import { assets } from "./assets.mjs";
import { entryPoints } from "./entryPoints.mjs";
import { copy } from "esbuild-plugin-copy";
import { solidPlugin } from "esbuild-plugin-solid";

entryPoints.push({ out: "custom-tag.bundle", in: "showcase/src/custom-tag.tsx" });
entryPoints.push({ out: "form.bundle", in: "showcase/src/form.tsx" });

entryPoints.push({ out: "global.bundle", in: "showcase/src/global.ts" });
entryPoints.push({ out: "css/showcase", in: "stylesheets/showcase.css"});

let ctx = await context({
    entryPoints: entryPoints,
    bundle: true,
    minify: true,
    write: true,
    treeShaking: true,
    sourcemap: true,
    logLevel: "info",
    outdir: "showcase/dist",
    legalComments: "none",
    allowOverwrite: false,
    plugins:[
        copy(assets),
        solidPlugin()
    ],
    loader: { '.png': 'binary' },
});

await ctx.watch();

await ctx.serve({
    port: 8081,
    servedir: "showcase",
    onRequest: (args) => {
        let logMessage = "";
        for (let key in args) {
            logMessage += key + ": " + args[key] + " ";
        }
        console.log(logMessage);
    }
})
