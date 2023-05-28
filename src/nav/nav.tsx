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


function getClasses(props: any){
    const classes = [ "nav" ]
    if (props.active) {
        classes.push("active")
    }
    if (props.disabled) {
        classes.push("disabled")
    }
    if (props.pills) {
        classes.push("nav-pills")
    }

    if (props.fill) {
        classes.push("nav-fill")
    }

    if (props.justify === "center") {
        classes.push("justify-content-center")
    }

    if (props.justify === "right") {
        classes.push("justify-content-end")
    }

    // if (this.hasTabs) {
    //     classes.push("nav-tabs")
    // }

    if (props.vertical) {
        classes.push("flex-column")
    }
    return classes
}

const FazSolidNav: Component = (props: any) => {
    const classList = getClasses(props).join(" ")
    return <nav class={classList} ></nav>
}
 
export default class FazNavElement extends FazElementItem {
    constructor() {
        super()
    }

    show() {
        const props = this.attributesToProps()
        console.log(props)
        render(() => <FazSolidNav {... props}/>, this) 
        this.classList.add("faz-nav-rendered")
    }
}

customElements.define("faz-nav", FazNavElement)
