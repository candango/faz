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

export class FazBsNavbarToggler extends FazBsElementItem {

    constructor() {
        super();
    }

    get classNames() {
        let classes = ["collapse navbar-collapse"];
        this.setClasses(classes.join(" "));
        return this.classes();
    }

    show() {
        render(() => <button class="navbar-toggler"
            id={`faz-bs-navbar-toggler-${this.id}`}
            data-bs-toggle="collapse"
            data-bs-target={`#navbar-collapse-${this.target()}`}>    
        </button> , this);
    }
}
