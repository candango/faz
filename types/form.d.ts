import { FazElement } from "./element";
import { Accessor, Setter } from "solid-js";
export declare class FazFormElement extends FazElement {
    action: Accessor<string | undefined>;
    setAction: Setter<string | undefined>;
    errors: Accessor<Record<string, string[]>>;
    setErrors: Setter<Record<string, string[]>>;
    method: Accessor<string>;
    setMethod: Setter<string>;
    constructor();
    get form(): HTMLFormElement | undefined;
    get values(): Record<string, FormDataEntryValue>;
    clearErrorsFor(key: string): void;
    clearErrors(): void;
    hasErrorsFor(key: string): boolean;
    hasErrors(): boolean;
    getErrorsFor(key: string): string[];
    pushError(key: string, value: string): void;
}
//# sourceMappingURL=form.d.ts.map