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

import { Component, createSignal, createEffect, JSX, children } from "solid-js"
import { render } from "solid-js/web"
import { FazElementItem } from "../item"

const SolidAlert: Component = (props: any) => {
    const classList = ["alert", "alert-primary", "buga"].join(" ")
    const role = "alert"
    return <div class={classList} role={role}></div>
}

export default class FazBsAlert extends FazElementItem {
    constructor() {
        super()
    }

    show() {
        const props = this.attributesToProps()
        render(() => <SolidAlert {... props}/>, this) 
        this.classList.add("faz-bs-alert-rendered")
    }
}

customElements.define("faz-bs-alert", FazBsAlert)
