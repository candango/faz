/**
 * Copyright 2018-2022 Flavio Gonçalves Garcia
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

window.codemirrorit = function(id) {
    let referenceNode = document.getElementById(id)
    let newTextareaNode = document.createElement("textarea")
    newTextareaNode.id = id.concat("Code")
    newTextareaNode.value = referenceNode.innerHTML
    referenceNode.parentNode.insertBefore(newTextareaNode,
        referenceNode.nextSibling)
    CodeMirror.fromTextArea(
        newTextareaNode, {
            mode:  "xml",
            fixedGutters: false,
            lineNumbers: true,
            readOnly: true,
            viewportMargin: Infinity
        })
}
