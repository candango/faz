
import { FazElement } from "./element";
import { bindReactive } from "./reactivity";

 
export class FazFormElement extends FazElement {

    public action: string|undefined;
    public errors!: Record<string, string[]>;
    public method!: string;

    constructor() {
        super();
        const reactiveProps: Partial<this> = {
            action: undefined,
            errors: {},
            method: "get",
        };

        for (const [key, value] of Object.entries(reactiveProps)) {
            bindReactive(this, key as keyof this, value);
        }

        for (const attribute of this.attributes) {
            switch (attribute.name.toLowerCase()) {
                case "action":
                    this.action = attribute.value;
                    break;
                case "method":
                    this.method = attribute.value;
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
        const errors = { ...this.errors };
        if (key in errors) {
            delete errors[key];
        }
        this.errors = errors;
    }

    public clearErrors() {
        this.errors = {};
    }

    public hasErrorsFor(key: string): boolean {
        return key in this.errors && this.errors[key].length > 0;
    }

    public hasErrors(): boolean {
        return Object.values(this.errors).some(errors => errors.length > 0);
    }

    public getErrorsFor(key: string): string[] {
        return this.errors[key] || [];
    }

    public pushError(key: string, value: string) {
        value = value.trim();
        if (value) {
            const errors = { ...this.errors };
            if (!errors[key]) {
                errors[key] = [];
            }
            if (!errors[key].includes(value)) {
                errors[key].push(value);
            }
            this.errors = errors;
        }
    }
}
