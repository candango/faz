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

import { FazElementItem } from "../item";
import FazNavElement from "./nav";
import { Accessor, createSignal, Setter } from "solid-js";
import { render } from "solid-js/web";
import FazNavItemContentElement from "./nav-item-content";


export default class FazNavItemElement extends FazElementItem {

    public linkClasses: Accessor<string>;
    public setLinkClasses: Setter<string>;

    constructor() {
        super();
        [this.linkClasses, this.setLinkClasses] = createSignal("");
    }

    get contentChild() {
        if (this.content() === undefined) {
            return this.children[0].firstChild;
        }
        return this.children[0].children[1];
    }

    get isRoot() {
        if (this.parent() !== undefined) {
            if (this.parent() instanceof FazNavElement) {
                return true;
            }
        }
        return false;
    }

    get isDropdown() {
        return !this.loading() && this.items().length > 0;
    }

    get classNames() {
        const classes = [];
        if(this.isRoot) {
            classes.push("nav-item");
            if (this.isDropdown) {
                classes.push("dropdown");
            }
        } else {
            if (this.isDropdown) {
                classes.push("dropdown-submenu");
            }
        }
        if (this.active()) {
            classes.push("active");
        }
        if (this.disabled()) {
            classes.push("disabled");
        }
        this.setClasses(classes.join(" "));
        return this.classes();
    }

    get linkClassNames() {
        let classes = ["nav-link"];

        if (!this.isRoot) {
            classes.pop();
            classes.push("dropdown-item");
        }

        if (this.active() && !this.disabled()) {
            // this.root.current = this
            classes.push("active");
        }
        if (this.disabled()) {
            classes.push("disabled");
        }
        if (this.isDropdown) {
            classes.push("dropdown-toggle");
        }
        this.setLinkClasses(classes.join(" "));
        return this.linkClasses();
    }

    get dropdownClassNames() {
        let classes = ["dropdown-menu"];
        if (this.active() && this.isDropdown && !this.disabled()) {
            classes.push("show");
        }
        return classes.join(" ");
    }

    get roleType() {
        if (this.isDropdown && this.isRoot) {
            return "button";
        }
        if (!this.isDropdown && !this.isRoot) {
            return "tab";
        }
    }

    get navItemItems() {
        return this.items().filter(item => {
            return item instanceof FazNavItemElement;
        });
    }

    get ariaExpandedValue() {
        if (this.isDropdown) {
            return this.active();
        }
    }

    get dataBsToggleValue() {
        if (this.isDropdown && this.isRoot) {
            return "dropdown";
        }
    }

    addChild<T extends Node>(node: T): T {
        if (this.isDropdown) {
            // console.log(this.isDropdown, this)
            if (!this.isRoot) {                
                // TODO: Figure out why this is happening and fix
                if (node.nodeName === "LI") {
                    const nodeId = ((node as Node) as HTMLElement).id;
                    const firstChildId = ((this.firstChild as Node) as
                        HTMLElement).id;
                    if (nodeId === firstChildId) {
                        return node;
                    }
                }
            }
            if (this.content() !== undefined || this.content() !== null) {
                if (node instanceof FazNavItemContentElement) {
                    this.children[0].firstChild?.appendChild(node);
                    return node;
                }
                if (node instanceof FazNavItemElement) {
                    this.children[0].children[1].appendChild(node);
                    return node;
                }
            }
        }
        if (node instanceof FazNavItemElement) {
            this.children[0].children[1].appendChild(node);
            return node;
        }
        this.contentChild?.appendChild(node);
        return node; 
    }

    deactivate() {
        this.setActive(false);
        if (this.isDropdown) {
            this.activeItems.forEach(item => {
                if (item instanceof FazNavItemElement) {
                    (item as FazNavItemElement).deactivate();
                }
            });
        }
    }

    itemClick(_: Event) {
        this.parent()?.activeItems.forEach(item => {
            if (item instanceof FazNavItemElement) {
                (item as FazNavItemElement).deactivate();
            }
        });
        this.setActive(true);
    }

    show() {
            // <li className={this.classNames} id={this.containerId}>
            //     <a id={this.state.id} className={this.linkClassNames}
            //        role={this.role} target={this.state.target} href={this.link}
            //        onClick={(event) => {this.handleClick(event)}}
            //        aria-expanded={this.ariaExpanded}
            //        data-bs-toggle={this.dataBsToggle}
            //     >{this.content}</a>
            //     {this.isDropdown ? this.renderItems() : ""}
            // </li>
        const navItem = <li id={`nav_item_container${this.id}`} 
            class={this.classNames}>
            <a id={`nav_item_link${this.id}`} class={this.linkClassNames} 
            role={this.roleType} href={this.link}
            onClick={(e) => this.itemClick(e)}>{this.content()} 
            </a><ul class={this.dropdownClassNames}></ul></li>;
            
        render(() => navItem, this);
        this.classList.add("nav-item");
    }
}

customElements.define("faz-nav-item", FazNavItemElement);
