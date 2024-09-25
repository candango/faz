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
export declare class FazFormElement extends FazElementItem {
    private _action;
    private _errors;
    private _method;
    constructor();
    get action(): string | null;
    set action(value: string | null);
    onActionChange(event: CustomEvent): void;
    get errors(): Array<string>;
    set errors(value: string);
    hasError(value: string): boolean;
    hasErrors(): boolean;
    pushError(value: string): void;
    get method(): string | null;
    set method(value: string | null);
    onMethodChange(event: CustomEvent): void;
}
//# sourceMappingURL=form.d.ts.map