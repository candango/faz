
import { describe, expect, test, vitest, beforeEach, afterEach } from "vitest";
import { FazElement } from "../src/element";

// A simple component to test mutations
class MutationTestElement extends FazElement {
    show() {
        this.style.display = "block";
        this.innerHTML = `<div class="content-root"></div>`;
    }

    get contentChild() {
        return this.querySelector(".content-root") as ChildNode;
    }
}

if (!customElements.get("mutation-test-element")) {
    customElements.define("mutation-test-element", MutationTestElement);
}

describe("MutationObserver (HTMX Compatibility)", () => {
    beforeEach(() => {
        document.body.innerHTML = "";
    });

    test("should detect and move new children added via innerHTML (HTMX append)", async () => {
        document.body.innerHTML = `<mutation-test-element id="parent"></mutation-test-element>`;
        
        // Wait for upgrade
        await new Promise(resolve => setTimeout(resolve, 50));
        const parent = document.getElementById("parent") as MutationTestElement;
        
        parent.innerHTML += `<div id="new-child">I am new</div>`;
        
        // Wait for MutationObserver
        await new Promise(resolve => setTimeout(resolve, 100));

        const newChild = document.getElementById("new-child");
        const contentRoot = parent.querySelector(".content-root");

        expect(newChild?.parentElement).toBe(contentRoot);
    });

    test("should update fazChildren when a FazElement is added", async () => {
        document.body.innerHTML = `<mutation-test-element id="parent"></mutation-test-element>`;
        await new Promise(resolve => setTimeout(resolve, 50));
        const parent = document.getElementById("parent") as MutationTestElement;
        
        const child = document.createElement("mutation-test-element");
        child.id = "child";
        parent.appendChild(child);
        
        // Wait for MutationObserver
        await new Promise(resolve => setTimeout(resolve, 100));

        expect(parent.fazChildren.length).toBe(1);
        expect(parent.fazChildren[0]).toBe(child);
    });

    test("should update fazChildren when a child is removed", async () => {
        document.body.innerHTML = `
            <mutation-test-element id="parent">
                <mutation-test-element id="child"></mutation-test-element>
            </mutation-test-element>
        `;
        await new Promise(resolve => setTimeout(resolve, 50));
        const parent = document.getElementById("parent") as MutationTestElement;
        const child = document.getElementById("child") as MutationTestElement;

        expect(parent.fazChildren.length).toBe(1);

        child.remove();
        
        // Wait for MutationObserver
        await new Promise(resolve => setTimeout(resolve, 100));

        expect(parent.fazChildren.length).toBe(0);
    });
});
