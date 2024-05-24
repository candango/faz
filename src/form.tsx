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

import { FazElementItem } from "./item"

 
export class FazFormElement extends FazElementItem {

    private _action: string|null = null
    private _errors: Array<string> = new Array()
    private _method: string|null = null

    constructor() {
        super()
        for (const attribute of this.attributes) {
            switch (attribute.name.toLowerCase()) {
                case "action":
                    this._action = attribute.value
                    break
                case "method":
                    this._method = attribute.value
                    break
            }
        }
    }

    get action(): string | null {
        return this._action
    }

    set action(value: string | null) {
        if (this._action !== value) {
            const oldValue = this._action
            this._action = value
            if (!this.loading) {
                const event = this.createEvent("actionchanged", value,
                                               oldValue)
                this.dispatchEvent(event)
                this.onActionChange(event)
            }
        }
    }

    onActionChange(event: CustomEvent) {}

    get errors(): Array<string> {
        return this._errors
    }

    set errors(value: Array<string>) {
        if (this._action !== value) {
            const oldValue = this._action
            this._action = value
            if (!this.loading) {
                const event = this.createEvent("actionchanged", value,
                                               oldValue)
                this.dispatchEvent(event)
                this.onActionChange(event)
            }
        }
    }

    hasError(value: string): boolean {
        return this.errors.find(item => item == value) !== undefined
    }

    hasErrors(): boolean {
        return this.errors.length > 0
    }


    pushError(value: string) {
        if (!this.hasError(value)) {
            const oldValue = this.errors
            this.errors.push(value)
            if (!this.loading) {
                const event = this.createEvent("errorschanged", this.errors,
                                               oldValue)
                this.dispatchEvent(event)
                this.onActionChange(event)
            }
        }
    }

    get method(): string | null {
        return this._method
    }

    set method(value: string | null) {
        if (this._method !== value) {
            const oldValue = this._method
            this._method = value
            if (!this.loading) {
                const event = this.createEvent("methodchanged", value,
                                               oldValue)
                this.dispatchEvent(event)
                this.onActionChange(event)
            }
        }
    }

    onMethodChange(event: CustomEvent) {}
}
