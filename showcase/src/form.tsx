
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
