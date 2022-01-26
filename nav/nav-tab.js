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

import {FazReactItem} from "../item"
import React from "react"


export default class FazNavTabReact extends FazReactItem {

    processProps(props) {
        super.processProps(props)
        this.previousItem = undefined
        for(let key in props) {
            switch (key) {
                case "fade":
                    this.state['fade'] = props[key]
                    break
                case "parent":
                    this.parent = props[key]
                    let filterMe = this.parent.renderedItems.filter(
                        item => item.hash === this.hash)
                    if (!filterMe.length) {
                        this.parent.renderedItems.push(this)
                    }
                    break
            }
        }
        this.handleClick = this.handleClick.bind(this)
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
        return "faz-nav-tab-content-react"
    }

    get classNames() {
        let classes = ["tab-pane"]
        if (this.state.fade) {
            classes.push("fade")
            if (this.state.active) {
                classes.push("show")
            }
        }
        if (this.state.active) {
            classes.push("anchor")
            classes.push("active")
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
            return super.link
        }
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

    get ariaLabelledby() {
        let labelledby = ""
        this.parent.navItems.forEach((item) => {
            if (this.state.id === item.href) {
                labelledby = item.id
                return
            }
        })
        return labelledby
    }

    render() {
        return <div className={this.classNames} id={this.state.id}
                    role="tabpanel" aria-labelledby={this.ariaLabelledby}>
            {this.content}
        </div>
    }

    handleClick(event) {
        if (this.linkIsVoid && !this.isDropdown) {
            event.preventDefault()
        }
        this.activate()
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
