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

import { assign, ObservableArray, type } from "can";
import { FazStacheItem } from "../item";
import tabContentTemplate from "./stache/nav-tab-content.stache";

/**
 *
 *
 * TODO: Check https://www.codeply.com/go/ji5ijk6yJ4 for submenu on hover
 * @constructor
 * @param {Object} event. An object representing a nav item.
 * @param {string} event.value
 */

export class FazNavTabContent extends FazStacheItem {

    static view = ``;

    static get props() {
        return $.extend(super.props, {
            fade: {type: type.convert(Boolean), default: false}
        });
    }

    processElement(parent, element) {
        this.parent = parent;

        let dataItem = {};
        for(let attribute of element.attributes) {
            dataItem[attribute.name] = attribute.value;
        }
        this.content = element.innerHTML;
        assign(this, dataItem);
    }

    get ariaLabelledby() {
        let itemId = ""
        this.parent.items.forEach(function (item) {
            if (this.fazid == item.ariaControls) {
                itemId = item.fazid;
                return;
            }
        }.bind(this));
        return itemId;
    }

    setParent(parent) {
        this.parent = parent;
    }

    beforeConnectedCallback() {
        for(let attribute of this.attributes) {
            switch (attribute.name.toLowerCase()) {
                case "fade":
                    this.fade = attribute.value;
                    break;
                case "disabled":
                    this.disabled = attribute.value;
                    break;
                case "fazid":
                case "id":
                    this.fazid = attribute.value;
                    break;
            }
        }
    }

    get class() {
        let classes = ["tab-pane"];
        if (this.fade) {
            classes.push("fade");
            if (this.active) {
                classes.push("show");
            }
        }
        if (this.active) {
            classes.push("anchor")
            classes.push("active");
        }

        return classes.join(" ");
    }

    get html() {
        return tabContentTemplate(this);
    }
}

export class FazNavTabContentList extends ObservableArray {
    static get props() {
        return {
            get active() {
                return this.filter({active: true});
            }
        };
    }

    static items = type.convert(FazNavTabContent);
}

customElements.define("faz-nav-tab-content", FazNavTabContent);
