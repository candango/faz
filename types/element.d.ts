import { FazAttributeRole } from "./element-attributes";
export interface FazComment extends Comment {
    fazElement: FazElement | undefined;
}
export interface FazNode extends ChildNode {
    fazElement: FazElement | undefined;
}
export declare class FazElement extends HTMLElement {
    active: boolean;
    connected: boolean;
    content: string | undefined;
    debug: boolean;
    disabled: boolean | undefined;
    extraClasses: string;
    fazChildren: FazElement[];
    fazElement: FazElement | undefined;
    fazRole: FazAttributeRole;
    idGenerated: boolean;
    loading: boolean;
    parent: FazElement | undefined;
    reload: boolean;
    link: string | undefined;
    childPrefix: string;
    renderedChild: ChildNode | null;
    private comment;
    source: any;
    private observer;
    private isMoving;
    private hostInitialized;
    constructor();
    /**
     * Initialize host DOM attributes after construction.
     *
     * Custom element constructors must not mutate attributes or children.
     * Keep DOM-affecting setup in the connected lifecycle so elements created
     * via document.createElement() can upgrade cleanly in browsers and jsdom.
     */
    private initializeHost;
    /**
     * Checks whether an added node can be safely moved into this element's
     * content container.
     */
    private shouldRemapAddedNode;
    /**
     * Set up a MutationObserver to handle external DOM changes (e.g., HTMX).
     */
    private setupMutationObserver;
    /**
     * Pauses MutationObserver delivery while Faz performs internal render DOM
     * reshaping. This keeps the observer focused on external additions.
     */
    private pauseMutationObserver;
    /**
     * Updates the reactive fazChildren list by scanning current child nodes.
     */
    private updateFazChildren;
    /**
     * The `disconnectedCallback` is a built-in lifecycle method of custom elements.
     * It is called automatically by the browser when the element is removed from the DOM.
     */
    disconnectedCallback(): void;
    /**
     * Custom cleanup method for the component.
     * Implement additional resource or event listener cleanups here as needed.
     * Currently empty.
     */
    disconnect(): void;
    hasExtraClass(value: string): boolean;
    hasExtraClasses(): boolean;
    pushExtraClass(value: string): void;
    resolveLink(): string | undefined;
    addFazChild(child: FazElement): void;
    removeFazChild(child: FazElement): void;
    get activeFazChildren(): FazElement[];
    get contentChild(): ChildNode | null;
    get linkIsVoid(): boolean;
    addChild<T extends Node>(node: T): T;
    afterShow(): void;
    beforeShow(): void;
    collectChildren(): Node[];
    placeBackChildren(children: Node[]): void;
    connectedCallback(): void;
    load(): void;
    show(): void;
    render(): void;
}
//# sourceMappingURL=element.d.ts.map