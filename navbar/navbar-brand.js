
import {FazStacheItem} from "../item";

import navbarBrandTemplate from "./stache/navbar-brand.stache";


/**
 *
 *
 * TODO: Check https://www.codeply.com/go/ji5ijk6yJ4 for submenu on hover
 * @constructor
 * @param {Object} event. An object representing a nav item.
 * @param {string} event.value
 */
export default class FazNavbarBrand extends FazStacheItem {

    static view = ``;

    static get props() {
        return $.extend(super.props, {
            buga: {type: String, default: ""}
        });
    }

    get html() {
        let view = navbarBrandTemplate;
        return view(this);
    }

    beforeConnectedCallback() {
        for(let attribute of this.attributes) {
            switch (attribute.name) {
                case "id":
                    this.id = attribute.value;
                    break;
                case "href":
                    this.href = attribute.value;
                    break;
            }
        }
    }

    processData(data) {
        this.content = data.value;
        if(data.id !== undefined) {
            this.id = data.id;
        }
        if(data.href !== undefined) {
            this.href = data.href;
        }
    }

}

customElements.define("faz-navbar-brand", FazNavbarBrand);
