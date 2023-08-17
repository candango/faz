/**
 * Copyright 2018-2023 Flavio Garcia
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as esbuild from "esbuild";
import { assets } from "./assets.mjs";
import { entryPoints } from "./entryPoints.mjs";
import { copy } from "esbuild-plugin-copy";
import { solidPlugin } from "esbuild-plugin-solid";

let ctx = await esbuild.context({
    entryPoints: entryPoints,
    bundle: true,
    minify: true,
    write: true,
    treeShaking: true,
    sourcemap: true,
    logLevel: "info",
    outdir: "dist",
    legalComments: "none",
    allowOverwrite: true,
    plugins:[
        copy(assets),
        solidPlugin()
    ]
});

await ctx.watch();
