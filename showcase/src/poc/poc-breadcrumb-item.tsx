import { FazElement } from "../../../src/element";

export class PocBreadcrumbItem extends FazElement {

    connectedCallback() {
        const contentAttr = this.getAttribute("content");
        if (contentAttr) this.setContent(contentAttr);
        const linkAttr = this.getAttribute("link");
        if (linkAttr) this.setLink(linkAttr);
        super.connectedCallback();
    }

    show() {
        this.classList.add("breadcrumb-item");
        const content = this.content();
        const link = this.link();
        if (content) {
            if (link) {
                this.innerHTML = `<a href="${link}">${content}</a>`;
            } else {
                this.innerHTML = `<span>${content}</span>`;
            }
        }
    }
}

customElements.define("poc-breadcrumb-item", PocBreadcrumbItem);
