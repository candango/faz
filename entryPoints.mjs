/**
 * Copyright 2018-2023 Flávio Gonçalves Garcia
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

export const entryPoints =  [
    { out: "alert-solid.bundle", in: "src/app/alert.tsx" },
    { out: "nav-solid.bundle", in: "src/app/nav.tsx" },
    { out: "global.bundle", in: "app/global.js" },

    { out: "css/faz", in: "stylesheets/faz.css"},
    { out: "css/showcase", in: "stylesheets/showcase.css"},

    { out: "vendor/bootstrap.min", in:
        "node_modules/bootstrap/dist/js/bootstrap.min.js"},
    { out: "vendor/css/bootstrap.min", in:
        "node_modules/bootstrap/dist/css/bootstrap.min.css"},
    { out: "vendor/jquery.min", in:
        "node_modules/jquery/dist/jquery.min.js"},
    { out: "vendor/popper.min", in:
        "node_modules/@popperjs/core/dist/umd/popper.min.js"},
    { out: "vendor/codemirror", in:
        "node_modules/codemirror/lib/codemirror.js"},
    { out: "vendor/codemirror_mode_xml", in:
        "node_modules/codemirror/mode/xml/xml.js"},
    { out: "vendor/css/codemirror", in:
        "node_modules/codemirror/lib/codemirror.css"},
]
