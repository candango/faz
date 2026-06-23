
import { FazStacheItem, FazStacheItemList } from "../item";
import {default as FazNavbarBrand} from "./navbar-brand";
import {default as FazNavbarNav} from "./navbar-nav";
import navCollapseTemplate from "./stache/navbar-collapse.stache";

/**
 *
 *
 * TODO: Check https://www.codeply.com/go/ji5ijk6yJ4 for submenu on hover
 * @constructor
 * @param {Object} event. An object representing a nav item.
 * @param {string} event.value
 */
export default class FazNavbarCollapse extends FazStacheItem {

    static view = ``;

    static get props() {
        return $.extend(super.props, {
            items: {
                type: FazStacheItemList,
                get default() {
                    return new FazStacheItemList([]);
                }
            }
        });
    }

    get html() {
        let view = navCollapseTemplate;
        return view(this);
    }

    processBrandData(data) {
        let brand = new FazNavbarBrand();
        brand.processData(data);
        return brand;
    }

    processNavData(data) {
        let nav = new FazNavbarNav();
        nav.processData(this, data);
        return nav;
    }

    beforeConnectedCallback() {
        for(let attribute of this.attributes) {
            switch (attribute.name.toLowerCase()) {
                case "id":
                    this.id = attribute.value;
                    break;
            }
        }

        for (let i = 0; i < this.children.length; i++) {
            let child = this.children[i];
            if(child.tagName.toLowerCase().includes("navbar")) {
                this.items.push(child);
                if (child.parent !== undefined) {
                    child.parent = this;
                }
            }
        }
    }

    processData(parent, data) {
        this.parent = parent;
        if(data.id !== undefined) {
            this.id = data.id;
        }
        if (data.items !== undefined) {
            data.items.forEach((item) => {
                switch (item.type.toLowerCase()) {
                    case "faz-navbar-brand":
                        this.items.push(this.processBrandData(item));
                        break;
                    case "faz-navbar-nav":
                        this.items.push(this.processNavData(item));
                        break;
                }
            });
        }
    }
}

customElements.define("faz-navbar-collapse", FazNavbarCollapse);
