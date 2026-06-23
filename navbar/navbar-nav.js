
import { FazStacheItem, FazStacheItemList} from "../item";
import navTemplate from "./stache/navbar-nav.stache";
import FazNavbarNavItem from "./navbar-nav-item";

/**
 *
 *
 * TODO: Check https://www.codeply.com/go/ji5ijk6yJ4 for submenu on hover
 * @constructor
 * @param {Object} event. An object representing a nav item.
 * @param {string} event.value
 */
export default class FazNavbarNav extends FazStacheItem {
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
        return navTemplate(this);
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
                if (child.isRoot !== undefined) {
                    child.isRoot = true;
                    child.setRoot(this);
                }
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
                let navbarNavItem = new FazNavbarNavItem();
                navbarNavItem.processData(this, item, this, true);
                this.items.push(navbarNavItem);
            });
        }
    }
}

customElements.define("faz-navbar-nav", FazNavbarNav);
