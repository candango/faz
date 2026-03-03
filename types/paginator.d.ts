import { Accessor, Setter } from "solid-js";
/**
 * FazPaginator is a pagination utility class built for use with Solid.js
 * reactive primitives.
 * It manages page, block, and record calculations for paginated collections,
 * offering helpers for navigation, state, and boundary conditions.
 */
export declare class FazPaginator {
    count: Accessor<number>;
    setCount: Setter<number>;
    page: Accessor<number>;
    setPage: Setter<number>;
    perBlock: Accessor<number>;
    setPerBlock: Setter<number>;
    perPage: Accessor<number>;
    setPerPage: Setter<number>;
    constructor();
    /**
     * Returns the total number of blocks needed for the current settings.
     */
    get blocks(): number;
    /**
     * Returns the total number of pages based on count and perPage.
     */
    get pages(): number;
    /**
     * Returns a 'safe' current page value, always in the valid range.
     * Adjusts the page if it's out of bounds.
     */
    get safePage(): number;
    /**
     * Returns the current block number (1-based) for the current page.
     */
    get block(): number;
    /**
     * Returns the first page number in the current block.
     */
    get currentFirstPage(): number;
    /**
     * Returns the last page number in the current block.
     * Handles the last block which may have fewer pages.
     */
    get currentLastPage(): number;
    /**
     * Returns the number of pages in the last block.
     */
    get pagesInLastBlock(): number;
    /**
     * Returns an array of page numbers in the current block.
     */
    get blockPages(): number[];
    /**
     * Checks if a given page is the current page.
     * @param page Page number to check
     */
    isCurrentPage(page: number): boolean;
    /**
     * Is the current page the first page?
     */
    get isFirstPage(): boolean;
    /**
     * Is the current block the first block?
     */
    get isFirstBlock(): boolean;
    /**
     * Is the current page the last page?
     */
    get isLastPage(): boolean;
    /**
     * Is the current block the last block?
     */
    get isLastBlock(): boolean;
    /**
     * Does the pagination have multiple pages?
     */
    get hasMultiplePages(): boolean;
    /**
     * Does the pagination have multiple blocks?
     */
    get hasMultipleBlocks(): boolean;
    /**
     * Returns the number of records in the last page.
     */
    get recordsInLastPage(): number;
    /**
     * Returns the absolute index of the first record on the current page.
     */
    get firstRecord(): number;
    /**
     * Returns the absolute index of the last record on the current page.
     */
    get lastRecord(): number;
}
//# sourceMappingURL=paginator.d.ts.map