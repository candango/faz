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
import { Accessor, createSignal, Setter} from "solid-js";

class FazNode extends Node {
    public fazElement: FazElementItem | null = null;
}

export class FazElementItem extends HTMLElement {
    public active: Accessor<boolean>;
    public setActive: Setter<boolean>;

    public classes: Accessor<string>;
    public setClasses: Setter<string>;

    public extraClasses: Accessor<string>;
    public setExtraClasses: Setter<string>;

    public content: Accessor<string | undefined>;
    public setContent: Setter<string | undefined>;

    public disabled: Accessor<boolean>;
    public setDisabled: Setter<boolean>;

    public items: Accessor<Array<FazElementItem>>;
    public setItems: Setter<Array<FazElementItem>>;

    public loading: Accessor<boolean>;
    public setLoading: Setter<boolean>;

    public parent: Accessor<FazElementItem | undefined>;
    public setParent: any;

    public renderedChild: ChildNode | null = null;
    public debug: boolean = false;
    private href: string | undefined;
    public childPrefix: string = "";
    public source: any;

    constructor() {
        super();
        [this.active, this.setActive] = createSignal<boolean>(false);
        [this.classes, this.setClasses] = createSignal("");
        [this.extraClasses, this.setExtraClasses] = createSignal("");
        [this.content, this.setContent] = createSignal(undefined);
        [this.disabled, this.setDisabled] = createSignal(false);
        [this.items, this.setItems] =
            createSignal<Array<FazElementItem>>(new Array());
        [this.loading, this.setLoading] = createSignal(true);
        [this.parent, this.setParent] = 
            createSignal<FazElementItem | undefined>();
        if (!this.id) {
            this.id = randomId();
        }
        for (let attribute of this.attributes) {
            switch (attribute.name.toLowerCase()) {
                case "active":
                    this.setActive(attribute.value.toLowerCase() === "true");
                    break;
                case "class":
                case "faz-class":
                    this.setExtraClasses(attribute.value);
                    break;
                case "content":
                    this.setContent(attribute.value);
                    break;
                case "disabled":
                    this.setDisabled(attribute.value.toLowerCase() === "true");
                    break;
                case "id":
                case "fazid":
                case "faz-id":
                    this.id = attribute.value;
                    break;
                case "href":
                case "link":
                    this.href = attribute.value;
                    break;
            }
        }
        this.dataset['faz_element_item'] = this.tagName;
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
        }
    }

    get activeItems() {
        return this.items().filter(item => {
            return item.active();
        })
    }

    get link() {
        // From: https://stackoverflow.com/a/66717705/2887989
        let voidHref = "#!";
        if (this.disabled() || this.href === undefined) {
            return voidHref;
        }
        return this.href;
    }

    attributesToProps(addProps: any = []) {
        let props: any = [];
        props['element'] = this;
        props['active'] = this.active();
        props['debug'] = false;
        props['disabled'] = this.disabled();
        props['content'] = this.content() ? this.content() : this.innerHTML;
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

    get contentChild(): ChildNode | null {
        return this.firstChild;
    }

    get linkIsVoid() {
        if (this.disabled()) {
            return true;
        }
        return this.link === undefined || this.link === "#" ||
            this.link === "#!";
    }

    addChild<T extends Node>(node: T): T {
        this.contentChild?.appendChild(node)
        return node; 
    }

    afterShow(children:Node[]) {
        if (this.loading()) {
            children.forEach(child => {
                this.addChild(child);
            });
        }
    }

    beforeShow() { 
        const children:Node[] = [];
        const items: FazElementItem[] = [];
        if (this.loading()) {
            while(this.firstChild) {
                if (this.firstChild instanceof FazElementItem) {
                    const item = this.firstChild as FazElementItem;
                    item.setParent(this);
                    items.push(item);
                    item.dataset['parent'] = this.id;
                }
                children.push(this.firstChild);
                this.removeChild(this.firstChild);
            }
            if (items.length > 0) {
                this.setItems(items);
            }
        }
        return children;
    }

    connectedCallback() {
        new Promise((resolve) => {
            setTimeout(()=>resolve(null), 0);
        }).then(()=> {
            this.load();
            const children = this.beforeShow();
            if (this.loading()) {
                this.show();
            }
            this.renderedChild = this.firstChild;
            this.afterShow(children);
            this.setLoading(false);
            new Promise((resolve) => {
                setTimeout(()=>resolve(null), 0);
            }).then(()=> {
                this.cleanFazTag();
            });
        });
    }

    load() {}

    show() {}

    cleanFazTag() {
        let parentElement = this.parentElement
        this.childNodes.forEach((node) => {
            ((node as unknown) as FazNode).fazElement = this;
            this.before(node);
        });
        parentElement?.removeChild(this);
    }
}
