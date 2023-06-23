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

import { render } from "solid-js/web";
import { FazElementItem } from "../item";
 

export default class FazNavItemElement extends FazElementItem {

    constructor() {
        super();
    }

    get contentChild() {
        if (this.content === undefined) {
            return this.firstChild;
        }
        return this.children[1];
    }

    get isRoot() {
        if (this.parent !== undefined) {
            if (this.parent.nodeName.toUpperCase() === "FAZ-NAV") {
                return true;
            }
        }
        return false;
    }

    get isDropDown() {
        return this.items.length > 0
    }

    get classNames() {
        const classes = [ "nav-link" ];
        if (this.active()) {
            classes.push("active");
        }
        if (this.disabled) {
            classes.push("disabled");
        }
        if (this.isRoot) {
            console.log("is root", this);
        }
        this.setClasses(classes.join(" "));
        // if (props.element.isDropDown){
        //     classes.push("") 
        // }
        return this.classes();
    }


    itemClick() {
        this.parent?.items().forEach(item => {
            if (item.isEqualNode(this)) {
                (item as FazNavItemElement).setActive(true);
                return;
            }
            (item as FazNavItemElement).setActive(false);
        });
    }

    show() {
        const navItem = <><a class={this.classNames} 
            onClick={() => this.itemClick()} href={this.link} >{this.content}
            </a><ul class="dropdown-menu"></ul></>;
        render(() => navItem, this); 
    }
}

customElements.define("faz-nav-item", FazNavItemElement);
