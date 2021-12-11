/**
 * Copyright 2018-2021 Flavio Garcia
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

import { assign, ObservableArray, type } from "can";
import {FazStacheItem, FazStacheItemList} from "../item";
import itemTemplate from "./stache/nav-item.stache";
import {default as FazNavItemTitle} from "./nav-item-title";

/**
 *
 *
 * TODO: Check https://www.codeply.com/go/ji5ijk6yJ4 for submenu on hover
 * @constructor
 * @param {Object} event. An object representing a nav item.
 * @param {string} event.value
 */
export class FazNavItem extends FazStacheItem {

    static view = ``;

    static get props() {
        return $.extend(super.props, {
            items: {
                type: FazStacheItemList,
                get default() {
                    return new FazStacheItemList([]);
                }
            },
            faztitle: {
                type: FazNavItemTitle
            },
            disabled: {type: type.convert(Boolean), default: false},
            root: "*",
            isRoot: {type: type.convert(Boolean), default: false},
            target: {type: type.convert(String), default: ""},
            value: String
        });
    }

    get dropdown() {
        return this.items.length > 0;
    }

    get html() {
        return itemTemplate(this);
    }

    /**
     * Returns the nav item class.
     *
     * @param {FazNavItem} item
     * @returns {string}
     */
    get class() {
        let classes = ["nav-link"];
        if(this.active) {
            classes.push("active");
        }
        if(this.disabled) {
            classes.push("disabled")
        }
        return classes.join(" ");
    }

    /**
     * Returns the nav item href. If item is disabled a javascript void
     * function will be placed to avoid any action.
     *
     * @param {FazNavItem} item
     * @returns {string}
     */
    getHref() {
        let voidHref = "javascript:void(0)";
        let validHef = this.href === undefined ? voidHref : this.href;
        if (this.disabled) {
            return voidHref;
        }
        if (this.parent !== undefined) {
            if (this.parent.hasTabs) {
                if (!validHef.startsWith("#") && this.href) {
                    return "#" + validHef;
                }
            }
        }
        return validHef;
    }

    beforeConnectedCallback() {
        this.process();
    }

    activate(element, event) {
        if(element !== undefined) {
            // Responsive Dropdown Submenu fix
            // Based on https://codepen.io/surjithctly/pen/PJqKzQ
            if(this.dropdown) {
                if (this.isRoot) {
                    $('.dropdown-submenu .show').removeClass("show");
                } else {
                    if (!$(element).next().hasClass("show")) {
                        $(element).parents(".dropdown-menu").first().find(
                            ".show").removeClass("show");
                    }
                    let subMenu = $(element).next(".dropdown-menu");
                    subMenu.toggleClass('show');
                    event.preventDefault();
                    event.stopPropagation();
                }
            }
        }

        if (!this.disabled) {
            if (this.parent != null) {
                this.parent.items.active.forEach(function(child) {
                    child.active = false;
                });
                if (this.isRoot) {
                    if (this.parent.hasTabs) {
                        this.parent.tabs.forEach(
                            tab => {
                                tab.active = false;
                                if(tab.fazid == this.ariaControls) {
                                    tab.active = true;
                                }
                            }
                        );
                    }
                }
            }
            this.active = true;
        }
    }

    process() {
        for(let attribute of this.attributes) {
            switch (attribute.name.toLowerCase()) {
                case "disabled":
                    this.disabled = attribute.value;
                    break;
                case "fazid":
                case "id":
                    this.fazid = attribute.value;
                    break;
                case "active":
                case "current":
                    this.active = true;
                    break;
                case "href":
                    this.href = attribute.value;
                    break;
                case "target":
                    this.target = attribute.value;
                    break;
            }
        }
        if (this.children.length > 0) {
            this.processChildren();
        }
        if(this.active) {
            document.addEventListener("DOMContentLoaded", event => {
                this.activate(this, event);
            });
        }
    }

    processChildren(sub=false) {
        let childrenToDelete = new Array();
        for (let i = 0; i < this.children.length; i++) {
            let child = this.children[i];
            if(child.tagName.toLowerCase().includes("nav-item")) {
                if(child.tagName.toLowerCase().includes(
                    "nav-item-title")) {
                    this.faztitle = child;
                } else {
                    this.items.push(this.processChild(child));
                }
                childrenToDelete.push(child);
            }
        }
        childrenToDelete.forEach((child) => {
            this.removeChild(child);
        });
        if(this.faztitle!==undefined) {
            this.content = this.faztitle.content;

        }
    }

    processChild(child) {
        let element = new FazNavItem();
        for(let attribute of child.attributes) {
            let newAttribute = attribute.cloneNode()
            element.attributes.setNamedItem(newAttribute);
        }
        element.parent = this;
        element.innerHTML = child.innerHTML;
        element.content = element.innerHTML;
        element.process();
        element.processChildren(true);
        return element;
    }

    setRoot(root) {
        this.root = root;
        this.items.forEach((child) => {
            child.setRoot(root);
        });
    }

    get ariaControls() {
        let voidAriaControls = "";
        let validAriaControls = this.href === undefined ? voidAriaControls :
            this.href;
        if (this.disabled) {
            return voidAriaControls;
        }
        if (this.parent !== undefined) {
            if (this.parent.hasTabs) {
                if (validAriaControls.startsWith("#") && this.href) {
                    return validAriaControls.substring(1);
                }
            }
        }
        return validAriaControls;
    }

    get ariaSelected() {
        return this.active ? "true" : "false";
    }

    get navId() {
        return "fazNavItem" + this.fazid;
    }

    setParent(parent) {
        this.parent = parent;
    }

    processData(parent, data, isRoot=false) {
        this.parent = parent;

        if (isRoot) {
            this.root = parent;
            this.isRoot = true;
        } else {
            this.root = parent.root;
        }

        let children = undefined;

        if(data.items !== undefined) {
            children = data.items;
            delete data.items;
        }

        assign(this, data);

        if(children !== undefined) {
            children.forEach(function (child) {
                let navItem = new FazNavItem();
                navItem.processData(this, child);
                this.items.push(navItem);
            }.bind(this));
        }

        this.content = data.value;
    }

}

export class FazNavItemList extends ObservableArray {
    static get props() {
        return {
            get enabled() {
                return this.filter({disabled: false});
            },

            get active() {
                let actives = this.filter({active: true});
                if(actives.length===0) {
                    actives.push(this[0]);
                    actives[0].active = true;
                }
                return actives;
            }
        };
    }

    static items = type.convert(FazNavItem);
}

customElements.define("faz-nav-item", FazNavItem);
