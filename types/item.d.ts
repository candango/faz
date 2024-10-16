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
import { Accessor, Setter } from "solid-js";
export interface FazComment extends Comment {
    fazElement: Accessor<FazElementItem | undefined>;
    setFazElement: Setter<FazElementItem | undefined>;
}
export interface FazNode extends ChildNode {
    fazElement: Accessor<FazElementItem | undefined>;
    setFazElement: Setter<FazElementItem | undefined>;
}
export declare class FazElementItem extends HTMLElement {
    active: Accessor<boolean>;
    setActive: Setter<boolean>;
    connected: Accessor<boolean>;
    setConnected: Setter<boolean>;
    content: Accessor<string | undefined>;
    setContent: Setter<string | undefined>;
    debug: Accessor<boolean>;
    setDebug: Setter<boolean>;
    disabled: Accessor<boolean>;
    setDisabled: Setter<boolean>;
    extraClasses: Accessor<string>;
    setExtraClasses: Setter<string>;
    fazElement: Accessor<FazElementItem | undefined>;
    setFazElement: Setter<FazElementItem | undefined>;
    fazChildren: Accessor<FazElementItem[]>;
    setFazChildren: Setter<FazElementItem[]>;
    loading: Accessor<boolean>;
    setLoading: Setter<boolean>;
    parent: Accessor<FazElementItem | undefined>;
    setParent: Setter<FazElementItem | undefined>;
    reload: Accessor<boolean>;
    setReload: Setter<boolean>;
    link: Accessor<string | undefined>;
    setLink: Setter<string | undefined>;
    childPrefix: string;
    renderedChild: ChildNode | null;
    private initialOuterHTML;
    private comment;
    source: any;
    constructor();
    hasExtraClass(value: string): boolean;
    hasExtraClasses(): boolean;
    pushExtraClass(value: string): void;
    resolveLink(): string | undefined;
    addFazChild(child: FazElementItem): void;
    removeFazChild(child: FazElementItem): void;
    get activeFazChildren(): FazElementItem[];
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
    cleanFazTag(): void;
}
//# sourceMappingURL=item.d.ts.map