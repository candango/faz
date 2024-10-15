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
    // outExtension: { '.js': '.cjs' },
    // target: ['chrome58', 'firefox57', 'safari11', 'edge16'],
    plugins:[
        solidPlugin()
    ]
}).catch(() => process.exit(1));
