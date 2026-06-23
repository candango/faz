
import { FazComment } from "./element";

// SEE: https://stackoverflow.com/a/25388984/2887989
export function allComments(context: any): FazComment[] {
    const commentsFound = [];
    const elementPath = [context];
    while (elementPath.length > 0) {
        const el = elementPath.pop();
        for (let i = 0; i < el.childNodes.length; i++) {
            const node = el.childNodes[i];
            if (node.nodeType === Node.COMMENT_NODE) {
                commentsFound.push(node);
            } else {
                elementPath.push(node);
            }
        }
    }
    return commentsFound;
}
