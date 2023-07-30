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
import { render } from "solid-js/web";


export class FazBsAlert extends FazBsElementItem {

    get classNames() {
        let classes = ["alert"];
        if (this.kind()) {
            classes.push(`alert-${this.kind()}`);
        }
        if (this.extraClasses) {
            classes.push(this.extraClasses());
        }
        this.setClasses(classes.join(" "));
        return this.classes();
    }

    show() {
        const role = "alert";
        render(() => <div id={`faz-bs-alert-${this.id}`}
            class={this.classNames} role={role}></div>, this);
        this.classList.add("faz-bs-alert-rendered");
    }
}

customElements.define("faz-bs-alert", FazBsAlert);
