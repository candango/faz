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

import { FazFormElement } from "../src/form";
import { describe, expect, test } from "vitest";
import { allComments } from "../src/test";

class TestForm extends FazFormElement {

    constructor() {
        super();
    }
}

customElements.define("test-form", TestForm);


describe("Test Forms", () => {
    test("Form errors", () => {
        document.body.innerHTML = `
            <test-form>
            </test-form>
        `;
        const [formComment] = allComments(document.body);
        const form = formComment.fazElement() as FazFormElement;
        expect(form.hasErrors()).toBeFalsy();
        form.pushError("field1", "error 1");
        form.pushError("field1", "error 1");
        form.pushError("field1", "error 2");
        form.pushError("field2", "errrr 1");
        expect(form.hasErrors()).toBeTruthy();
        expect(form.hasErrorsFor("field1")).toBeTruthy();
        expect(form.hasErrorsFor("field2")).toBeTruthy();
        expect(form.hasErrorsFor("field3")).toBeFalsy();
        expect(form.getErrorsFor("field1").length == 2).toBeTruthy();
        expect(form.getErrorsFor("field2").length == 1).toBeTruthy();
        form.clearErrors();
        expect(form.hasErrors()).toBeFalsy();

    });
});
