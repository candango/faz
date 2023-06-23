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

import { randomId } from "./id";
import { includes, merge } from "lodash";
import { Accessor, createSignal, Setter } from "solid-js";


export class FazElementItem extends HTMLElement {
    public active: Accessor<boolean>;
    public setActive: Setter<boolean>;

    public classes: Accessor<string>;
    public setClasses: Setter<string>;

    public items: Accessor<Array<FazElementItem>>;
    public setItems: Setter<Array<FazElementItem>>;

    public content: any;
    public debug: boolean = false;
    public disabled: boolean = false;
    public isLoading: boolean;
    public detach: boolean;
    private href: string | undefined;
    public childItemDepthLimit;
    public childPrefix: string;
    public parent: Accessor<FazElementItem | undefined>;
    public setParent: any;
    public reactItem: any;
    public source: any;

    constructor() {
        super();
        [this.active, this.setActive] = createSignal<boolean>(false);
        [this.classes, this.setClasses] = createSignal("");
        [this.items, this.setItems] =
            createSignal<Array<FazElementItem>>(new Array());
        [this.parent, this.setParent] = 
            createSignal<FazElementItem | undefined>();
        this.content = undefined;
        for (let attribute of this.attributes) {
            switch (attribute.name) {
                case "active":
                    this.setActive(attribute.value.toLowerCase() === "true");
                    break;
                case "content":
                    this.content = attribute.value;
                    break;
                case "disabled":
                    this.disabled = attribute.value.toLowerCase() === "true";
                    break;
                case "id":
                case "fazid":
                    this.id = attribute.value;
                    break;
                case "href":
                case "link":
                    this.href = attribute.value;
                    break;
            }
        }

        if (!this.id) {
            this.id = randomId();
        }
        this.isLoading = true;
        this.detach = false;
        this.dataset['faz_element_item'] = this.tagName;
        this.childItemDepthLimit = 5;
        this.reactItem = undefined;
        this.childPrefix = "__child-prefix__";
        if (this.source) {
            console.debug(
                "The element" +
                    this.id +
                    " has a source " +
                    "attribute. All child nodes will be removed."
            );
            this.childNodes.forEach((node) => {
                node.remove();
            });
        } else {
            // this.childNodes.forEach(node =>{
            //     this.findItems(node)
            //     this.originalNodes.push(node)
            // })
        }
    }

    get activeItems() {
        return this.items().filter(item => {
            return item.active()
        })
    }

    get link() {
        // From: https://stackoverflow.com/a/66717705/2887989
        let voidHref = "#!";
        if (this.disabled || this.href === undefined) {
            return voidHref;
        }
        return this.href;
    }
    // get parent() {
    //     let fazParentId = this.dataset["fazParentId"]
    //     return fazParentId ? document.getElementById(fazParentId) : undefined
    // }

    attributesToProps(addProps: any = []) {
        let props: any = [];
        props['element'] = this;
        props['active'] = this.active();
        props['debug'] = false;
        props['disabled'] = this.disabled;
        props['content'] = this.content ? this.content : this.innerHTML;
        let boolProperties = ["debug"];
        for (const attribute of this.attributes) {
            if (includes(boolProperties, attribute.name.toLowerCase())) {
                props[attribute.name.toLowerCase()] =
                    attribute.value.toLowerCase() === "true";
                continue;
            }
            props[attribute.name.toLowerCase()] = attribute.value;
        }


        props["type"] = this.tagName.toLowerCase();
        props["element"] = this;
        // props["combinedId"] = this.combinedId
        // if (this.parent) {
        //     props["parentElement"] = this.parent
        // }
        return merge(props, addProps);
    }

    get childId() {
        return this.childPrefix.concat("-", this.id);
    }

    get contentChild(): ChildNode | undefined | null {
        return this.firstChild;
    }

    connectedCallback() {
        this.isLoading = false;
        this.load();
        const children = this.beforeShow();
        this.show();
        this.afterShow(children);
    }

    /**
     * A faz item html node is a node that has a tag name and starts with our
     * prefix.
     */
    isFazItem(node: HTMLElement) {
        if (node === undefined) {
            node = this;
        }
        return node instanceof FazElementItem;
    }

    load() {}

    afterShow(children:Node[]) {
        children.forEach(child => {
            this.contentChild?.appendChild(child);
            const item = child as FazElementItem;
            new Promise((resolve) => {
                 setTimeout(()=>resolve(null), 0);
            }).then(()=> {
                if (item instanceof FazElementItem) {
                    const items = this.items()
                    items.push(item);
                    this.setItems(items);
                    item.setParent(this);
                    item.dataset['parent'] = this.id;
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
        });
        parentElement?.removeChild(this);
    }
}
