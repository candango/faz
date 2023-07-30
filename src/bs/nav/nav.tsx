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

import { FazElementItem } from "../../item";
import FazBsNavItemElement from "./nav-item";
import FazBsNavItemContentElement from "./nav-item-content";
import FazBsNavTabElement from "./nav-tab";
import { Accessor, createSignal, Setter } from "solid-js";
import { render } from "solid-js/web";

 
export default class FazBsNavElement extends FazElementItem {
    
    public current: FazBsNavItemElement | undefined;

    public fill: Accessor<boolean>;
    public setFill: Setter<boolean>;

    public justify: Accessor<string>;
    public setJustify: Setter<string>;
 
    public pills: Accessor<boolean>;
    public setPills: Setter<boolean>;
 
    public vertical: Accessor<boolean>;
    public setVertical: Setter<boolean>;

    public tabClasses: Accessor<string>;
    public setTabClasses: Setter<string>;

    private timeout: NodeJS.Timeout | undefined;

    constructor() {
        super();
        [this.fill, this.setFill] = createSignal<boolean>(false);
        [this.pills, this.setPills] = createSignal<boolean>(false);
        [this.vertical, this.setVertical] = createSignal<boolean>(false);
        [this.justify, this.setJustify] = createSignal<string>("");
        [this.tabClasses, this.setTabClasses] = createSignal<string>("");
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

    get activeNavItem() {
        let active: FazBsNavItemElement | null = null;
        this.navItemItemsActive.forEach(item => {
            active = item as FazBsNavItemElement;
            return active;
        });
        return active;
    }

    get contentChild() {
        return this.children[0].firstChild;
    }

    get classNames() {
        const classes = [ "nav" ];
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
        if (this.hasTabs) {
            classes.push("nav-tabs");
        }
        if (this.vertical()) {
            classes.push("flex-column");
        }  
        this.setClasses(classes.join(" "));
        return this.classes();
    }

    get hasTabs() {
        this.loading();
        return this.tabItems.length > 0;
    }

    get navItemItems() {
        return this.items().filter(item => {
            return item instanceof FazBsNavItemElement;
        });
    }

    get navItemItemsActive() {
        const items = this.items();
        return items.filter(item => {
            return item instanceof FazBsNavItemElement && item.active();
        });
    }

    get onEdge() {
        this.loading();
        if(this.current) {
            return !this.current?.isDropdown;
        }
        return false;
    }

    get tabClassNames() {
        const classes = [ "tab-content" ];
        if (!this.hasTabs) {
            classes.push("invisible");
        }
        this.setTabClasses(classes.join(" "));
        return this.tabClasses();
    }

    get tabItems() {
        return this.items().filter(item => {
            return item instanceof FazBsNavTabElement;
        });
    }

    addChild<T extends Node>(node: T): T {
        if (this.hasTabs && this.vertical()) {
            if (node instanceof FazBsNavTabElement) {
                this.children[0].children[1].firstChild?.appendChild(node);
                return node;
            }
            this.children[0].children[0].firstChild?.appendChild(node);
            return node;
        }
        if (node instanceof FazBsNavTabElement) {
            this.children[0].children[1].appendChild(node);
            return node;
        }
        this.contentChild?.appendChild(node);
        return node; 
    }

    beOverMe(_: Event) {
        clearTimeout(this.timeout);
    }

    leaveMe(_: Event) {
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
            this.activeItems.forEach(item => {
                const navItem = item as FazBsNavItemElement;
                if (navItem.isDropdown && !this.onEdge) {
                    navItem.deactivate();
                }
            })
        }, 250);
    }

    renderNav() {
        return <ul id={`nav${this.id}`} class={this.classNames} 
            role="tablist"></ul>;
    }

    renderTabs() {
        return <div class={this.tabClassNames}></div>;
    }

    show() {
        if (this.hasTabs && this.vertical()) {
            render(() => <div onMouseOver={(e) => this.beOverMe(e)}
                onMouseLeave={(e) => this.leaveMe(e)}
                class="faz-nav-container row" id={`nav-container${this.id}`}>
                    <div class="col-3">
                        {this.renderNav()}
                    </div>
                    <div class="col-9">
                        <div class="tab-content">
                            {this.renderTabs()}
                        </div>
                    </div>
                </div>, this);
            return;
        }
        render(() => <div onMouseOver={(e) => this.beOverMe(e)}
            onMouseLeave={(e) => this.leaveMe(e)}
            class="faz-nav-container" id={`nav-container${this.id}`}>
            {this.renderNav()}
            {this.hasTabs ? this.renderTabs() : ""}
        </div>, this);
    }

    afterShow(children:Node[]) {
        super.afterShow(children);
        if (this.loading()) {
            if (this.hasTabs) {
                if (this.activeNavItem === null) {
                    (this.navItemItems[0] as FazBsNavItemElement).setActive(
                        true);
                }
                (this.navItemItemsActive[0] as FazBsNavItemElement).activate();
            }
        }
    }
}

customElements.define("faz-bs-nav", FazBsNavElement);
customElements.define("faz-bs-nav-item", FazBsNavItemElement);
customElements.define("faz-bs-nav-tab", FazBsNavTabElement);
customElements.define("faz-bs-nav-item-content", FazBsNavItemContentElement)
