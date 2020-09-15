/**
 * Copyright 2018-2020 Flavio Garcia
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

import { default as FazItem} from "../item";
import { default as FazNavbarNavItem,
    FazNavbarNavItemList } from "./navbar-nav-item";
import navTemplate from "./stache/navbar-nav.stache";

/**
 *
 *
 * TODO: Check https://www.codeply.com/go/ji5ijk6yJ4 for submenu on hover
 * @constructor
 * @param {Object} event. An object representing a nav item.
 * @param {string} event.value
 */
export default class FazNavbarNav extends FazItem {
    static get props() {
        return $.extend(super.props, {
            items: {
                type: FazNavbarNavItemList,
                get default() {
                    return new FazNavbarNavItemList([]);
                }
            }
        });
    }

    get html() {
        return navTemplate(this);
    }

    processItem(child) {
        let navbarNavItem = new FazNavbarNavItem();
        navbarNavItem.process(this, child);
        this.items.push(navbarNavItem);
    }

    processItemData(data) {
        let navbarNavItem = new FazNavbarNavItem();
        navbarNavItem.processData(this, data);
        this.items.push(navbarNavItem);
    }

    process(parent, element) {
        this.parent = parent;
        for(let attribute of element.attributes) {
            switch (attribute.name.toLowerCase()) {
                case "id":
                    this.id = attribute.value;
                    break;
            }
        }
        for (let i = 0; i < element.children.length; i++) {
            let child = element.children[i];
            switch (child.tagName.toLowerCase()) {
                case "faz-navbar-nav-item":
                    this.processItem(child);
                    break;
            }
        }
        $(element).detach();
    }

    processData(parent, data) {
        this.parent = parent;
        if(data.id !== undefined) {
            this.id = data.id;
        }
        if (data.items !== undefined) {
            data.items.forEach(function(item) {
                this.processItemData(item);
            }.bind(this));
        }
    }
}
