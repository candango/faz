import { FazElementItem } from "../src/item";
import { describe, expect, test, jest } from "@jest/globals";
import { screen, waitFor } from "@testing-library/dom";

class TestElement extends FazElementItem {

    public doActiveChanged: boolean = false;
    public doDisabledChanged: boolean = false;

    onActiveChange() {
        this.doActiveChanged = true;
    }

    onDisabledChange() {
        this.doDisabledChanged = true;
    }

    show() {
        const innerDiv = document.createElement("div");
        innerDiv.dataset.testid = "rendered_div_" + this.id;
        this.appendChild(innerDiv);
    }
}

customElements.define("faz-test-element", TestElement);

describe("Test Element", () => {
    const theText = "A text";
    beforeEach(() => {
        jest.useFakeTimers();
    });
    afterEach(() => {
        jest.useRealTimers();
    });
    test("Changed properties", () => {
        document.body.innerHTML = `
            <faz-test-element data-testid="outer_element" id="outer">
                <faz-test-element data-testid="inner_element" id="inner">
                    ${theText}
                </faz-test-element>
            </faz-test-element>
        `;
        const outerElement = screen.queryByTestId(
            "outer_element") as TestElement;
        const innerElement = screen.queryByTestId(
            "inner_element") as TestElement;
        outerElement.active = false;
        outerElement.disabled = true;
        expect(outerElement.doActiveChanged).toBeTruthy();
        expect(outerElement.doDisabledChanged).toBeTruthy();
        expect(innerElement.doActiveChanged).toBeFalsy();
        expect(innerElement.doDisabledChanged).toBeFalsy();
    });
    test("Renderend tag", async () => {
        document.body.innerHTML = `
            <faz-test-element data-testid="outer_element" id="outer">
                <faz-test-element data-testid="inner_element" id="inner">
                    ${theText}
                </faz-test-element>
            </faz-test-element>
        `;
        jest.runAllTimers();
        await waitFor(() => {
            expect(
                screen.queryByTestId("rendered_div_outer")?.tagName
            ).toBe("DIV");
        });
    });
});
