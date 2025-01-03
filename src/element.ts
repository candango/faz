/**
 * Copyright 2018-2025 Flavio Garcia
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

import { randomId, toBoolean } from "./values";
import { Accessor, createSignal, Setter } from "solid-js";

export interface FazComment extends Comment {
    fazElement: Accessor <FazElement | undefined>;
    setFazElement: Setter <FazElement | undefined>;
} 

export interface FazNode extends ChildNode {
    fazElement: Accessor <FazElement | undefined>;
    setFazElement: Setter <FazElement | undefined>;
}

export class FazElement extends HTMLElement {

    public active: Accessor<boolean>;
    public setActive: Setter<boolean>;
    public connected: Accessor<boolean>;
    public setConnected: Setter<boolean>;
    public content: Accessor<string|undefined>;
    public setContent: Setter<string|undefined>;
    public debug: Accessor<boolean>;
    public setDebug: Setter<boolean>;
    public disabled: Accessor<boolean>;
    public setDisabled: Setter<boolean>;
    public extraClasses: Accessor<string>;
    public setExtraClasses: Setter<string>;
    public fazElement: Accessor <FazElement | undefined>;
    public setFazElement: Setter <FazElement | undefined>;
    public fazChildren: Accessor<FazElement[]>;
    public setFazChildren: Setter<FazElement[]>;
    public loading: Accessor<boolean>;
    public setLoading: Setter<boolean>;
    public parent: Accessor<FazElement | undefined>;
    public setParent: Setter<FazElement | undefined>;
    public reload: Accessor<boolean>;
    public setReload: Setter<boolean>;
    public link: Accessor<string|undefined>;
    public setLink: Setter<string|undefined>;

    public childPrefix: string = "";
    public renderedChild: ChildNode | null = null;
    private initialOuterHTML: string = "";
    private comment: FazComment | null = null;
    public source: any;

    constructor() {
        super();

        [this.active, this.setActive] = createSignal<boolean>(false);
        [this.connected, this.setConnected] = createSignal<boolean>(false);
        [this.content, this.setContent] = createSignal<string|undefined>(undefined);
        [this.debug, this.setDebug] = createSignal<boolean>(false);
        [this.disabled, this.setDisabled] = createSignal<boolean>(false);
        [this.extraClasses, this.setExtraClasses] = createSignal<string>("");
        [this.fazElement, this.setFazElement] = createSignal<FazElement | undefined>(undefined);
        [this.fazChildren, this.setFazChildren] = createSignal<FazElement[]>([]);
        [this.loading, this.setLoading] = createSignal(true);
        [this.parent, this.setParent] = createSignal<FazElement | undefined>(undefined);
        [this.reload, this.setReload] = createSignal(true);
        [this.link, this.setLink] = createSignal<string|undefined>(undefined);

        this.initialOuterHTML = this.outerHTML;
        if (!this.id) {
            this.id = randomId();
        }

        for (const attribute of this.attributes) {
            switch (attribute.name.toLowerCase()) {
                case "active":
                    this.setActive(toBoolean(attribute.value));
                    break;
                case "class":
                case "fazclass":
                case "faz-class":
                    this.setExtraClasses(attribute.value);
                    break;
                case "content":
                    this.setContent(attribute.value);
                    break;
                case "debug":
                    this.setDebug(toBoolean(attribute.value));
                    break;
                case "disabled":
                    this.setDisabled(toBoolean(attribute.value));
                    break;
                case "id":
                case "fazid":
                case "faz-id":
                    this.id = attribute.value;
                    break;
                case "href":
                case "link":
                    this.setLink(attribute.value);
                    break;
            }
        }

        this.dataset['faz_element_item'] = this.tagName;
        this.childPrefix = "__child-prefix__";
        if (this.source) {
            console.debug(`The element ${this.id}  has a source attribute. All child nodes will be removed.`);
            this.childNodes.forEach((node) => {
                node.remove();
            });
        }
        this.comment = (document.createComment(this.nodeName + " " + this.id) as FazComment);
        [this.comment.fazElement, this.comment.setFazElement] = createSignal<FazElement | undefined>(this);
        this.before(this.comment);
    }

    hasExtraClass(value: string): boolean {
        const extraClasses = this.extraClasses().trim().split(" ");
        return extraClasses.find(
            item => item == value.toLowerCase()) !== undefined;
    }

    hasExtraClasses(): boolean {
        return this.extraClasses().trim().split(" ").length > 0;
    }

    pushExtraClass(value: string) {
        value = value.trim();
        if (!this.hasExtraClass(value)) {
            const extraClasses = this.extraClasses().trim().split(" ");
            extraClasses.push(value);
            this.setExtraClasses(extraClasses.join(" "));
        }
    }

    resolveLink(): string | undefined  {
        // From: https://stackoverflow.com/a/66717705/2887989
        let voidHref = "#!";
        const link = this.link();
        if (this.disabled() || link === undefined || link === "") {
            return voidHref;
        }
        return this.link();
    }

    addFazChild(child: FazElement) {
        if (this.fazChildren().indexOf(child) === -1) {
            const children = {...this.fazChildren()} as FazElement[];
            children.push(child);
            this.setFazChildren(children);
        }
    }

    removeFazChild(child: FazElement) {
        if (this.fazChildren().indexOf(child) !== -1) {
            const children = {...this.fazChildren()} as FazElement[];
            this.setFazChildren(children.filter(i => i !== child));
        }
    }

    get activeFazChildren(): FazElement[] {
        return this.fazChildren().filter(child => {
            return child.active();
        })
    }

    get contentChild(): ChildNode | null {
        return this.firstChild;
    }

    get linkIsVoid() {
        if (this.disabled()) {
            return true;
        }
        const linkResolved = this.resolveLink();
        return linkResolved === undefined || linkResolved === "" || linkResolved === "#" || linkResolved === "#!";
    }

    addChild<T extends Node>(node: T): T {
        this.contentChild?.appendChild(node);
        return node;
    }

    afterShow():void {}

    beforeShow():void {}

    collectChildren() { 
        const children:Node[] = [];
        const items: FazElement[] = [];
        if (this.loading()) {
            while(this.firstChild) {
                if (this.firstChild instanceof FazElement) {
                    const item = this.firstChild as FazElement;
                    item.setParent(this as FazElement);
                    items.push(item);
                    item.dataset['parent'] = this.id;
                }
                children.push(this.firstChild);
                this.removeChild(this.firstChild);
            }
            if (items.length > 0) {
                this.setFazChildren(items);
            }
        }
        return children;
    }

    placeBackChildren(children: Node[]) {
        if (this.loading()) {
            children.forEach(child => {
                this.addChild(child);
            });
        }
    }

    connectedCallback() {
        new Promise((resolve) => {
            setTimeout(()=>resolve(null), 0);
        }).then(()=> {
            if (this.loading()) {
                this.render();
            }
            this.setConnected(true);
            this.setLoading(false);
        });
    }

    load() {}

    show() {}

    render() {
        this.load();
        this.beforeShow();
        const children = this.collectChildren();
        this.show();
        this.placeBackChildren(children);
        this.cleanFazTag();
        this.afterShow();
    }

    cleanFazTag(): void {
        this.childNodes.forEach((node) => {
            const fNode = node as FazNode;
            [fNode.fazElement, fNode.setFazElement] = createSignal<FazElement | undefined>(this);
            this.before(fNode);
        })
        if (this.parent()) {
            this.parent()?.appendChild(this);
            return;
        }
        this.remove(); 
    }
}
