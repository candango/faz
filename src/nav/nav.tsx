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

import { render } from "solid-js/web"
import { FazElementItem } from "../item"

 
export default class FazNavElement extends FazElementItem {
    
    public fill: boolean = false;
    public justify: string = "left";
    public pills: boolean = false;
    public vertical: boolean = false;

    constructor() {
        super()
        for (let attribute of this.attributes) {
            switch (attribute.name) {
                case "fill":
                    this.fill = attribute.value.toLowerCase() === "true";
                case "justify":
                    this.justify = attribute.value
                    break
                case "pills":
                    this.pills = attribute.value.toLowerCase() === "true";
                case "vertical":
                    this.vertical = attribute.value.toLowerCase() === "true";
            }
        }
    }

    get classNames() {
        const classes = [ "nav" ]
            if (this.active()) {
                classes.push("active")
            }
        if (this.disabled) {
            classes.push("disabled")
        }
        if (this.pills) {
            classes.push("nav-pills")
        }

        if (this.fill) {
            classes.push("nav-fill")
        }

        if (this.justify === "center") {
            classes.push("justify-content-center")
        }

        if (this.justify === "right") {
            classes.push("justify-content-end")
        }

        // if (this.hasTabs) {
        //     classes.push("nav-tabs")
        // }

        if (this.vertical) {
            classes.push("flex-column")
        }
        return classes.join(" ")
    }

    show() {
        render(() => <nav class={this.classNames} ></nav>, this) 
        this.classList.add("faz-nav-rendered")
    }
}

customElements.define("faz-nav", FazNavElement)
