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

import { randomId } from "./id"
import { toBoolean } from "./values"
import { Accessor, createSignal, Setter, Signal } from "solid-js"


class FazNode extends Node {
    public fazElement: FazElementItem | null = null
}

export class FazElementItem extends HTMLElement {

    private activeSignal: Signal<boolean>
    private contentSignal: Signal<string|null>
    private disabledSignal: Signal<boolean>
    private extraClassesSignal: Signal<string>

    private _items: Array<FazElementItem> = new Array()
    private _loading: boolean = true
    private _parent: FazElementItem | null = null
    private _reload: boolean = false
    private _link: string | null = null

    public childPrefix: string = ""
    private connected: boolean = false
    public debug: boolean = false
    public renderedChild: ChildNode | null = null
    private initialOuterHTML: string = ""
    private comment: Comment | null = null
    public source: any

    constructor() {
        super()

        this.activeSignal = createSignal<boolean>(false)
        this.contentSignal = createSignal<string|null>(null)
        this.disabledSignal = createSignal<boolean>(false)
        this.extraClassesSignal = createSignal<string>("")

        this.initialOuterHTML = this.outerHTML
        if (!this.id) {
            this.id = randomId()
        }

        for (const attribute of this.attributes) {
            switch (attribute.name.toLowerCase()) {
                case "active":
                    this.setActive(toBoolean(attribute.value))
                    break
                case "class":
                case "fazclass":
                case "faz-class":
                    this.setExtraClasses(attribute.value)
                    break
                case "content":
                    this.setContent(attribute.value)
                    break
                case "disabled":
                    this.setDisabled(toBoolean(attribute.value))
                    break
                case "id":
                case "fazid":
                case "faz-id":
                    this.id = attribute.value
                    break
                case "href":
                case "link":
                    this._link = attribute.value
                    break
            }
        }
        this.dataset['faz_element_item'] = this.tagName
        this.childPrefix = "__child-prefix__"
        if (this.source) {
            console.debug(
                "The element" +
                    this.id +
                    " has a source " +
                    "attribute. All child nodes will be removed."
            )
            this.childNodes.forEach((node) => {
                node.remove()
            })
        }
        this.comment = document.createComment(this.nodeName + " " + this.id)
        this.before(this.comment)
    }

    get active(): Accessor<boolean> {
        return this.activeSignal[0]
    }

    get setActive(): Setter<boolean> {
        return this.activeSignal[1]
    }

    get content(): Accessor<string|null> {
        return this.contentSignal[0]
    }

    get setContent(): Setter<string|null> {
        return this.contentSignal[1]
    }

    get disabled(): Accessor<boolean> {
        return this.disabledSignal[0]
    }

    get setDisabled(): Setter<boolean> {
        return this.disabledSignal[1]
    }

    get extraClasses(): Accessor<string> {
        return this.extraClassesSignal[0]
    }

    get setExtraClasses(): Setter<string> {
        return this.extraClassesSignal[1]
    }

    protected createEvent(eventName: string, value: any,
                        oldValue: any): CustomEvent {
        return new CustomEvent(eventName, {
            bubbles: true,
            detail: {
                value: value,
                oldValue: oldValue,
            },
        })
    }

    hasExtraClass(value: string): boolean {
        const extraClasses = this.extraClasses().trim().split(" ")
        return extraClasses.find(
            item => item == value.toLowerCase()) !== undefined
    }

    hasExtraClasses(): boolean {
        return this.extraClasses().trim().split(" ").length > 0
    }

    pushExtraClass(value: string) {
        value = value.trim()
        if (!this.hasExtraClass(value)) {
            const extraClasses = this.extraClasses().trim().split(" ")
            extraClasses.push(value)
            this.setExtraClasses(extraClasses.join(" "))
        }
    }

    get link() {
        // From: https://stackoverflow.com/a/66717705/2887989
        let voidHref = "#!"
        if (this.disabled() || this._link === null || this._link === "") {
            return voidHref
        }
        return this._link
    }

    set link(value: string) {
        if (this._link !== value) {
            const oldValue = this._link
            this._link = value
            if (!this.loading) {
                const event = this.createEvent("linkchanged", value, oldValue)
                this.dispatchEvent(event)
                this.onLinkChange(event)
            }
        }
    }

    onLinkChange(event: CustomEvent) {}

    get parent(): FazElementItem | null {
        return this._parent
    }

    set parent(value: FazElementItem | null) {
        if (this._parent !== value) {
            const oldValue = {...this._parent} as FazElementItem | null
            this._parent = value
            if (!this.loading) {
                const event = this.createEvent("parentchanged", value,
                                               oldValue)
                this.dispatchEvent(event)
                this.onParentChange(event)
            }
        }
    }

    onParentChange(event: CustomEvent) {}

    get items(): Array<FazElementItem> {
        return this._items
    }

    addItem(item: FazElementItem) {
        if (this._items.indexOf(item) === -1) {
            const oldItems = {...this._items} as Array<FazElementItem>
            this._items.push(item)
            if (!this.loading) {
                const event = this.createEvent("itemschanged", this._items,
                                               oldItems)
                this.dispatchEvent(event)
                this.onItemsChange(event)
            }
        }
    }

    removeItem(item: FazElementItem) {
        if (this._items.indexOf(item) !== -1) {
            const oldItems = {...this._items} as Array<FazElementItem>
            this._items = this._items.filter(_item => _item !== item)
            if (!this.loading) {
                const event = this.createEvent("itemschanged", this._items,
                                               oldItems)
                this.dispatchEvent(event)
                this.onItemsChange(event)
            }
        }
    }

    setItems(items: Array<FazElementItem>) {
        const oldItems = {...this._items} as Array<FazElementItem>
        this._items = items
        if (!this.loading) {
            const event = this.createEvent("itemschanged", this._items,
                                           oldItems)
            this.dispatchEvent(event)
            this.onItemsChange(event)
        }
    }

    onItemsChange(event: CustomEvent) {}

    get loading(): boolean {
        return this._loading
    }

    set loading(value: boolean) {
        if (this._loading !== value) {
            const oldValue = this._loading
            this._loading = value
            const event = this.createEvent("loadingchanged", value, oldValue)
            this.dispatchEvent(event)
            this.onLoadingChange(event)
        }
    }

    onLoadingChange(event: CustomEvent) {}

    get reload(): boolean {
        return this._reload
    }

    set reload(value: boolean) {
        if (this._reload !== value) {
            const oldValue = this._reload
            this._reload = value
            const event = this.createEvent("reloadchanged", value, oldValue)
            this.dispatchEvent(event)
            this.onReloadChange(event)
        }
    }

    onReloadChange(event: CustomEvent) {}

    get activeItems() {
        return this.items.filter(item => {
            return item.active
        })
    }


    get childId() {
        return this.childPrefix.concat("-", this.id)
    }

    get contentChild(): ChildNode | null {
        return this.firstChild
    }

    get linkIsVoid() {
        if (this.disabled()) {
            return true
        }
        return this._link === null || this._link === "" ||
            this._link === "#" || this._link === "#!"
    }

    addChild<T extends Node>(node: T): T {
        this.contentChild?.appendChild(node)
        return node 
    }

    afterShow():void {}

    beforeShow():void {}

    collectChildren() { 
        const children:Node[] = []
        const items: FazElementItem[] = []
        if (this.loading) {
            while(this.firstChild) {
                if (this.firstChild instanceof FazElementItem) {
                    const item = this.firstChild as FazElementItem
                    item.parent = this
                    items.push(item)
                    item.dataset['parent'] = this.id
                }
                children.push(this.firstChild)
                this.removeChild(this.firstChild)
            }
            if (items.length > 0) {
                this.setItems(items)
            }
        }
        return children
    }

    placeBackChildren(children: Node[]) {
        if (this.loading) {
            children.forEach(child => {
                this.addChild(child)
            })
        }
    }

    connectedCallback() {
        this.render()
        this.connected = true
    }

    load() {}

    show() {}

    render() {
        // new Promise((resolve) => {
        //     setTimeout(()=>resolve(null), 0)
        // }).then(()=> {
            this.load()
            this.beforeShow()
            const children = this.collectChildren()
            if (this.loading) {
                this.show()
            }
            this.placeBackChildren(children)
            this.afterShow()
            this.loading = false
        // })
    }

    cleanFazTag() {
        let parentElement = this.parentElement
        this.childNodes.forEach((node) => {
            ((node as unknown) as FazNode).fazElement = this
            this.before(node)
        })
        parentElement?.removeChild(this) 
    }
}
