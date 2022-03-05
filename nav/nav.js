/**
 * Copyright 2018-2022 Flávio Gonçalves Garcia
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

import {FazElementItem, FazReactItem} from "../item"
import FazNavItemReact from "./nav-item"
import FazNavTabReact from "./nav-tab"
import React from "react"
import ReactDOM from "react-dom"
import includes from "lodash/includes"


class FazNavReact extends FazReactItem {

    defineStates(props) {
        this.state['fill'] = false
        this.state['justify'] = "left"
        this.state['pills'] = false
        this.state['source'] = undefined
        this.state['vertical'] = false
        this.state['loaded'] = false
        this.timeout = 0
        this.current = undefined

        this.state['tabs'] = []
        for (let key in props) {
            switch (key) {
                case "children":
                    this.state['items'] = props[key]
                    break
                case "fill":
                    this.state['fill'] = props[key].toLowerCase() === "true"
                    break
                case "justify":
                    this.state['justify'] = props[key].toLowerCase()
                    break
                case "pills":
                    this.state['pills'] = props[key].toLowerCase() === "true"
                    break
                case "source":
                    this.state['source'] = props[key]
                    break
                case "vertical":
                    this.state['vertical'] = props[key].toLowerCase() === "true"
                    break
            }
        }
        this.beOverMe = this.beOverMe.bind(this)
        this.leaveMe = this.leaveMe.bind(this)
    }

    get onEdge() {
        if(this.current) {
            return !this.current.isDropdown
        }
        return false
    }

    get renderedNavItems() {
        return this.renderedItems.filter(item => {
            return item instanceof FazNavItemReact
        })
    }

    get renderedTabItems() {
        return this.renderedItems.filter(item => {
            return item instanceof FazNavTabReact
        })
    }

    get activeNavItems() {
        return this.renderedNavItems.filter(item => {
            return item.state.active
        })
    }

    get activeItems() {
        return this.renderedItems.filter(item => {
            return item.state.active
        })
    }

    get hasTabs() {
        return !!this.tabItems.length;
    }

    get orientation() {
        return this.state.vertical ? "vertical" : undefined
    }

    get isVertical() {
        return this.orientation === "vertical"
    }

    get prefix() {
        return "faz-nav-react"
    }

    get classNames() {
        let classes = ["nav"]

        if (this.state.pills && !this.hasTabs) {
            classes.push("nav-pills")
        }

        if (this.state.fill) {
            classes.push("nav-fill")
        }

        if (this.state.justify === "center") {
            classes.push("justify-content-center")
        } else if (this.state.justify === "right") {
            classes.push("justify-content-end")
        }

        if (this.hasTabs) {
            classes.push("nav-tabs")
        }

        if (this.state.vertical) {
            classes.push("flex-column")
        }
        return classes.join(" ")
    }

    get containerId() {
        return "faz-nav-container-".concat(this.state.id)
    }

    get navItems() {
        let itemsToRender = [
            "faz-nav-item",
            "faz-nav-item-el"
        ]
        return this.state.items.filter(
            item => includes(itemsToRender, item['type']))
    }

    get tabItems() {
        let itemsToRender = [
            "faz-nav-tab"
        ]
        return this.state.items.filter(
            item => includes(itemsToRender, item['type']))
    }

    componentDidMount() {
        super.componentDidMount()
        // Activate first item if no nav items are selected and nav has tabs
        if (this.hasTabs) {
            if (!this.activeNavItems.length) {
                this.renderedNavItems[0].activate()
            }
        }
    }

    requestDataCallback(response) {
        this.updateState({items:response.data.items})
    }

    afterMount() {
        if(this.state.source) {
            this.requestData().then(
                this.updateState({loaded: true})
            )
        }
    }

    renderItems() {
        return this.navItems.map((item) => {
            if (item.element) {
                return item.element.toReact(item, this, this)
            }
            let content = item.content ? item.content : item.value
            return <FazNavItemReact key={item.id}
                                    active={item.active}
                                    disabled={item.disabled}
                                    id={item.id}
                                    parent={this}
                                    content={content}
                                    root={this}
                                    items={item.items}
                                    link={item.link}
                                    target={item.target}
                                    ariaExpanded={item.ariaExpanded}/>
        })
    }

    renderTabs() {
        return this.tabItems.map((item) => {
            if(item.element) {
                return item.element.toReact(item, this, this)
            }
            let content = item.content ? item.content : item.value
            return <FazNavTabReact key={item.id}
                                   active={item.active}
                                   disabled={item.disabled}
                                   id={item.id}
                                   parent={this}
                                   content={content}
                                   root={this}
                                   link={item.link}
                                   target={item.target}
                                   ariaExpanded={item.ariaExpanded}/>
        })
    }

    beOverMe(event) {
        clearTimeout(this.timeout)
    }

    leaveMe(event) {
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
            this.activeItems.forEach(item => {
                if (item.isDropdown && !this.onEdge) {
                    if (item.previousItem) {
                        item.previousItem.updateState({active: true})
                    }
                    item.deactivate()
                }
            })
        }, 250)
    }

    render() {
        if (this.hasTabs && this.isVertical) {
            return (
                <div onMouseOver={this.beOverMe}
                     onMouseLeave={this.leaveMe}
                     className="faz-nav-container row" id={this.containerId}>
                    <div className="col-3">
                        {this.renderNav()}
                    </div>
                    <div className="col-9">
                        <div className="tab-content">
                            {this.renderTabs()}
                        </div>
                    </div>
                </div>
            )
        }
        return (
            <div onMouseOver={this.beOverMe}
                 onMouseLeave={this.leaveMe}
                 className="faz-nav-container" id={this.containerId}>
                {this.renderNav()}
                {this.hasTabs ?
                    <div className="tab-content">
                        {this.renderTabs()}
                    </div> : ""}
            </div>
        )
    }

    renderNav() {
        return(
            <ul className={this.classNames}
                id={this.state.id}
                aria-orientation={this.orientation} role="tablist">
                {this.renderItems()}
            </ul>
        )
    }

}

Object.assign(FazNavReact, {
    Item: FazNavItemReact,
    Tab: FazNavTabReact
})


export default class FazNavElement extends FazElementItem {
    constructor() {
        super()
    }

    contentLoaded(event) {
        super.contentLoaded(event)
        let reactItem = <FazNavReact id={this.childId} element={this}>
            {this.items.map(item=>item.attributesToProps({}))}
        </FazNavReact>
        ReactDOM.render(reactItem, this)
        this.classList.add("faz-nav-rendered")
    }

    attributesToStates() {
        super.attributesToStates()
        for (let attribute of this.attributes) {
            switch (attribute.name) {
                case "fill":
                    this.reactItem.state['fill'] =
                        attribute.value.toLowerCase() === "true"
                    break
                case "justify":
                    this.reactItem.state['justify'] =
                        attribute.value.toLowerCase()
                    break
                case "pills":
                    this.reactItem.state['pills'] =
                        attribute.value.toLowerCase() === "true"
                    break
                case "vertical":
                    this.reactItem.state['vertical'] =
                        attribute.value.toLowerCase() === "true"
                    break
            }
        }
    }
}


export class FazNavItemElement extends FazElementItem {
    constructor() {
        super()
        this.detach = true
    }

    toReact(props, parent, root) {
        props['parent'] = parent
        if (root) {
            props['root'] = root
        }
        return <FazNavReact.Item key={this.combinedId}
                                 active={props.active}
                                 combinedId={props.combinedId}
                                 disabled={props.disabled}
                                 content={props.content}
                                 element={props.element}
                                 id={props.id}
                                 parent={props.parent}
                                 parentElement={props.parentElement}
                                 root={root}>
            {this.items.map(item=>item.attributesToProps({root: root,
                parent: parent}))}
        </FazNavReact.Item>
    }

    attributesToProps(addProps = []) {
        let props = super.attributesToProps(addProps)
        // Fixing with original nodes and not dropdowns
        if (this.originalNodes.length && !this.items.length) {
            if (this.parentElement.tagName.toLowerCase() === "faz-nav-el") {
                props['content'] = undefined
            }
        }
        let hasTitle = false
        if (this.items.length) {
            this.items.forEach(item => {
                if (item.constructor.name === "FazNavItemTitleElement") {
                    props['content'] = item.innerHTML
                }
            })
        }
        if (hasTitle) {
            console.log(props)
        }
        return props;
    }
}

export class FazNavItemTitleElement extends FazElementItem {
    constructor() {
        super()
        this.detach = true
    }
}


export class FazNavTabElement extends FazElementItem {
    constructor() {
        super()
        this.detach = true
        this.fade = false
        for(let attribute of this.attributes) {
            switch (attribute.name) {
                case "fade":
                    this.fade = attribute.value
                    break
            }
        }
    }

    toReact(props, parent, root) {
        props['parent'] = parent
        if (root) {
            props['root'] = root
        }
        return <FazNavReact.Tab key={this.combinedId}
                                active={props.active}
                                combinedId={props.combinedId}
                                disabled={props.disabled}
                                content={props.content}
                                element={props.element}
                                id={props.id}
                                parent={props.parent}
                                parentElement={props.parentElement}
                                root={root}>
        </FazNavReact.Tab>
    }
}

customElements.define("faz-nav", FazNavElement)
customElements.define("faz-nav-item", FazNavItemElement)
customElements.define("faz-nav-item-content", FazNavItemTitleElement)
customElements.define("faz-nav-tab", FazNavTabElement)
