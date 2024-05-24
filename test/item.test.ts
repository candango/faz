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

import { FazElementItem } from "../src/item"
import { describe, expect, test, jest } from "@jest/globals"
import { screen, waitFor } from "@testing-library/dom"

class TestElement extends FazElementItem {

    public doActiveChanged: boolean = false
    public doDisabledChanged: boolean = false
    public doExtraClassesChanged: boolean = false

    constructor() {
        super()
        // Add an event listener to catch a faz element property change.
        this.addEventListener("activechanged", (_) =>
                              this.doActiveChanged = true)
    }

    // Or override the event method to catch a faz element property change.
    // This is preferred for the end user(developer), if you are creating a
    // component it is preferred to use the addEventListener method.
    onDisabledChange(_: Event) {
        this.doDisabledChanged = true
    }

    onExtraClassesChange(_: Event) {
        this.doExtraClassesChanged = true
    }

    show() {
        const innerDiv = document.createElement("div")
        innerDiv.dataset.testid = "rendered_div_" + this.id
        this.appendChild(innerDiv)
    }
}

customElements.define("faz-test-element", TestElement)

describe("Test Element", () => {
    const theText = "A text"
    beforeEach(() => {
        jest.useFakeTimers()
    })
    afterEach(() => {
        jest.useRealTimers()
    })
    test("Properties changed", async() => {
        document.body.innerHTML = `
            <faz-test-element data-testid="outer_element" id="outer" fazclass="aclass">
                <faz-test-element data-testid="inner_element" id="inner">
                    ${theText}
                </faz-test-element>
            </faz-test-element>
        `
        jest.runAllTimers()
        await waitFor(() => {}).then(() => {
            const outerElement = screen.queryByTestId(
                "outer_element") as TestElement
            const innerElement = screen.queryByTestId(
                "inner_element") as TestElement
            outerElement.active = true
            outerElement.disabled = true
            expect(outerElement.doActiveChanged).toBeTruthy()
            expect(outerElement.doDisabledChanged).toBeTruthy()
            expect(outerElement.doExtraClassesChanged).toBeFalsy()
            outerElement.extraClasses = "aclass"
            expect(outerElement.doExtraClassesChanged).toBeFalsy()
            outerElement.extraClasses = "aclass bclass"
            expect(outerElement.doExtraClassesChanged).toBeTruthy()
            outerElement.doExtraClassesChanged = false
            outerElement.extraClasses = "bclass aclass"
            outerElement.extraClasses = "bclass aclass "
            outerElement.extraClasses = " bclass aclass"
            outerElement.extraClasses = " bclass aclass "
            expect(outerElement.doExtraClassesChanged).toBeFalsy()
            outerElement.extraClasses = "bclass aclass cclass"
            expect(outerElement.doExtraClassesChanged).toBeTruthy()
            outerElement.doExtraClassesChanged = false
            outerElement.pushExtraClass("aclass")
            outerElement.pushExtraClass("bclass ")
            outerElement.pushExtraClass(" cclass")
            outerElement.pushExtraClass(" aclass ")
            expect(outerElement.doExtraClassesChanged).toBeFalsy()
            outerElement.pushExtraClass("eclass")
            expect(outerElement.doExtraClassesChanged).toBeTruthy()
            outerElement.active = false
            outerElement.disabled = false
            expect(innerElement.doActiveChanged).toBeFalsy()
            expect(innerElement.doDisabledChanged).toBeFalsy()
        })
    })

    test("Tag rendered", async () => {
        document.body.innerHTML = `
            <faz-test-element data-testid="outer_element" id="outer">
                <faz-test-element data-testid="inner_element" id="inner">
                    ${theText}
                </faz-test-element>
            </faz-test-element>
        `
        jest.runAllTimers()
        await waitFor(() => {
            expect(
                screen.queryByTestId("rendered_div_outer")?.tagName
            ).toBe("DIV")
        })
    })
})
