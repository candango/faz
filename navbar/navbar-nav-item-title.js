
import { FazStacheItem } from "../item";

/**
 *
 *
 * TODO: Check https://www.codeply.com/go/ji5ijk6yJ4 for submenu on hover
 * @constructor
 * @param {Object} event. An object representing a nav item.
 * @param {string} event.value
 */
export default class FazNavbarNavItemTitle extends FazStacheItem {

    static view = `{{content}}`;

    get html() {
        return "";
    }

    beforeConnectedCallback() {
    }

    processData(parent, data) {
        this.content = data.value;
    }
}

customElements.define("faz-navbar-nav-item-title", FazNavbarNavItemTitle);
