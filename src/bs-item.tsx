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

import { FazElementItem } from "./item";
import { Accessor, createSignal, Setter } from "solid-js";

export class FazBsElementItem extends FazElementItem {

    public kind: Accessor<string>;
    public setKind: Setter<string>;

    public target: Accessor<string|null>;
    public setTarget: Setter<string|null>;

    public theme: Accessor<string|null>;
    public setTheme: Setter<string|null>;

    constructor() {
        super();
        [this.kind, this.setKind] = createSignal<string>("primary");
        [this.target, this.setTarget] = createSignal<string|null>(null);
        [this.theme, this.setTheme] = createSignal<string|null>(null);
        for (let attribute of this.attributes) {
            switch (attribute.name.toLowerCase()) {
                case "kind":
                    this.setKind(attribute.value.toLowerCase());
                    break;
                case "target":
                    this.setTarget(attribute.value);
                    break;
                case "theme":
                    this.setTheme(attribute.value);
                    break;
            }
        }
    }
}
