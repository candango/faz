/**
 * Copyright 2018-2022 Flavio Gonçalves Garcia
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


import { default as ID } from "./id";
import {
    DeepObservable, ObservableArray, ObservableObject, StacheElement, type
} from "can";
import cloneDeep from "lodash/cloneDeep"
import toPairs from "lodash/toPairs"
import parse from "html-react-parser"
import merge from "lodash/merge"
import React from 'react'


export class FazReactItem extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: ID.random,
            children: [],
            debug: false,
            disabled: false,
            element: undefined,
            type: "primary",
            content: undefined,
            link: undefined,
            parent: undefined
        }
        for(let key in props) {
            switch (key) {
                case "id":
                    this.state.id = props[key].replace(
                        "__child-prefix__", this.prefix)
                    break
                case "debug":
                    this.state.debug = props[key]
                    break
                case "disabled":
                    this.state.disabled = props[key]
                    break
                case "element":
                    this.state.element = props[key]
                    this.state.element.reactItem = this
                    break
                case "link":
                    this.state.link = props[key]
                    break
                case "parent":
                    this.state.parent = props[key]
                    break
            }
        }
        this.defineStates(props)
        if (this.state.element) {
            this.state.element.attributesToStates()
        }
    }

    get content() {
        return this.state.content ? parse(this.state.content) : ""
    }

    get disabled() {
        return this.state.disabled
    }

    get link() {
        // From: https://stackoverflow.com/a/66717705/2887989
        let voidHref = "#!"
        let validHef = this.state.link === undefined ?
            voidHref : this.state.link
        if (this.disabled) {
            return voidHref
        }
        return validHef
    }

    get prefix() {
        return "faz-react-item"
    }

    defineStates(props) {}

    updateState(someState) {
        this.setState(prevState => {
            return merge(cloneDeep(prevState), someState)
        })
    }

    componentDidMount() {
        let renderedElement = document.querySelector("#" + this.state.id)
        if (this.state.element && renderedElement) {
            this.state.element.originalNodes.forEach(
                node => renderedElement.append(node)
            )
        }
        this.afterMount()
    }

    afterMount() {}
}


export class FazElementItem extends HTMLElement {

    constructor() {
        super();
        if (!this.id) {
            this.id = ID.random
        }
        this.parent = undefined
        this.isLoading = true
        this.originalNodes = []
        this.items = []
        this.reactItem = undefined
        this.childPrefix = "__child-prefix__"
        console.log(this)
    }

    attributesToStates() {
        for(let attribute of this.attributes) {
            switch (attribute.name) {
                case "debug":
                    this.reactItem.state.debug =
                        attribute.value.toLowerCase() === "true"
                    break;
                case "disabled":
                    this.reactItem.state.disabled =
                        attribute.value.toLowerCase() === "true"
                    break;
                case "link":
                    this.reactItem.state.link = attribute.value
                    break;
            }
        }
    }

    get childId() {
        return this.childPrefix.concat(this.id)
    }

    connectedCallback() {
        this.childNodes.forEach(node => {
            this.findItems(node)
            this.originalNodes.push(node)
        })
        document.addEventListener("DOMContentLoaded", event => {
            this.contentLoaded(event);
        });
        this.beforeLoad();
        this.isLoading = false;
        this.afterLoad();
        this.show();
    }

    findItems(node) {
        // TODO: I a depth limit here could be a good thing to avoid a deep
        // search inside a long DOM structure
        let found = false
        if (node.tagName && node.tagName.toUpperCase().startsWith("FAZ-")) {
            this.items.push(node)
            node.parent = this
            found = true
        }
        if (!found) {
            node.childNodes.forEach( childNode => {
                this.findItems(childNode)
            })
        }
    }

    afterLoad() {}

    beforeLoad() {}

    show() {}

    contentLoaded(event) {}

}


class FazItem extends ObservableObject {
    static get props() {
        return {
            id: {
                type: type.convert(String),
                get default() {
                    return ID.random;
                }
            },
            active: {type: type.convert(Boolean), default: false},
            // Content should be written like that, so we stop main-navbar stop
            // to alter the first navbar from the example. It seems like somehow
            // they were sharing or invading contents.
            content: {
                type: type.convert(String),
                get default() {
                    return "";
                }
            },
            element: type.convert(ObservableObject),
            href: String,
            parent: "*",
            type: String,
            get isLink() {
                return this.href !== undefined;
            }
        };
    }

    static get propertyDefaults() {
        return DeepObservable;
    }

    static get seal() {
        return true;
    }

}

export class FazItemList extends ObservableArray {
    static get props() {
        return {
            get enabled() {
                return this.filter({disabled: false});
            },

            get active() {
                return this.filter({active: true});
            }
        };
    }

    static get items() {
        return type.convert(FazItem);
    }
}

export class FazStacheItem extends StacheElement {
    static get props() {
        return {
            fazid: {
                type: type.convert(String),
                get default() {
                    return ID.random;
                }
            },
            active: {type: type.convert(Boolean), default: false},
            // Content should be written like that so we stop main-navbar stop
            // to alter the first navbar from the example. It seems like somehow
            // they were sharing or invading contents.
            content: {
                type: type.convert(String),
                get default() {
                    return "";
                }
            },
            element: type.convert(ObservableObject),
            href: String,
            parent: "*",
            type: String,
            isLoading: {type: Boolean, default: true},
            get isLink() {
                return this.href !== undefined;
            }
        };
    }

    connectedCallback() {
        let content = this.innerHTML;
        this.content = content;
        document.addEventListener("DOMContentLoaded", event => {
            this.contentLoaded();
        });
        this.beforeConnectedCallback();
        super.connectedCallback();
        this.afterConnectedCallback();
        this.isLoading = false;
        this.show();
    }

    afterConnectedCallback() {}

    beforeConnectedCallback() {}

    show() {}

    contentLoaded() {}

    elementClasses(element) {
        return element.className.split(" ");
    }

    elementAddClass(element, className) {
        this.elementRemoveClass(element, className);
        let classes = this.elementClasses(element);
        classes.push(className);
        element.className = classes.join(" ");
    }

    elementRemoveClass(element, className) {
        element.className = this.elementClasses(element).filter(
            item => {return item != className}
        ).join(" ");
    }

    static get propertyDefaults() {
        return DeepObservable;
    }

    static get seal() {
        return true;
    }

}

export class FazStacheItemList extends ObservableArray {
    static get props() {
        return {
            get enabled() {
                return this.filter({disabled: false});
            },

            get active() {
                return this.filter({active: true});
            }
        };
    }

    static get items() {
        return type.convert(FazStacheItem);
    }
}

export default FazItem;
