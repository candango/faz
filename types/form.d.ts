import { FazElement } from "./element";
export declare class FazFormElement extends FazElement {
    action: string | undefined;
    errors: Record<string, string[]>;
    method: string;
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