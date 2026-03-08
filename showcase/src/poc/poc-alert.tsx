import { FastPocElement } from "./fast-poc-element";

export class PocAlert extends FastPocElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const contentAttr = this.getAttribute("content");
        if (contentAttr) this.content = contentAttr;
        super.connectedCallback();
    }

    show() {
        // Restauramos o display pra que as classes do Bootstrap funcionem no host
        this.style.display = "block"; 
        this.classList.add("alert", "alert-primary");
        this.setAttribute("role", "alert");
        
        const content = this.content;
        if (content) {
            this.innerHTML = `<span>${content}</span>`;
        }
    }
}

customElements.define("poc-alert", PocAlert);
