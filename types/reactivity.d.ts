/**
 * Binds a SolidJS signal to an object property, making it reactive.
 * This is a decomposed approach that avoids boilerplate and strings-only APIs.
 *
 * @param target The object to define the property on.
 * @param key The key of the property.
 * @param initialValue The initial value for the signal.
 */
export declare function bindReactive<T extends object, K extends keyof T>(target: T, key: K, initialValue: T[K]): void;
//# sourceMappingURL=reactivity.d.ts.map