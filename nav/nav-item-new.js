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

import {default as ID} from "../id"
import {FazElementItem, FazReactItem} from "../item";
import React from 'react'
import ReactDOM from "react-dom"
import toPairs from "lodash/toPairs";
import includes from "lodash/includes";
import fromPairs from "lodash/fromPairs";


export default class FazNavItemReact extends FazReactItem {

    processProps(props) {
        super.processProps(props)
        this.previousItem = undefined
        for(let key in props) {
            switch (key) {
                case "parent":
                    this.parent = props[key]
                    let filterMe = this.parent.renderedItems.filter(
                        item => item.hash === this.hash)
                    if(!filterMe.length){
                        this.parent.renderedItems.push(this)
                    }
                    break
                case "root":
                    this.root = props[key]
                    break
            }
        }
        this.handleClick = this.handleClick.bind(this)
    }

    get isDropdown() {
        return this.state.items.length > 0
    }

    get isRoot() {
        return this.parent === this.root
    }

    defineStates(props) {
        super.defineStates(props)
        if (this.element) {
            let elementProps = []
            for (let attribute of this.element.attributes) {
                if (attribute.name.toLowerCase() !== "id") {
                    elementProps[attribute.name.toLowerCase()] =
                        attribute.value.toLowerCase()
                }
            }
        }
    }

    get hasTabs() {
        return !!this.state.tabs.length;
    }

    get orientation() {
        return this.state.vertical ? "vertical" : undefined
    }

    get prefix() {
        return "faz-nav-react"
    }

    get classNames() {
        let classes = []
        if(this.isRoot) {
            classes.push("nav-item")
            if (this.isDropdown) {
                classes.push("dropdown")
            }
        } else {
            if (this.isDropdown) {
                classes.push("dropdown-submenu")
            }
        }
        return classes.join(" ")
    }

    get linkClassNames() {
        let classes = ["nav-link"]

        if (!this.isRoot) {
            classes.pop()
            classes.push("dropdown-item")
        }

        if (this.state.active && !this.state.disabled) {
            classes.push("active")
        }
        if (this.state.disabled) {
            classes.push("disabled")
        }
        if (this.isDropdown) {
            classes.push("dropdown-toggle")
        }
        return classes.join(" ")
    }

    get dropdownClassNames() {
        let classes = ["dropdown-menu"]
        if (this.state.active && !this.state.disabled) {
            classes.push("show")
        }
        return classes.join(" ")
    }

    get containerId() {
        return "faz-nav-item-container-".concat(this.state.id)
    }

    get link() {
        if(!this.isDropdown) {
            return super.link;
        }
    }

    renderItems() {
        return <ul className={this.dropdownClassNames}>
            {this.state.items.map((item) => {
                return <FazNavItemReact key={item.id}
                                        active={item.active}
                                        disabled={item.disabled}
                                        id={item.id}
                                        parent={this}
                                        content={item.value}
                                        root={this.root}
                                        items={item.items}
                                        link={item.link}
                                        target={item.target}
                />
            })}
        </ul>
    }

    get role() {
        if (this.isDropdown && this.isRoot) {
            return "button"
        }
        if (!this.isDropdown && !this.isRoot) {
            return "tab"
        }
    }

    get dataBsToggle() {
        if (this.isDropdown && this.isRoot) {
            return "dropdown"
        }
    }

    get ariaExpanded() {
        if (this.isDropdown) {
            return this.state.active
        }
    }

    render() {
        return (
            <li className={this.classNames} id={this.containerId}>
                <a id={this.state.id} className={this.linkClassNames}
                   role={this.role} target={this.state.target} href={this.link}
                   onClick={(event) => {this.handleClick(event)}}
                   aria-expanded={this.ariaExpanded}
                   data-bs-toggle={this.dataBsToggle}
                >{this.content}</a>
                {this.isDropdown ? this.renderItems() : ""}
            </li>
        )
    }

    handleClick(event) {
        if (this.linkIsVoid && !this.isDropdown) {
            event.preventDefault()
        }
        this.activate()
    }

    afterMount() {
        super.afterMount();
        if(this.isDropdown) {
            console.log(ReactDOM.findDOMNode(this))
        }
    }

    get activeItems() {
        return this.renderedItems.filter(item => {
            return item.state.active
        })
    }

    setDisabled(value) {
        let items = this.parent.state.items
        items.filter((item) => item.id === this.state.id).forEach((item)=> {
            item.disabled = value
        })
        this.parent.updateState({items: items})
    }

    activate() {
        this.parent.activeItems.forEach((item)=> {
            this.previousItem = item
            item.deactivate()
        })
        this.updateState({active: true})
    }

    deactivate() {
        this.previousItem = undefined
        this.updateState({active: false})
        this.renderedItems.forEach((item)=> {
            item.deactivate()
        })
    }
}
