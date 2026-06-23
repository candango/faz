
import { ObservableObject } from "can";
import {FazStacheItem} from "../item";
import { FazNavbar } from "../faz";
import mainNavbarTemplate from "./stache/main-navbar.stache";

export default class MainNavbar extends FazStacheItem{
    static view = mainNavbarTemplate;

    static get props() {
        return $.extend(super.props, {
            data: ObservableObject
        });
    }

    static get seal() {
        return true;
    }
}

customElements.define("main-navbar", MainNavbar);
