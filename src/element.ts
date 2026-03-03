
import { FazAttributeRole } from "./element-attributes";
import { randomId, toBoolean } from "./values";
import { Accessor, createSignal, Setter } from "solid-js";

// FazComment extends the standard Comment node to include FazElement reactivity.
export interface FazComment extends Comment {
    fazElement: Accessor <FazElement | undefined>;
    setFazElement: Setter <FazElement | undefined>;
} 

// FazNode extends ChildNode to include FazElement reactivity.
export interface FazNode extends ChildNode {
    fazElement: Accessor <FazElement | undefined>;
    setFazElement: Setter <FazElement | undefined>;
}

// Main FazElement class, extends HTMLElement to provide custom logic and reactivity for web components.
export class FazElement extends HTMLElement {

    // Reactive properties for component state.
    public active: Accessor<boolean>;
    public setActive: Setter<boolean>;
    public connected: Accessor<boolean>;
    public setConnected: Setter<boolean>;
    public content: Accessor<string|undefined>;
    public setContent: Setter<string|undefined>;
    public debug: Accessor<boolean>;
    public setDebug: Setter<boolean>;
    public disabled: Accessor<boolean|undefined>;
    public setDisabled: Setter<boolean|undefined>;
    public extraClasses: Accessor<string>;
    public setExtraClasses: Setter<string>;
    public fazChildren: Accessor<FazElement[]>;
    public setFazChildren: Setter<FazElement[]>;
    public fazElement: Accessor <FazElement | undefined>;
    public setFazElement: Setter <FazElement | undefined>;
    public fazRole: Accessor <FazAttributeRole>;
    public setFazRole: Setter <FazAttributeRole>;
    public idGenerated: boolean = false;
    public loading: Accessor<boolean>;
    public setLoading: Setter<boolean>;
    public parent: Accessor<FazElement | undefined>;
    public setParent: Setter<FazElement | undefined>;
    public reload: Accessor<boolean>;
    public setReload: Setter<boolean>;
    public link: Accessor<string|undefined>;
    public setLink: Setter<string|undefined>;

    // Prefix for children and rendered child tracking.
    public childPrefix: string = "";
    public renderedChild: ChildNode | null = null;
    private comment: FazComment | null = null;
    public source: any;

    // Constructor initializes reactivity, attributes, and default state.
    constructor() {
        super();

        [this.active, this.setActive] = createSignal<boolean>(false);
        [this.connected, this.setConnected] = createSignal<boolean>(false);
        [this.content, this.setContent] = createSignal<string|undefined>(undefined);
        [this.debug, this.setDebug] = createSignal<boolean>(false);
        [this.disabled, this.setDisabled] = createSignal<boolean|undefined>(undefined);
        [this.extraClasses, this.setExtraClasses] = createSignal<string>("");
        [this.fazChildren, this.setFazChildren] = createSignal<FazElement[]>([]);
        [this.fazElement, this.setFazElement] = createSignal<FazElement | undefined>(undefined);
        [this.fazRole, this.setFazRole] = createSignal<FazAttributeRole>(undefined);
        [this.loading, this.setLoading] = createSignal(true);
        [this.parent, this.setParent] = createSignal<FazElement | undefined>(undefined);
        [this.reload, this.setReload] = createSignal(true);
        [this.link, this.setLink] = createSignal<string|undefined>(undefined);

        if (!this.id) {
            this.id = randomId();
            this.idGenerated = true;
        }

        for (const attribute of this.attributes) {
            switch (attribute.name.toLowerCase()) {
                case "active":
                    this.setActive(toBoolean(attribute.value));
                    break;
                case "class":
                case "fazclass":
                case "faz-class":
                    this.setExtraClasses(attribute.value);
                    break;
                case "content":
                    this.setContent(attribute.value);
                    break;
                case "debug":
                    this.setDebug(toBoolean(attribute.value));
                    break;
                case "disabled":
                    this.setDisabled(toBoolean(attribute.value));
                    break;
                case "id":
                case "fazid":
                case "faz-id":
                    this.id = attribute.value;
                    break;
                case "href":
                case "link":
                    this.setLink(attribute.value);
                    break;
                case "role":
                case "fazrole":
                case "faz-role":
                    this.setFazRole(attribute.value as FazAttributeRole);
                    break;
            }
        }

        // Store tag name in dataset for reference.
        this.dataset['faz_element_item'] = this.tagName;
        this.childPrefix = "__child-prefix__";
        // If source is present, remove all child nodes (for virtualized or remote sourced components).
        if (this.source) {
            console.debug(`The element ${this.id}  has a source attribute. All child nodes will be removed.`);
            this.childNodes.forEach((node) => {
                node.remove();
            });
        }
        this.comment = (document.createComment(this.nodeName + " " + this.id) as FazComment);
        [this.comment.fazElement, this.comment.setFazElement] = createSignal<FazElement | undefined>(this);
    }

    /**
     * The `disconnectedCallback` is a built-in lifecycle method of custom elements.
     * It is called automatically by the browser when the element is removed from the DOM.
     */
    disconnectedCallback() {
        if (this.connected()) {
            this.comment?.parentElement?.removeChild(this.comment);
            this.disconnect();
        }
    }

    /**
     * Custom cleanup method for the component.
     * Implement additional resource or event listener cleanups here as needed.
     * Currently empty.
     */
    disconnect() {
    }

    // Check if a specific extra class is present.
    hasExtraClass(value: string): boolean {
        const extraClasses = this.extraClasses().trim().split(" ");
        return extraClasses.find(
            item => item == value.toLowerCase()) !== undefined;
    }

    // Check if any extra classes are present.
    hasExtraClasses(): boolean {
        return this.extraClasses().trim().split(" ").length > 0;
    }

    // Add a new extra class if not already present.
    pushExtraClass(value: string) {
        value = value.trim();
        if (!this.hasExtraClass(value)) {
            const extraClasses = this.extraClasses().trim().split(" ");
            extraClasses.push(value);
            this.setExtraClasses(extraClasses.join(" "));
        }
    }

    // Resolve the link attribute, returning a void href if disabled or missing.
    resolveLink(): string | undefined  {
        // From: https://stackoverflow.com/a/66717705/2887989
        let voidHref = "#!";
        const link = this.link();
        if (this.disabled() || link === undefined || link === "") {
            return voidHref;
        }
        return this.link();
    }

    // Add a FazElement child to the list of reactive children.
    addFazChild(child: FazElement) {
        if (this.fazChildren().indexOf(child) === -1) {
            const children = {...this.fazChildren()} as FazElement[];
            children.push(child);
            this.setFazChildren(children);
        }
    }

    // Remove a FazElement child from the reactive children array.
    removeFazChild(child: FazElement) {
        if (this.fazChildren().indexOf(child) !== -1) {
            const children = {...this.fazChildren()} as FazElement[];
            this.setFazChildren(children.filter(i => i !== child));
        }
    }

    // Get all children that are currently active.
    get activeFazChildren(): FazElement[] {
        return this.fazChildren().filter(child => {
            return child.active();
        })
    }

    // Get the first child node (used as content root).
    get contentChild(): ChildNode | null {
        return this.firstChild;
    }

    // Check if the link attribute is void (should not navigate).
    get linkIsVoid() {
        if (this.disabled()) {
            return true;
        }
        const linkResolved = this.resolveLink();
        return linkResolved === undefined || linkResolved === "" || linkResolved === "#" || linkResolved === "#!";
    }

    // Add a child node to the content container.
    addChild<T extends Node>(node: T): T {
        this.contentChild?.appendChild(node);
        return node;
    }

    // Lifecycle hook, can be overridden by subclasses for logic after showing.
    afterShow():void {}

    // Lifecycle hook, can be overridden by subclasses for logic before showing.
    beforeShow():void {}

    // Remove and collect all children, update fazChildren list.
    collectChildren() { 
        const children:Node[] = [];
        const items: FazElement[] = [];
        if (this.loading()) {
            while(this.firstChild) {
                if (this.firstChild instanceof FazElement) {
                    const item = this.firstChild as FazElement;
                    item.setParent(this as FazElement);
                    items.push(item);
                    item.dataset['parent'] = this.id;
                }
                children.push(this.firstChild);
                this.removeChild(this.firstChild);
            }
            if (items.length > 0) {
                this.setFazChildren(items);
            }
        }
        return children;
    }

    // Place previously collected children back into the DOM.
    placeBackChildren(children: Node[]) {
        if (this.loading()) {
            children.forEach(child => {
                this.addChild(child);
            });
        }
    }

    // Standard web component lifecycle method: called when element is inserted
    // into the DOM.
    connectedCallback() {
        // Insert the comment node as a placeholder.
        if (this.comment){
            this.before(this.comment);
        }
        // Defer rendering and state updates until the next microtask to ensure
        // all child custom elements are upgraded.
        // This is necessary because, during connectedCallback, child elements
        // may not be fully constructed or upgraded yet.
        Promise.resolve().then(()=> {
            if (this.loading()) {
                this.render();
            }
            this.setConnected(true);
            this.setLoading(false);
        });
    }

    // Lifecycle method to be overridden for loading logic.
    load() {}

    // Lifecycle method to be overridden for showing logic.
    show() {}

    // Main render method: load data, prepare, manipulate, and restore children.
    render() {
        this.load();
        this.setAttribute("data-faz-loading", "true");
        this.beforeShow();
        const children = this.collectChildren();
        this.show();
        this.placeBackChildren(children);
        this.afterShow();
        this.removeAttribute("data-faz-loading");
    }
}
