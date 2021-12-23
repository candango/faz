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
import merge from "lodash/merge"
import React from 'react'

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

export class FazReactItem extends React.Component {

    constructor(props) {
        super(props);
        let _id = props.id ?
            props.id.replace("__child-prefix__", this.prefix) : ID.random
        let _element = props.element
        if (_element) {
            _element.reactChild = this
        }
        this.state = {
            id: _id,
            disabled: false,
            element: _element,
            type: "primary",
            content: "",
            link: undefined
        }
    }

    get disabled() {
        return this.state.disabled
    }

    get prefix() {
        return "faz-react-item"
    }

    updateState(someState) {
        this.setState(prevState => {
            return merge(cloneDeep(prevState), someState)
        })
    }

    componentDidMount() {
        let renderedElement = document.querySelector("#" + this.state.id)
        if (this.state.element && renderedElement) {
            this.state.element.originalNodes.forEach(
                item => renderedElement.append(item)
            )
        }
        this.afterMount()
    }

    afterMount() {}
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

export class FazElementItem extends HTMLElement {

    constructor() {
        super();
        if (!this.id) {
            this.id = ID.random
        }
        this.isLoading = true
        this.originalNodes = []
        this.fazChildren = []
        this.reactChild = undefined
        this.childPrefix = "__child-prefix__"
    }

    get childId() {
        return this.childPrefix.concat(this.id)
    }

    connectedCallback() {
        this.childNodes.forEach(item => {
            if (item.tagName && item.tagName.toUpperCase().startsWith("FAZ-")) {
                this.fazChildren.push(item)
            }
            this.originalNodes.push(item)
        })
        document.addEventListener("DOMContentLoaded", event => {
            this.contentLoaded(event);
        });
        this.beforeLoad();
        this.isLoading = false;
        this.afterLoad();
        this.show();
    }

    afterLoad() {}

    beforeLoad() {}

    show() {}

    contentLoaded(event) {}

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
