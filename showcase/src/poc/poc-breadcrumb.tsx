import { FazElement } from "../../../src/element";

export class PocBreadcrumb extends FazElement {
    private itemOl: HTMLElement | null = null;

    get contentChild() {
        return this.itemOl as ChildNode;
    }

    show() {
        this.innerHTML = `<nav aria-label="breadcrumb"><ol class="breadcrumb"></ol></nav>`;
        this.itemOl = this.querySelector("ol");
    }
}

customElements.define("poc-breadcrumb", PocBreadcrumb);
