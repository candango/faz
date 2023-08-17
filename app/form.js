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

import { fixture } from "can"
import {default as MainNavbar} from "./main-navbar"
import { FazFormElement, FazFormReact, FazNavbar } from "../faz"
import ReactDOM from "react-dom"
import React from "react"

class FormExampleReact extends FazFormReact {

    defineStates(props) {
        super.defineStates(props)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    get property1Empty() {
        return this.state.property1 === "";
    }

    get property2Empty() {
        return this.state.property2 === "";
    }

    handleSubmit(event) {
        event.preventDefault()
        this.handleResponse({
            data: this.values,
            method: this.state.method,
            url: this.state.action
        })
    }

    render() {
        return (<React.Fragment>
            <h1>Form Example</h1>
            <form method={this.state.method}
                  action={this.state.action}
                  onSubmit={this.handleSubmit}>
                    <div className="card">
                        <h5 className="card-header">Form Example</h5>
                        <div className="card-body">
                            <div className="row">
                                <label className="col-sm-1" htmlFor="property1">
                                    Property 1
                                </label>
                                <div className="col-sm-11">
                                    <input type="text" className="form-control"
                                           id="property1" name="property1"
                                           aria-describedby="property1"
                                           placeholder="Enter property 1"
                                           value={this.from("property1")}
                                           onChange={(event => this.to(event,
                                               "property1"))}/>
                                    <small id="property1Help"
                                           className="form-text text-muted">
                                        {this.valueIsEmpty("property1") ?
                                            "Here we add property 1." :
                                            <span className="placeholder"/>}
                                    </small>
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label className="col-sm-1" htmlFor="property2">
                                    Property 2
                                </label>
                                <div className="col-sm-11">
                                    <input type="number"
                                           className="form-control"
                                           id="property2"
                                           name="property2"
                                           aria-describedby="property2"
                                           placeholder="Enter property 2"
                                           value={this.from("property2")}
                                           onChange={(event => this.to(event,
                                               "property2"))}/>
                                    <small id="property2Help"
                                           className="form-text text-muted">
                                        {this.valueIsEmpty("property2") ?
                                            "Here we add property 2." :
                                            <span className="placeholder"/>}
                                    </small>
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label className="col-sm-1" htmlFor="property2">
                                    Property 2
                                </label>
                                <div className="col-sm-11">
                                    <select className="form-select"
                                            aria-label="Default select example"
                                            aria-describedby="property3"
                                            id="property3"
                                            name="property3"
                                            value={this.from("property3", 3)}
                                            onChange={(event => this.to(event,
                                                "property3"))}
                                        >
                                        <option value="">Open this select menu
                                        </option>
                                        <option value="1">One</option>
                                        <option value="2">Two</option>
                                        <option value="3">Three</option>
                                    </select>

                                    <small id="property3Help"
                                           className="form-text text-muted">
                                        {this.valueIsEmpty("property3") ?
                                            "Here we select property 3." :
                                            <span className="placeholder"/>}
                                    </small>
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary">
                                Save
                            </button>
                        </div>
                    </div>
            </form>
            </React.Fragment>
        )
    }
}


export default class FormExample extends FazFormElement {

    show() {
        ReactDOM.render(<FormExampleReact id={this.childId} element={this}/>,
            this)
    }

}

export let SearchFixture = fixture(
    { method: 'post', url: '/form/action' },
    (request, response, headers, ajaxSettings) => {
        alert(JSON.stringify(request.data))
    }
)

customElements.define("form-example", FormExample)
