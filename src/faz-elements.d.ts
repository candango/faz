import {FazElement} from ".";

interface FazElementAttributes extends HTMLAttributes<T> {
    fazid?: string;
    active?: boolean;
    connected?: boolean;
    content?: string;
    debug?: boolean;
    disabled?: boolean;
    extraClasses?: string;
    fazChildren?: FazElement[];
    loading?: boolean;
    parent?: FazElement;
    reload?: boolean;
    link?: string;
}
