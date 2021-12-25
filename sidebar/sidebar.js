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

import {FazElementItem, FazReactItem} from "../item";
import React from 'react'
import ReactDOM from "react-dom"


class FazSidebarReact extends FazReactItem {

    defineStates(props) {
        this.state['type'] = "primary"
        if (props.type) {
            this.state['type'] = props.type.toLowerCase()
        }
    }

    get prefix() {
        return "faz-sidebar-react"
    }

    get classNames() {
        let classes = ["alert"]
        classes.push("alert-" + this.state.type)
        return classes.join(" ")
    }

    render() {
        return (
            <div id={this.state.id}
                className={this.classNames}
                role="alert">{this.content}</div>
        )
    }

}

export default class FazSidebarElement extends FazElementItem {
    constructor(props) {
        super(props)
    }

    beforeLoad() {
        ReactDOM.render(<FazSidebarReact id={this.childId} element={this}/>,
            this)
    }

    attributesToStates() {
        super.attributesToStates();
        for (let attribute of this.attributes) {
            switch (attribute.name) {
                case "type":
                    this.reactItem.state['type'] = attribute.value
                    break
            }
        }
    }

    show() {
        $(this).addClass("faz-sidebar-rendered")
    }
}

customElements.define("faz-sidebar", FazSidebarElement)
