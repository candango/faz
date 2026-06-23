import { FastPocElement } from "./fast-poc-element";

export class PocBreadcrumbItem extends FastPocElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const contentAttr = this.getAttribute("content");
        if (contentAttr) this.content = contentAttr;
        const linkAttr = this.getAttribute("link");
        if (linkAttr) this.link = linkAttr;
        super.connectedCallback();
    }

    show() {
        // Removemos o 'contents' pra ele virar um flex-item de verdade
        this.style.display = "list-item"; 
        this.classList.add("breadcrumb-item");
        
        const content = this.content;
        const link = this.link;
        if (content) {
            this.innerHTML = link ? `<a href="${link}">${content}</a>` : `<span>${content}</span>`;
        }
    }
}

customElements.define("poc-breadcrumb-item", PocBreadcrumbItem);
