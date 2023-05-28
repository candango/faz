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

import { randomId } from "./id";
import _ from "lodash";


export class FazElementItem extends HTMLElement {
    public content: any;
    public isLoading: boolean;
    public detach: boolean;
    public originalNodes: any;
    public originalParent: any;
    // Those are the faz element items inside the element item
    public items: Array<FazElementItem>;
    public childItemDepthLimit;
    public reactItem: any;
    public childPrefix: string;
    public source: any;
    public parent: FazElementItem | undefined;

    constructor() {
        super();
        this.content = undefined;
        for (let attribute of this.attributes) {
            switch (attribute.name) {
                case "content":
                    this.content = attribute.value
                    break
                case "id":
                case "fazid":
                    this.id = attribute.value
                    break
            }
        }

        if (!this.id) {
            this.id = randomId()
        }
        this.isLoading = true
        this.detach = false
        this.originalNodes = []
        this.originalParent = this.parentElement
        // Those are the faz element items inside the element item
        this.items = []
        this.dataset['faz_element_item'] = this.tagName
        this.childItemDepthLimit = 5
        this.reactItem = undefined
        this.childPrefix = "__child-prefix__"
        if (this.source) {
            console.debug(
                "The element" +
                    this.id +
                    " has a source " +
                    "attribute. All child nodes will be removed."
            )
            console.debug(this)
            this.childNodes.forEach((node) => {
                node.remove()
            })
        } else {
            // this.childNodes.forEach(node =>{
            //     this.findItems(node)
            //     this.originalNodes.push(node)
            // })
        }
    }

    // get parent() {
    //     let fazParentId = this.dataset["fazParentId"]
    //     return fazParentId ? document.getElementById(fazParentId) : undefined
    // }

    attributesToProps(addProps: any = []) {
        let props: any = []
        props['element'] = this
        props["active"] = false
        props["debug"] = false
        props["disabled"] = false
        props["content"] = this.content ? this.content : this.innerHTML
        let boolProperties = ["active", "debug", "disabled"]
        for (const attribute of this.attributes) {
            if (_.includes(boolProperties, attribute.name.toLowerCase())) {
                props[attribute.name.toLowerCase()] =
                    attribute.value.toLowerCase() === "true"
                continue
            }
            props[attribute.name.toLowerCase()] = attribute.value
        }


        props["type"] = this.tagName.toLowerCase()
        props["element"] = this
        // props["combinedId"] = this.combinedId
        // if (this.parent) {
        //     props["parentElement"] = this.parent
        // }
        return _.merge(props, addProps)
    }

    get childId() {
        return this.childPrefix.concat("-", this.id)
    }

    // get combinedId() {
    //     if (this.parent) {
    //         return this.parent.id.concat("_", this.id)
    //     }
    //     return this.id
    // }

    get contentChild() {
        return this.firstChild
    }

    stealChildren() {
        const children:Node[] = []
        while(this.firstChild) {
            children.push(this.firstChild)
            this.removeChild(this.firstChild)
        }
        return children
    }

    connectedCallback() {
        this.isLoading = false
        this.load()
        const children = this.beforeShow()
        this.show()
        this.afterShow(children)
    }

    /**
     * A faz item html node is a node that has a tag name and starts with our
     * prefix.
     */
    isFazItem(node: HTMLElement) {
        if (node === undefined) {
            node = this
        }
        return node instanceof FazElementItem 
    }

    load() {}

    afterShow(children:Node[]) {
        children.forEach(child => {
            this.contentChild?.appendChild(child)
            const item = child as FazElementItem
            new Promise((resolve) => {
                 setTimeout(()=>resolve(null), 0)
            }).then(()=> {
                if (item instanceof FazElementItem) {
                    this.items.push(item) 
                    item.parent = this
                    item.dataset['parent'] = this.id
                }
            })
        })

    }

    beforeShow() { 
        const children:Node[] = [];
        while(this.firstChild) {
            children.push(this.firstChild);
            this.removeChild(this.firstChild);
        }
        return children;
    }

    show() {}

    contentLoaded(event: Event) {}

    cleanFazTag() {
        let parentElement = this.parentElement;
        this.childNodes.forEach((node) => {
            parentElement?.append(node);
        })
        parentElement?.removeChild(this);
    }
}
