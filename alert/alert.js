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
import parse from "html-react-parser"


class FazAlertReact extends FazReactItem {

    constructor(props) {
        super(props);
        let type = "primary"
        if (props.type!==undefined) {
            type = props.type.toLowerCase()
        }
        if (this.state.element!==undefined) {
            for(let attribute of this.state.element.attributes) {
                switch (attribute.name) {
                    case "type":
                        type = attribute.value;
                        break;
                }
            }
        }
        this.state['type'] = type
    }

    get classNames() {
        let classes = ["alert"]
        classes.push("alert-" + this.state.type)
        return classes.join(" ")
    }

    get content() {
        return this.state.content
    }

    render() {
        let content = parse(this.state.content)
        return (
            <div id={this.state.id}
                className={this.classNames}
                role="alert">{this.content}</div>
        )
    }

}

export default class FazAlertElement extends FazElementItem {
    constructor(props) {
        super(props)
    }

    beforeLoad() {
        let alert = <FazAlertReact id={this.childId} element={this}></FazAlertReact>
        ReactDOM.render(alert, this)
    }

    show() {
        $(this).addClass("faz-alert-rendered")
    }
}

customElements.define("faz-alert", FazAlertElement);
