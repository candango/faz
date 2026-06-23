
import {ObservableArray, type} from "can";
import { FazStacheItem } from "../item";
import picklistTemplate from "./stache/picklist.stache";


export default class FazPicklist extends FazStacheItem {
    static view = picklistTemplate;

    static get props() {
        return $.extend(super.props, {
            buffer: {type: String, default: ""},
            displayFilter: {type: Boolean, default: false},
            items: {type: type.convert(ObservableArray), get default() {
                return new ObservableArray([]);
            }},
            filtering: {type: Boolean, default: false},
            filterDelay: {type:Number, default: 300},
            label: {type:String, default: "Type something to filter"},
            filterTimeoutHandler: {type: Number, default: -1},
            overListGroup: {type: Boolean, default: false},
            selectedName: {type: String, default: ""},
            selectedValue: {type: String, default: ""},
            filterCallback: {type: Object },
            innitCallback: {type: Object },
            get hasItems() {
                return this.items.length > 0;
            }

        });
    }

    get idOuterDiv() {
        return this.id + "-div";
    }

    get idInput() {
        return this.id + "-input";
    }

    // afterConnectedCallback() {
    // }

    beforeConnectedCallback() {
    }

    // show() {
    // }

    static get seal() {
        return true;
    }
}

customElements.define("faz-picklist", FazPicklist);
