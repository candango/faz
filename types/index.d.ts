// See: https://cutt.ly/RwyeQ7ZT

export { randomId } from "../src/id.tsx";
export { FazFormElement } from "../src/form.tsx";
export { FazElementItem } from "../src/item.tsx";

interface FazElementItem extends HTMLElement {
    fazid: string;
}

interface FazElementItemAttributes extends HTMLAttributes<T> {
    fazid?: string;
}

interface FazNavElement extends FazElementItem {
}

declare global {
    declare module "solid-js" {
        namespace JSX {
            interface IntrinsicElements {
                'faz-nav': FazElementItemAttributes<FazNavElement>;
                'faz-nav-item': HTMLDivElement;
            }
        }
    }
}
