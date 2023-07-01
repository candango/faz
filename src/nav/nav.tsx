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

import { FazElementItem } from "../item";
import { Accessor, createSignal, Setter } from "solid-js";
import { render } from "solid-js/web";
import FazNavItemElement from "./nav-item";

 
export default class FazNavElement extends FazElementItem {
    
    public current: FazNavItemElement | undefined;

    public fill: Accessor<boolean>;
    public setFill: Setter<boolean>;

    public justify: Accessor<string>;
    public setJustify: Setter<string>;
 
    public pills: Accessor<boolean>;
    public setPills: Setter<boolean>;
 
    public vertical: Accessor<boolean>;
    public setVertical: Setter<boolean>;

    private timeout: NodeJS.Timeout | undefined;

    constructor() {
        super();
        [this.fill, this.setFill] = createSignal<boolean>(false);
        [this.pills, this.setPills] = createSignal<boolean>(false);
        [this.vertical, this.setVertical] = createSignal<boolean>(false);
        [this.justify, this.setJustify] = createSignal<string>("");
        for (let attribute of this.attributes) {
            switch (attribute.name) {
                case "fill":
                    this.setFill(attribute.value.toLowerCase() === "true");
                    break;
                case "justify":
                    this.setJustify(attribute.value);
                    break;
                case "pills":
                    this.setPills(attribute.value.toLowerCase() === "true");
                    break;
                case "vertical":
                    this.setVertical(attribute.value.toLowerCase() === "true");
                    break;
            }
        }
    }

    get contentChild() {
        return this.children[0].firstChild;
    }

    get classNames() {
        const classes = [ "nav" ];
        if (this.active()) {
            classes.push("active");
        }
        if (this.disabled()) {
            classes.push("disabled");
        }
        if (this.pills()) {
            classes.push("nav-pills");
        }
        if (this.fill()) {
            classes.push("nav-fill");
        }
        if (this.justify() === "center") {
            classes.push("justify-content-center");
        }
        if (this.justify() === "right") {
            classes.push("justify-content-end");
        }
        // if (this.hasTabs) {
        //     classes.push("nav-tabs")
        // }
        if (this.vertical()) {
            classes.push("flex-column");
        }  
        this.setClasses(classes.join(" "));
        return this.classes();
    }

    get onEdge() {
        if(!this.isLoading && this.current) {
            return !this.current?.isDropdown;
        }
        return false;
    }

    beOverMe(_: Event) {
        clearTimeout(this.timeout);
    }

    leaveMe(_: Event) {
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
            this.activeItems.forEach(item => {
                const navItem = item as FazNavItemElement;
                if (navItem.isDropdown && !this.onEdge) {
                    navItem.deactivate();
                }
            })
        }, 250);
    }

    show() {
        render(() => <div onMouseOver={(e) => this.beOverMe(e)}
            onMouseLeave={(e) => this.leaveMe(e)}
            class="faz-nav-container" id={`nav-container${this.id}`}>
            <ul 
                id={`nav${this.id}`} class={this.classNames} 
                role="tablist" >
            </ul>
        </div>, this);
        this.classList.add("faz-nav-rendered");
    }
}

customElements.define("faz-nav", FazNavElement);
