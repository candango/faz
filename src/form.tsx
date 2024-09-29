/**
 * Copyright 2018-2024 Flavio Garcia
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

 
export class FazFormElement extends FazElementItem {

    public action: Accessor<string|undefined>;
    public setAction: Setter<string|undefined>;
    public errors: Accessor<string[]>;
    public setErrors: Setter<string[]>;
    public method: Accessor<string>;
    public setMethod: Setter<string>;

    constructor() {
        super();
        [this.action, this.setAction] = createSignal<string|undefined>(undefined);
        [this.errors, this.setErrors] = createSignal<string[]>([]);
        [this.method, this.setMethod] = createSignal<string>("get");

        for (const attribute of this.attributes) {
            switch (attribute.name.toLowerCase()) {
                case "action":
                    this.setAction(attribute.value);
                    break;
                case "method":
                    this.setMethod(attribute.value);
                    break;
            }
        }
    }

    hasError(value: string): boolean {
        return this.errors().find(item => item == value) !== undefined;
    }

    hasErrors(): boolean {
        return this.errors().length > 0;
    }

    pushError(value: string) {
        value = value.trim();
        if (!this.hasError(value)) {
            const errors = this.errors();
            errors.push(value);
            this.setErrors(errors);
        }
    }
}
