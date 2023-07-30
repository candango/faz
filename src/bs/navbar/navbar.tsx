/**
 * Copyright 2018-2023 Flavio Garcia
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { FazBsElementItem } from "../../bs-item";
import { FazBsNavbarBrand } from "./navbar-brand";
import { FazBsNavbarCollapse } from "./navbar-collapse";
import { render } from "solid-js/web";

 
export default class FazBsNavbarElement extends FazBsElementItem {

    get classNames() {
        let classes = ["navbar"];
        if (this.extraClasses) {
            classes.push(this.extraClasses());
        }
        this.setClasses(classes.join(" "));
        return this.classes();
    }

    get contentChild() {
        return this.children[0].firstChild;
    }

    show() {
        render(() => <nav id={`navbar-${this.id}`} class={this.classNames}
            data-bs-theme="light">
            <div class="container-fluid">
            </div>
        </nav>, this);
    }
}

customElements.define("faz-bs-navbar", FazBsNavbarElement);
customElements.define("faz-bs-navbar-brand", FazBsNavbarBrand);
customElements.define("faz-bs-navbar-collapse", FazBsNavbarCollapse);
