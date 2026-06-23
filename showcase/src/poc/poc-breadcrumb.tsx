import { FastPocElement } from "./fast-poc-element";

export class PocBreadcrumb extends FastPocElement {
    private itemOl: HTMLElement | null = null;

    get contentChild() {
        return (this.itemOl as unknown as ChildNode) || this.firstChild;
    }

    show() {
        this.innerHTML = `
            <nav aria-label="breadcrumb">
                <ol class="breadcrumb"></ol>
            </nav>
        `;
        this.itemOl = this.querySelector("ol");
    }
}

customElements.define("poc-breadcrumb", PocBreadcrumb);
