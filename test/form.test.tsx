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
import { allComments} from "../src/test";
import { JSX } from "solid-js/jsx-runtime";
import { render } from "solid-js/web";
import { afterEach, beforeEach, describe, expect, test, vitest } from "vitest";

class TestForm extends FazFormElement {

    public testForm: JSX.Element;

    constructor() {
        super();
    }

    get form(): HTMLFormElement|undefined {
        return this.testForm as HTMLFormElement;
    }

    show() {
        this.testForm = <form></form>;
        render(() => this.testForm, this);
    }
}

customElements.define("test-form", TestForm);

    beforeEach(() => {
        vitest.useFakeTimers();
    });
    afterEach(() => {
        vitest.useRealTimers();
    });

describe("Test Forms", () => {
    test("Form errors", async() => {
        document.body.innerHTML = `
            <test-form>
                <input name="input1" value="1"/>
                <input name="input2" value="2"/>
            </test-form>
        `;
        const [formComment] = allComments(document.body);
        const form = formComment.fazElement() as FazFormElement;
        await vitest.runAllTimersAsync();
        expect(form.hasErrors()).toBeFalsy();
        form.pushError("field1", "error 1");
        form.pushError("field1", "error 1");
        form.pushError("field1", "error 2");
        form.pushError("field2", "errrr 1");
        expect(form.hasErrors()).toBeTruthy();
        expect(form.hasErrorsFor("field1")).toBeTruthy();
        expect(form.hasErrorsFor("field2")).toBeTruthy();
        expect(form.hasErrorsFor("field3")).toBeFalsy();
        expect(form.getErrorsFor("field1").length).toBe(2);
        expect(form.getErrorsFor("field2").length).toBe(1);
        form.clearErrors();
        expect(form.hasErrors()).toBeFalsy();
        expect(form.form).toStrictEqual((form as TestForm).testForm);
        expect(form.values).toStrictEqual({ input1: '1', input2: '2' });
    });
});
