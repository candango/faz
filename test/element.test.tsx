
import { FazElement } from "../src/element";
import { afterEach, beforeEach, describe, expect, test, vitest } from "vitest";
import { createEffect, createRoot } from "solid-js";
import { render} from "solid-js/web";
import { allComments} from "../src/test";

class TestElement extends FazElement {

    public doActiveChanged: boolean = false;
    public doDisabledChanged: boolean = false;
    public doExtraClassesChanged: boolean = false;

    constructor() {
        super();
        this.disabled = false;
        createRoot(() => {
            createEffect((prevActive) => {
                if (this.active != prevActive) {
                    this.doActiveChanged = true;
                }
            }, false);

            createEffect((prevDisabled) => {
                if (this.disabled != prevDisabled) {
                    this.doDisabledChanged = true;
                }
            }, false);

            createEffect((prevExtraClasses) => {
                if (this.extraClasses != prevExtraClasses) {
                    this.doExtraClassesChanged = true;
                }
            }, "aclass");
        });
    }

    show() {
        render(() => <div id={`faz_test_${this.id}`} data-testid={"rendered_div_" + this.id}></div>, this);
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
            <faz-test-element data-testid="outer_element" id="outer" fazrole="list" fazclass="aclass">
                <faz-test-element data-testid="inner_element" id="inner" faz-role="listitem">
                    ${theText}
                </faz-test-element>
                <faz-test-element data-testid="inner_element1" role="listitem">
                    Another inner
                </faz-test-element>
            </faz-test-element>
        `;
        const comments = allComments(document.body);
        const [outerElementComment, innerElementComment, anotherInnerElementComment] = comments;
        const outerElement = outerElementComment.fazElement as TestElement;
        const innerElement = innerElementComment.fazElement as TestElement;
        const anotherInnerElement = anotherInnerElementComment.fazElement as TestElement;
        outerElement.active = true;
        outerElement.disabled = true;
        expect(outerElement.idGenerated).toBeFalsy();
        expect(innerElement.idGenerated).toBeFalsy();
        expect(anotherInnerElement.idGenerated).toBeTruthy();
        expect(outerElement.fazRole).toBe("list");
        expect(innerElement.fazRole).toBe("listitem");
        expect(anotherInnerElement.fazRole).toBe("listitem");
        expect(outerElement.doActiveChanged).toBeTruthy();
        expect(outerElement.doDisabledChanged).toBeTruthy();
        expect(outerElement.doExtraClassesChanged).toBeFalsy();
        outerElement.extraClasses = "aclass";
        expect(outerElement.doExtraClassesChanged).toBeFalsy();
        outerElement.extraClasses = "aclass bclass";
        expect(outerElement.doExtraClassesChanged).toBeTruthy();
        outerElement.doExtraClassesChanged = false;
        outerElement.extraClasses = "bclass aclass";
        expect(outerElement.doExtraClassesChanged).toBeTruthy();
        outerElement.doExtraClassesChanged = false;
        outerElement.extraClasses = "bclass aclass ";
        expect(outerElement.doExtraClassesChanged).toBeTruthy();
        outerElement.doExtraClassesChanged = false;
        outerElement.extraClasses = " bclass aclass";
        expect(outerElement.doExtraClassesChanged).toBeTruthy();
        outerElement.doExtraClassesChanged = false;
        outerElement.extraClasses = " bclass aclass ";
        expect(outerElement.doExtraClassesChanged).toBeTruthy();
        outerElement.doExtraClassesChanged = false;
        outerElement.extraClasses = "bclass aclass cclass";
        expect(outerElement.doExtraClassesChanged).toBeTruthy();
        outerElement.doExtraClassesChanged = false;
        outerElement.pushExtraClass("aclass");
        outerElement.pushExtraClass("bclass ");
        outerElement.pushExtraClass(" cclass");
        outerElement.pushExtraClass(" aclass ");
        expect(outerElement.doExtraClassesChanged).toBeFalsy();
        outerElement.pushExtraClass("eclass");
        expect(outerElement.doExtraClassesChanged).toBeTruthy();
        outerElement.active = false;
        outerElement.disabled = undefined;
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
        await vitest.runAllTimersAsync();
        const outerElement = document.getElementById("outer") as unknown as FazElement;
        const innerElement = document.getElementById("inner") as unknown as FazElement;
        const outerDiv = outerElement.contentChild;
        const innerDiv = innerElement.contentChild;
        expect(outerElement?.fazChildren.length).toBe(1);
        expect(outerElement?.fazChildren[0]).toBe(innerElement);
        expect(innerElement?.parent).toBe(outerElement);
        expect((outerDiv as unknown as Element).tagName).toBe("DIV");
        expect((innerDiv as unknown as Element).tagName).toBe("DIV");
    });
});
