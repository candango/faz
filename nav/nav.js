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

import {
    ajax, assign, DeepObservable, ObservableObject, type
} from "can";

import { FazStacheItem, FazStacheItemList} from "../item";
import { FazNavItem } from "./nav-item";
import { FazNavTabContent, FazNavTabContentList } from "./nav-tab-content";

import navTemplate from "./stache/nav.stache";

export default class FazNav extends FazStacheItem {

    static view = navTemplate;

    static get props() {
        return $.extend(super.props, {
            activeItem: String,
            data: {
                type: ObservableObject,
                get default(){
                    return new ObservableObject({
                        "items": undefined
                    });
                }
            },
            items: {
                type: FazStacheItemList,
                get default() {
                    return new FazStacheItemList([]);
                }
            },
            tabs: {type: FazNavTabContentList, get default() {
                return new FazNavTabContentList([]);
            }},
            navOuterClass: {type: type.convert(String), default: "row"},
            tabsClass: {type: type.convert(String), default: ""},
            fill: {type: type.convert(Boolean), default: false},
            justify: {type: type.convert(String), default: "left"},
            page: String,
            pills: {type: type.convert(Boolean), default: false},
            source: String,
            vertical: {type: type.convert(Boolean), default: false}
        });
    };

    get hasTabs() {
        return !!this.tabs.length;
    }

    get componentClass() {
        let classes = ["nav"];

        if (this.fill) {
            classes.push("nav-fill");
        }
        if (this.justify === "center") {
            classes.push("justify-content-center");
        } else if (this.justify === "right") {
            classes.push("justify-content-end");
        }

        if (this.pills) {
            classes.push("nav-pills");
        }

        if (this.hasTabs) {
            classes.push("nav-tabs");
        }

        if (this.vertical) {
            classes.push("flex-column");
        }

        return classes.join(" ");
    }

    get role() {
        if (this.hasTabs) {
            return "tablist";
        }
        return "";
    }

    get orientation() {
        if (this.vertical){
            return "vertical";
        }
        return "";
    }

    static get propertyDefaults() {
        return DeepObservable;
    }

    processData() {
        if(this.data !== undefined) {
            if (this.data.items !== undefined) {
                this.data.items.forEach(item => {
                    switch (item.type.toLowerCase()) {
                        case "faz-nav-item":
                            this.items.push(this.processItemData(item));
                            break;
                    }
                });
            }
        }
    }

    processItemData(data) {
        let item = new FazNavItem();
        item.processData(this, data, true);
        return item;
    }

    show() {
        $(this).addClass("faz-nav-rendered");
    }

    afterConnectedCallback() {
        if (this.hasTabs) {
            let active = this.items.active[0];
            if(active===undefined) {
                active = this.items[0];
            }
            active.activate();
        }
    }

    beforeConnectedCallback() {
        let attributes = {};
        for(let attribute of this.attributes) {
            switch (attribute.name) {
                case "active":
                    this.active = attribute.value;
                    break;
                case "id":
                case "fazid":
                    this.fazid = attribute.value;
                    break;
                case "fill":
                    this.fill = attribute.value;
                    break;
                case "justify":
                    this.justify = attribute.value;
                    break;
                case "pills":
                    this.pills = attribute.value;
                    break;
                case "vertical":
                    this.vertical = true;
                    break;
                case "source":
                    this.source = attribute.value;
                    break;
                default:
                    console.warn(attribute.name);
                    attributes[attribute.name] = attribute.value;
                    break;
            }
        }

        assign(this, attributes);
        for (let i = 0; i < this.children.length; i++) {
            let child = this.children[i];
            if(child.tagName.toLowerCase().includes("nav-item")) {
                this.items.push(child);
                if (child.isRoot !== undefined) {
                    child.isRoot = true;
                    child.setRoot(this);
                }

            }
            if(child.tagName.toLowerCase().includes("nav-tab-content")) {
                this.tabs.push(child);
            }
            if (child.parent !== undefined) {
                child.parent = this;
            }
        }
    }

    connected() {
        if(this.source) {
            this.isLoading = true;
            ajax({
                url: this.source,
            }).then(function(response) {
                this.data = new ObservableObject(response);
                this.processData()
                this.isLoading = false;
            }.bind(this));
        }
    }

    getComponentId () {
        return "";
    }

    getSafeString(item) {
        return stache.safeString(item[0]);
    }

    static get seal() {
        return true;
    }
}

customElements.define("faz-nav", FazNav);
