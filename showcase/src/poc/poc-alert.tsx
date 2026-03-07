import { FazElement } from "../../../src/element";

export class PocAlert extends FazElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const contentAttr = this.getAttribute("content");
        if (contentAttr) this.setContent(contentAttr);
        super.connectedCallback();
    }

    show() {
        this.classList.add("alert", "alert-primary");
        this.setAttribute("role", "alert");
        const content = this.content();
        if (content) {
            // Usando innerHTML na POC pra eliminar qualquer dúvida com SolidJS render
            this.innerHTML = `<span>${content}</span>`;
        }
    }
}

customElements.define("poc-alert", PocAlert);
