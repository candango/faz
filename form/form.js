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

import {FazElementItem, FazReactItem} from "../item"
import React from "react"


export class FazFormReact extends FazReactItem {

    defineStates(props) {
        this.values = {}
        this.state['action'] = undefined
        this.state['method'] = "get"
        this.state['type'] = "primary"
        this.state['message'] = undefined
        this.state['errors'] = []
        this.state['valueUpdated'] = 0
        if (props.action) {
            this.state['action'] = props.action
        }
        if (props.method) {
            this.state['method'] = props.method.toLowerCase()
        }
        if (props.message) {
            this.state['message'] = props.message
        }
        if (props.errors) {
            this.state['errors'] = props.errors
        }
        this.from = this.from.bind(this)
        this.to = this.to.bind(this)
    }

    hasValue(index) {
        return this.values[index] !== undefined
    }

    valueIsEmpty(index) {
        if (this.hasValue(index)) {
            return this.values[index] === ""
        }
        return false
    }

    /**
     *
     * @param {String} index
     * @param defaultValue
     */
    from(index, defaultValue="") {
        if(!this.hasValue(index)) {
            this.values[index] = defaultValue
        }
        return this.values[index]
    }

    /**
     *
     * @param {Event} event
     * @param {string} index
     */
    to(event, index) {
        this.values[index] = event.target.value
        this.incrementState(index)
    }

    get prefix() {
        return "faz-form-react"
    }

    get hasMessage() {
        return this.state.message !== "";
    }

    get hasErrors() {
        return this.state.errors.length > 0;
    }

}

export default class FazFormElement extends FazElementItem {

    constructor(props) {
        super(props)
    }

    attributesToStates() {
        super.attributesToStates()
        for (let attribute of this.attributes) {
            switch (attribute.name.toLowerCase()) {
                case "action":
                    this.reactItem.state['action'] = attribute.value
                    break
                case "method":
                    this.reactItem.state['method'] = attribute.value
                    break
                case "active":
                    this.reactItem.state['active'] = attribute.value
                    break
            }
        }
    }
}
