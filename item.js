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
import axios from "axios";
import {
    DeepObservable, ObservableArray, ObservableObject, StacheElement, type
} from "can";
import cloneDeep from "lodash/cloneDeep"
import parse from "html-react-parser"
import includes from "lodash/includes"
import merge from "lodash/merge"
import PropTypes from "prop-types"
import React from 'react'



export class FazReactItem extends React.Component {

    constructor(props) {
        super(props);
        this.element = undefined
        this.parent = undefined
        this.data = undefined
        this.state = {
            id: ID.random,
            active: false,
            data: undefined,
            debug: false,
            disabled: false,
            items: {},
            type: "primary",
            content: undefined,
            link: undefined,
            source: undefined,
            sourceMethod: "get",
            target: undefined
        }
        this.processProps(props)
        this.defineStates(props)
        if (this.element) {
            if(this.element.attributesToStates) {
                this.element.attributesToStates()
            }
        }
    }

    processProps(props) {
        for(let key in props) {
            if(!props[key]) {
                continue
            }
            switch (key) {
                case "id":
                    this.state.id = props[key].replace(
                        "__child-prefix__", this.prefix)
                    break
                case "content":
                    this.state.content = props[key]
                    break
                case "items":
                    this.items = props[key]
                    break
                case "active":
                    this.state.active = props[key]
                    break
                case "debug":
                    this.state.debug = props[key]
                    break
                case "disabled":
                    this.state.disabled = props[key]
                    break
                case "element":
                    this.element = props[key]
                    this.element.reactItem = this
                    break
                case "link":
                    this.state.link = props[key]
                    break
                case "target":
                    this.state.target = props[key]
                    break
                case "parent":
                    this.parent = props[key]
                    break
            }
        }
    }

    get content() {
        if(!this.state.element) {
            return this.state.content ? this.state.content : ""
        }
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

    get linkIsVoid() {
        if (this.disabled) {
            return true
        }
        return this.state.link === undefined
    }

    get prefix() {
        return "faz-react-item"
    }

    defineStates(props) {}

    updateState(someState) {
        this.setState((prevState) => {
            return merge(prevState, someState)
        })
        return this.state
    }

    componentDidMount() {
        let renderedElement = document.querySelector("#" + this.state.id)
        if (this.element && renderedElement) {
            if(this.element.originalNodes.length) {
                this.updateState({content:undefined})
                this.element.originalNodes.forEach(
                    node => renderedElement.append(node)
                )
            }
        }
        this.afterMount()
        if (this.element) {
            this.element.isLoading = false
            if(this.element.afterShow) {
                this.element.afterShow()
            }
        }
    }

    afterMount() {
    }

    async requestData(conf, cached=true) {
        if(this.state.items.length==0) {
            cached = false
        }
        if (!cached) {
            return await this.handleResponse(conf)
        }
        return this.state.items
    }

    async handleResponse(conf={}) {
        conf = merge({
            method: this.state.sourceMethod,
            url: this.state.source,
        }, conf)
        try {
            const response = await axios(conf)
            this.updateState({items:response.data.items})
            return response
        } catch (error) {
            console.error(error)
            return error
        }
    }
}

FazReactItem.propTypes = {
    active: PropTypes.bool
}


export class FazElementItem extends HTMLElement {

    constructor() {
        super();
        this.id = ID.random
        for(let attribute of this.attributes) {
            switch (attribute.name) {
                case "fazid":
                    this.id = attribute.value
                    break;
            }
        }
        this.isLoading = true
        this.detach = false
        this.originalNodes = []
        this.originalParent = this.parentElement
        // Those are the faz element items inside the element item
        this.items = []
        this.childItemDepthLimit = 5
        this.reactItem = undefined
        this.childPrefix = "__child-prefix__"
        if (this.source) {
            console.debug("The element" + this.id + " has a source " +
                "attribute. All child nodes will be removed.")
            console.debug(this)
            this.childNodes.forEach(node =>{
                node.remove()
            })
        } else {
            this.childNodes.forEach(node =>{
                this.findItems(node)
                this.originalNodes.push(node)
            })
        }
    }

    get parent() {
        let fazParentId = this.dataset['fazParentId']
        return fazParentId ? document.getElementById(fazParentId) : undefined
    }

    attributesToProps(addProps=[]) {
        let props = []
        props['active'] = false
        props['debug'] = false
        props['disabled'] = false
        props['content'] = this.innerHTML
        let boolProperties = ["active", "debug", "disabled"]
        for (let attribute of this.attributes) {
            if (includes(boolProperties, attribute.name.toLowerCase())) {
                props[attribute.name.toLowerCase()] =
                    attribute.value.toLowerCase() === "true"
                continue
            }
            props[attribute.name.toLowerCase()] = attribute.value
        }
        props['type'] = this.tagName.toLowerCase()
        props['element'] = this
        props['combinedId'] = this.combinedId
        if (this.parent) {
            props['parentElement'] = this.parent
        }
        return merge(props, addProps)
    }

    attributesToStates() {
        for(let attribute of this.attributes) {
            switch (attribute.name) {
                case "debug":
                    this.reactItem.state.debug = attribute.value
                    break;
                case "disabled":
                    this.reactItem.state.disabled = attribute.value
                    break;
                case "link":
                    this.reactItem.state.link = attribute.value
                    break;
                case "source":
                    this.reactItem.state.source = attribute.value
                    break;
                case "sourceMethod":
                    this.reactItem.state.sourceMethod = attribute.value
                    break;
            }
        }
    }

    get childId() {
        return this.childPrefix.concat(this.id)
    }

    get combinedId() {
        if (this.parent) {
            return this.parent.id.concat("_", this.id)
        }
        return this.id
    }

    connectedCallback() {
        document.addEventListener("DOMContentLoaded", event => {
            this.contentLoaded(event)
        })
        this.isLoading = false
        this.load()
        if (this.parent) {
            if(this.detach) {
                this.parentElement.removeChild(this)
            }
        }
        this.beforeShow()
        this.show()
    }

    findItems(node, depth = 1) {
        // console.log("Finding nodes at: ", node.tagName)
        // console.log(node.tagName && node.tagName.toUpperCase().startsWith("FAZ-"))
        // To constitute a relationship between the current faz item and another
        // item inside, the depth should respect childItemDepthLimit.
        // After that we don't set the parent/child faz relationship.
        // If you need more depth in a specific element, increase the
        // childItemDepthLimit value.
        let found = false
        if (node.tagName && node.tagName.toUpperCase().startsWith("FAZ-")) {
            this.items.push(node)
            node.dataset['fazParentId'] = this.id
            found = true
        }
        if (!found && depth < this.childItemDepthLimit) {
            node.childNodes.forEach( childNode => {
                this.findItems(childNode, depth + 1)
            })
        }
    }

    load() {

    }

    afterShow() {}

    beforeShow() {}

    show() {}

    contentLoaded(event) {}

    cleanFazTag() {
        let parentElement = this.parentElement
        this.childNodes.forEach(node => {
            parentElement.append(node)
        })
        parentElement.removeChild(this)
    }
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
