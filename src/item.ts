/**
 * Copyright 2018-2024 Flavio Garcia
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
import { toBoolean } from "./values";


class FazNode extends Node {
    public fazElement: FazElementItem | null = null;
}

export class FazElementItem extends HTMLElement {
    private _active: boolean = false;
    private _content: string | null = null;
    private _disabled: boolean = false;
    private _extraClasses: string = "";
    private _items: Array<FazElementItem> = new Array();
    private _loading: boolean = true;
    private _parent: FazElementItem | null = null;
    private _reload: boolean = false;
    private _link: string | null = null;

    public childPrefix: string = "";
    private connected: boolean = false;
    public debug: boolean = false;
    public renderedChild: ChildNode | null = null;
    private initialOuterHTML: string = "";
    private comment: Comment | null = null;
    public source: any;

    constructor() {
        super();
        this.initialOuterHTML = this.outerHTML;
        if (!this.id) {
            this.id = randomId();
        }
        for (const attribute of this.attributes) {
            switch (attribute.name.toLowerCase()) {
                case "active":
                    this._active = toBoolean(attribute.value);
                    break;
                case "class":
                case "faz-class":
                    this._extraClasses = attribute.value;
                    break;
                case "content":
                    this._content = attribute.value;
                    break;
                case "disabled":
                    this._disabled = toBoolean(attribute.value); 
                    break;
                case "id":
                case "fazid":
                case "faz-id":
                    this.id = attribute.value;
                    break;
                case "href":
                case "link":
                    this._link = attribute.value;
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
        this.comment = document.createComment(this.nodeName + " " + this.id);
        this.before(this.comment);
    }

    protected createEvent(eventName: string, value: any,
                        oldValue: any): CustomEvent {
        return new CustomEvent(eventName, {
            bubbles: true,
            detail: {
                value: value,
                oldValue: oldValue,
            },
        });
    }

    get active(): boolean {
        return this._active;
    }

    set active(value: boolean) {
        if (this._active !== value) {
            const oldValue = this._active;
            this._active = value;
            if (!this.loading) {
                const event = this.createEvent("activechange", value,
                                               oldValue);
                this.dispatchEvent(event);
                this.onActiveChange(event);
            }
        }
    }

    onActiveChange(event: CustomEvent) {}

    get content(): string | null {
        return this._content;
    }

    set content(value: string | null) {
        if (this._content !== value) {
            const oldValue = this._content;
            this._content = value;
            if (!this.loading) {
                const event = this.createEvent("contentchange", value,
                                               oldValue);
                this.dispatchEvent(event);
                this.onContentChange(event);
            }
        }
    }

    onContentChange(event: CustomEvent) {}

    get disabled(): boolean {
        return this._disabled;
    }

    set disabled(value: boolean) {
        if (this._disabled !== value) {
            const oldValue = this._disabled;
            this._disabled = value;
            if (!this.loading) {
                const event = this.createEvent("disabledchange", value,
                                               oldValue);
                this.dispatchEvent(event);
                this.onDisabledChange(event);
            }
        }
    }

    onDisabledChange(event: CustomEvent) {}

    get extraClasses(): string {
        return this._extraClasses;
    }

    set extraClasses(value: string) {
        if (this._extraClasses !== value) {
            const oldValue = this._extraClasses;
            this._extraClasses = value;
            if (!this.loading) {
                const event = this.createEvent("extraclasseschange", value,
                                               oldValue);
                this.dispatchEvent(event);
                this.onExtraClassesChange(event);
            }
        }
    }

    onExtraClassesChange(event: CustomEvent) {}

    get link() {
        // From: https://stackoverflow.com/a/66717705/2887989
        let voidHref = "#!";
        if (this.disabled || this._link === null || this._link === "") {
            return voidHref;
        }
        return this._link;
    }

    set link(value: string) {
        if (this._link !== value) {
            const oldValue = this._link;
            this._link = value;
            if (!this.loading) {
                const event = this.createEvent("linkchange", value, oldValue);
                this.dispatchEvent(event);
                this.onLinkChange(event);
            }
        }
    }

    onLinkChange(event: CustomEvent) {}

    get parent(): FazElementItem | null {
        return this._parent;
    }

    set parent(value: FazElementItem | null) {
        if (this._parent !== value) {
            const oldValue = {...this._parent} as FazElementItem | null;
            this._parent = value;
            if (!this.loading) {
                const event = this.createEvent("parentchange", value,
                                               oldValue);
                this.dispatchEvent(event);
                this.onParentChange(event);
            }
        }
    }

    onParentChange(event: CustomEvent) {}

    get items(): Array<FazElementItem> {
        return this._items;
    }

    addItem(item: FazElementItem) {
        if (this._items.indexOf(item) === -1) {
            const oldItems = {...this._items} as Array<FazElementItem>;
            this._items.push(item);
            if (!this.loading) {
                const event = this.createEvent("itemschange", this._items,
                                               oldItems);
                this.dispatchEvent(event);
                this.onItemsChange(event);
            }
        }
    }

    removeItem(item: FazElementItem) {
        if (this._items.indexOf(item) !== -1) {
            const oldItems = {...this._items} as Array<FazElementItem>;
            this._items = this._items.filter(_item => _item !== item);
            if (!this.loading) {
                const event = this.createEvent("itemschange", this._items,
                                               oldItems);
                this.dispatchEvent(event);
                this.onItemsChange(event);
            }
        }
    }

    setItems(items: Array<FazElementItem>) {
        const oldItems = {...this._items} as Array<FazElementItem>;
        this._items = items;
        if (!this.loading) {
            const event = this.createEvent("itemschange", this._items,
                                           oldItems);
            this.dispatchEvent(event);
            this.onItemsChange(event);
        }
    }

    onItemsChange(event: CustomEvent) {}

    get loading(): boolean {
        return this._loading;
    }

    set loading(value: boolean) {
        if (this._loading !== value) {
            const oldValue = this._loading;
            this._loading = value;
            const event = this.createEvent("loadingchange", value, oldValue);
            this.dispatchEvent(event);
            this.onLoadingChange(event);
        }
    }

    onLoadingChange(event: CustomEvent) {}

    get reload(): boolean {
        return this._reload;
    }

    set reload(value: boolean) {
        if (this._reload !== value) {
            const oldValue = this._reload;
            this._reload = value;
            const event = this.createEvent("reloadchange", value, oldValue);
            this.dispatchEvent(event);
            this.onReloadChange(event);
        }
    }

    onReloadChange(event: CustomEvent) {}

    get activeItems() {
        return this.items.filter(item => {
            return item.active;
        })
    }


    get childId() {
        return this.childPrefix.concat("-", this.id);
    }

    get contentChild(): ChildNode | null {
        return this.firstChild;
    }

    get linkIsVoid() {
        if (this.disabled) {
            return true;
        }
        return this._link === null || this._link === "" ||
            this._link === "#" || this._link === "#!";
    }

    addChild<T extends Node>(node: T): T {
        this.contentChild?.appendChild(node)
        return node; 
    }

    afterShow(children:Node[]) {
        if (this.loading) {
            children.forEach(child => {
                this.addChild(child);
            });
        }
    }

    beforeShow():void {}

    collectChildren() { 
        const children:Node[] = [];
        const items: FazElementItem[] = [];
        if (this.loading) {
            while(this.firstChild) {
                if (this.firstChild instanceof FazElementItem) {
                    const item = this.firstChild as FazElementItem;
                    item.parent = this;
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
        this.render();
        this.connected = true;
    }

    load() {}

    show() {}

    render() {
        new Promise((resolve) => {
            setTimeout(()=>resolve(null), 0);
        }).then(()=> {
            this.load();
            this.beforeShow();
            const children = this.collectChildren();
            if (this.loading) {
                this.show();
            }
            this.afterShow(children);
            this.loading = false;
        });
    }

    cleanFazTag() {
        let parentElement = this.parentElement
        this.childNodes.forEach((node) => {
            ((node as unknown) as FazNode).fazElement = this;
            this.before(node);
        });
        parentElement?.removeChild(this); 
    }
}
