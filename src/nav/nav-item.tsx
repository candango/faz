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

import { Component, createSignal, createEffect } from "solid-js"
import { render } from "solid-js/web"
import { FazElementItem } from "../item"


function getClasses(props: any){
    const classes = [ "nav-link" ]
    if (props.active) {
        classes.push("active")
    }
    if (props.disabled) {
        classes.push("disabled")
    }
    return classes
}

function getLink(props: any) {
    // From: https://stackoverflow.com/a/66717705/2887989
    let voidHref = "#!"
        if (props.disabled || props.link === undefined) {
            return voidHref
        }
    return props.link
}

function itemClick(element: FazNavItemElement) {
    element.parent?.items.forEach(item => {
        if (item.isEqualNode(element)) {
            (item as FazNavItemElement).setActive(true)
            return
        }
        (item as FazNavItemElement).setActive(false)
    })
}

const FazSolidNavItem: Component = (props: any) => {
    const [active, setActive] = createSignal(props.active)
    const [classList, setClassList] = createSignal(getClasses(props).join(" "))
    createEffect(() => {
        props.active = active()
        setClassList(getClasses(props).join(" "))
    })
    const link = getLink(props)
    const element = props.element as FazNavItemElement
    element.setActive = setActive
    return <a class={classList()} onClick={() => itemClick(element)} 
        href={link} ></a>
}
 
export default class FazNavItemElement extends FazElementItem {
    public setActive: any 
    constructor() {
        super()
    }

    show() {
        const props = this.attributesToProps()
        render(() => <FazSolidNavItem {... props}/>, this) 
        console.log(this)
    }
}

customElements.define("faz-nav-item", FazNavItemElement)
