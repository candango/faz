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

import { FazFormElement } from "../../src";
import { Accessor, createSignal, JSX, Setter } from "solid-js";
import { MountableElement, render } from "solid-js/web";
import { fakeServer, FakeXMLHttpRequest } from "nise";

const server = fakeServer.create();
import axios from "axios";


server.autoRespond = true;
server.respondWith("GET", "/sometest", function(xhr: FakeXMLHttpRequest) {
    xhr.respond(
        200,
        { "Content-Type": "application/json" },
        '{"id":1}',
    );
});
server.respondWith("GET", "/sometest1", function(xhr: FakeXMLHttpRequest) {
    xhr.respond(
        200,
        { "Content-Type": "application/json" },
        '{"id":2}',
    );
});


export class FormExample extends FazFormElement {

    constructor(){
        super();
    }

    show() {
        render(() => <div><form></form></div>, this);
        return;
    }
}

axios.get("/sometest").then(function (response) {
    console.log(response);
}).catch(function(error){
    console.log(error);
});

axios.get("/sometest1").then(function (response) {
    console.log(response);
}).catch(function(error){
    console.log(error);
});
customElements.define("faz-form-example", FormExample);
