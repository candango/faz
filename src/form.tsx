/**
 * Copyright 2018-2025 Flavio Garcia
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

import { FazElement } from "./element";
import { Accessor, createSignal, Setter } from "solid-js";

 
export class FazFormElement extends FazElement {

    public action: Accessor<string|undefined>;
    public setAction: Setter<string|undefined>;
    public errors: Accessor<Record<string, string[]>>;
    public setErrors: Setter<Record<string, string[]>>;
    public method: Accessor<string>;
    public setMethod: Setter<string>;

    constructor() {
        super();
        [this.action, this.setAction] = createSignal<string|undefined>(undefined);
        [this.errors, this.setErrors] = createSignal<Record<string, string[]>>({});
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
    
    get form(): HTMLFormElement|undefined {
        return undefined
    }

    get values(): Record<string, FormDataEntryValue> {
        const values: Record<string, FormDataEntryValue> = {};
        if (this.form === undefined) {
            return values;
        }
        const formData = new FormData(this.form);
        for (const [key, value] of formData.entries()) {
            values[key] = value;
        }
        return values;
    }

    public clearErrorsFor(key: string) {
        const errors = { ...this.errors() };
        if (key in errors) {
            delete errors[key];
        }
        this.setErrors(errors);
    }

    public clearErrors() {
        this.setErrors({});
    }

    public hasErrorsFor(key: string): boolean {
        return key in this.errors() && this.errors()[key].length > 0;
    }

    public hasErrors(): boolean {
        return Object.values(this.errors()).some(errors => errors.length > 0);
    }

    public getErrorsFor(key: string): string[] {
        return this.errors()[key] || [];
    }

    public pushError(key: string, value: string) {
        value = value.trim();
        if (value) {
            const errors = { ...this.errors() };
            if (!errors[key]) {
                errors[key] = [];
            }
            if (!errors[key].includes(value)) {
                errors[key].push(value);
            }
            this.setErrors(errors);
        }
    }
}
