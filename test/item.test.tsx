/**
 * Copyright 2018-2024 Flavio Garcia
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

import { FazElementItem, FazNode } from "../src/item";
import { afterEach, beforeEach, describe, expect, test, vitest } from "vitest";
import { waitFor } from "@testing-library/dom";
import { createEffect, createRoot } from "solid-js";
import { render} from "solid-js/web";
import { allComments } from "../src/test";

class TestElement extends FazElementItem {

    public doActiveChanged: boolean = false;
    public doDisabledChanged: boolean = false;
    public doExtraClassesChanged: boolean = false;

    constructor() {
        super();
        createRoot(() => {
            createEffect((prevActive) => {
                if (this.active() != prevActive) {
                    this.doActiveChanged = true;
                }
            }, false);

            createEffect((prevDisabled) => {
                if (this.disabled() != prevDisabled) {
                    this.doDisabledChanged = true;
                }
            }, false);

            createEffect((prevExtraClasses) => {
                if (this.extraClasses() != prevExtraClasses) {
                    this.doExtraClassesChanged = true;
                }
            }, "aclass");
        });
    }

    show() {
        render(() => {
            return <div id={`faz_test_${this.id}`} data-testid={"rendered_div_" + this.id}></div>
        }, this);
    }
}

customElements.define("faz-test-element", TestElement);

describe("Test Element", () => {
    const theText = "A text";
    beforeEach(() => {
        vitest.useFakeTimers();
    });
    afterEach(() => {
        vitest.useRealTimers();
    });
    test("Properties changed", () => {
        document.body.innerHTML = `
            <faz-test-element data-testid="outer_element" id="outer" fazclass="aclass">
                <faz-test-element data-testid="inner_element" id="inner">
                    ${theText}
                </faz-test-element>
            </faz-test-element>
        `;
        const comments = allComments(document.body);
        const [outerElementComment, innerElementComment] = comments;
        const outerElement = outerElementComment.fazElement() as TestElement;
        const innerElement = innerElementComment.fazElement() as TestElement;

        outerElement.setActive(true);
        outerElement.setDisabled(true);
        expect(outerElement.doActiveChanged).toBeTruthy();
        expect(outerElement.doDisabledChanged).toBeTruthy();
        expect(outerElement.doExtraClassesChanged).toBeFalsy();
        outerElement.setExtraClasses("aclass");
        expect(outerElement.doExtraClassesChanged).toBeFalsy();
        outerElement.setExtraClasses("aclass bclass");
        expect(outerElement.doExtraClassesChanged).toBeTruthy();
        outerElement.doExtraClassesChanged = false;
        outerElement.setExtraClasses("bclass aclass");
        expect(outerElement.doExtraClassesChanged).toBeTruthy();
        outerElement.doExtraClassesChanged = false;
        outerElement.setExtraClasses("bclass aclass ");
        expect(outerElement.doExtraClassesChanged).toBeTruthy();
        outerElement.doExtraClassesChanged = false;
        outerElement.setExtraClasses(" bclass aclass");
        expect(outerElement.doExtraClassesChanged).toBeTruthy();
        outerElement.doExtraClassesChanged = false;
        outerElement.setExtraClasses(" bclass aclass ");
        expect(outerElement.doExtraClassesChanged).toBeTruthy();
        outerElement.doExtraClassesChanged = false;
        outerElement.setExtraClasses("bclass aclass cclass");
        expect(outerElement.doExtraClassesChanged).toBeTruthy();
        outerElement.doExtraClassesChanged = false;
        outerElement.pushExtraClass("aclass");
        outerElement.pushExtraClass("bclass ");
        outerElement.pushExtraClass(" cclass");
        outerElement.pushExtraClass(" aclass ");
        expect(outerElement.doExtraClassesChanged).toBeFalsy();
        outerElement.pushExtraClass("eclass");
        expect(outerElement.doExtraClassesChanged).toBeTruthy();
        outerElement.setActive(false);
        outerElement.setDisabled(false);
        expect(innerElement.doActiveChanged).toBeFalsy();
        expect(innerElement.doDisabledChanged).toBeFalsy();
    });

    test("Tag rendered", async () => {
        document.body.innerHTML = `
            <faz-test-element data-testid="outer_element" id="outer">
                <faz-test-element data-testid="inner_element" id="inner">
                    ${theText}
                </faz-test-element>
            </faz-test-element>
        `;
        vitest.runAllTimers();
        await waitFor(() => {
            const outerDiv = document.getElementById("faz_test_outer") as unknown as FazNode;
            const innerDiv = document.getElementById("faz_test_inner") as unknown as FazNode;
            const outerElement = outerDiv.fazElement();
            const innerElement = innerDiv.fazElement();
            expect(outerElement?.fazChildren().length).toBe(1);
            expect(outerElement?.fazChildren()[0]).toBe(innerElement);
            expect(innerElement?.parent()).toBe(outerElement);
            expect((outerDiv as unknown as Element).tagName).toBe("DIV");
        });
    });
});
