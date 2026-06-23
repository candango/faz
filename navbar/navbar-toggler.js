
import { FazStacheItem } from "../item";
import navbarTogglerTemplate from "./stache/navbar-toggler.stache";

/**
 *
 * @constructor
 * @param {Object} event. An object representing a nav item.
 * @param {string} event.value
 */
export default class FazNavbarToggler extends FazStacheItem {

    static view = ``;

    static get props() {
        return $.extend(super.props, {
            target: {type: String, default: ""},
            label: {type: String, default: ""},
            value: String
        });
    }

    get html() {
        let view = navbarTogglerTemplate;
        return view(this);
    }

    get dataTarget() {
        return "#" + this.target;
    }

    process() {
        for(let attribute of this.attributes) {
            switch (attribute.name.toLowerCase()) {
                case "id":
                    this.id = attribute.value;
                    break;
                case "href":
                    this.href = attribute.value;
                    break;
                case "label":
                    this.label = attribute.value;
                    break;
                case "target":
                    this.target = attribute.value;
                    break;
            }
        }
    }

    beforeConnectedCallback() {
        this.process();
        this.parent = this.parentElement;
    }

    processData(data) {
        this.content = data.value;
        if(data.id !== undefined) {
            this.id = data.id;
        }
        if(data.href !== undefined) {
            this.href = data.href;
        }
        if(data.label !== undefined) {
            this.label = data.label;
        }
        if(data.target !== undefined) {
            this.target = data.target;
        }
        if(data.value !== undefined) {
            this.content = data.value;
        }
    }
}

customElements.define("faz-navbar-toggler", FazNavbarToggler);
