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
import { EditorView } from "@codemirror/view";
import {
    syntaxHighlighting, defaultHighlightStyle
} from "@codemirror/language";
import { html } from "@codemirror/lang-html";

declare global {
    interface Window {
        codemirrorit: (id:string) => void;
    }
}

// TODO: Apply this theme https://palettes.shecodes.io/palettes/1313
window.codemirrorit = function (id:string) {
    let referenceNode = document.getElementById(id) || document.body;

    let theme = EditorView.theme({
        "&": {
            color: "#ececec",
            backgroundColor: "#142d4c"
        },
        ".cm-content": {
            caretColor: "#ececec"
        },
        "&.cm-focused .cm-cursor": {
            borderLeftColor: "#ececec"
        },
        "&.cm-focused .cm-selectionBackground, ::selection": {
            backgroundColor: "#074"
        },
        ".cm-gutters": {
            backgroundColor: "#045",
            color: "#ddd",
            border: "none"
        }
    }, { dark: true });

    new EditorView({
        doc: referenceNode.innerHTML,
        extensions: [
             html(),theme, syntaxHighlighting(defaultHighlightStyle)
        ],
        parent: referenceNode,
    });
}
