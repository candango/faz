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
import FazNavElement from "./nav";
import { Accessor, createSignal, Setter } from "solid-js";
import { render } from "solid-js/web";


export default class FazNavItemElement extends FazElementItem {

    public linkClasses: Accessor<string>;
    public setLinkClasses: Setter<string>;

    public previousItem: FazNavItemElement | undefined;

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

    get link() {
        if (!this.isDropdown) {
            if (this.isRoot && this.root?.hasTabs) {
                return `#${super.link}`
            }
        }
        return super.link;
    }

    get linkClassNames() {
        let classes = ["nav-link"];

        if (!this.isRoot) {
            classes.pop();
            classes.push("dropdown-item");
        }
        if (this.active() && !this.disabled()) {
            classes.push("active");
            if (this.root) {
                this.root.current = this;
            }
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

    get root(): FazNavElement | undefined {
        if (this.isRoot) {
            return this.parent() as FazNavElement;
        }
        if (!this.parent()) {
            return undefined;
        }
        return (this.parent() as FazNavItemElement).root;
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
        if (node instanceof FazNavItemElement) {
            this.children[0].children[1].appendChild(node);
            return node;
        }
        this.contentChild?.appendChild(node);
        return node; 
    }

    deactivate() {
        this.previousItem = undefined;
        this.setActive(false);
        if (this.isDropdown) {
            this.activeItems.forEach(activeItem => {
                if (activeItem instanceof FazNavItemElement) {
                    const item = activeItem as FazNavItemElement;
                    item.deactivate();
                }
            });
        }
    }

    activate() {
        this.parent()?.activeItems.forEach(item => {
            if (item instanceof FazNavItemElement) {
                this.previousItem = item;
                (item as FazNavItemElement).deactivate();
            }
        });
        this.setActive(true);
        // if (this.root.hasTabs) {
        //     this.root.renderedTabItems.forEach((item) => {
        //         if(item.state.id === this.link.replace("#", "")){
        //             item.updateState({active: true})
        //             return
        //         }
        //         item.deactivate()
        //     })
        // }
    }

    itemClick(event: Event) {
        if (this.linkIsVoid) {
            event.preventDefault();
        }
        this.activate();
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
            onClick={(e) => this.itemClick(e)}
            aria-expaded={this.ariaExpandedValue}
            data-bs-toggle={this.dataBsToggleValue}>{this.content()} 
            </a><ul class={this.dropdownClassNames}></ul></li>;
            
        render(() => navItem, this);
        this.classList.add("nav-item");
    }
}

customElements.define("faz-nav-item", FazNavItemElement);
