
import { FazElement } from "../../src/element";

class CustomTag extends FazElement {
    
    constructor() {
        super();
    }

}

customElements.define("custom-tag", CustomTag);
