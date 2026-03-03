
import { Accessor, createSignal, Setter } from "solid-js";

/**
 * FazPaginator is a pagination utility class built for use with Solid.js
 * reactive primitives.
 * It manages page, block, and record calculations for paginated collections,
 * offering helpers for navigation, state, and boundary conditions.
 */
export class FazPaginator {

    // Number of total records/items (reactive getter/setter)
    public count: Accessor<number>;
    public setCount: Setter<number>;

    // Current page number (reactive getter/setter)
    public page: Accessor<number>;
    public setPage: Setter<number>;

    // Number of pages per block (reactive getter/setter)
    public perBlock: Accessor<number>;
    public setPerBlock: Setter<number>;

    // Number of records per page (reactive getter/setter)
    public perPage: Accessor<number>;
    public setPerPage: Setter<number>;

    constructor() {
        [this.count, this.setCount] = createSignal<number>(0);
        [this.page, this.setPage] = createSignal<number>(1);
        [this.perBlock, this.setPerBlock] = createSignal<number>(10);
        [this.perPage, this.setPerPage] = createSignal<number>(10);
    }

    /**
     * Returns the total number of blocks needed for the current settings.
     */
    get blocks(): number {
        const blocksFloor = Math.floor(this.pages / this.perBlock());
        const reminder = this.pages % this.perBlock() > 0 ? 1 : 0;
        return blocksFloor + reminder;
    }

    /**
     * Returns the total number of pages based on count and perPage.
     */
    get pages(): number {
        if (this.count() === 0) {
            return 1;
        }
        const pagesFloor = Math.floor(this.count() / this.perPage());
        let remainder = this.count() % this.perPage();
        remainder = remainder > 0 ? 1 : 0;
        return pagesFloor + remainder;
    }

    /**
     * Returns a 'safe' current page value, always in the valid range.
     * Adjusts the page if it's out of bounds.
     */
    get safePage(): number {
        if (this.page() < 1) {
            this.setPage(1);
        }
        if (this.pages < this.page()) {
            this.setPage(this.pages);
        }
        return this.page();
    }

    /**
     * Returns the current block number (1-based) for the current page.
     */
    get block(): number {
        if (this.safePage <= this.perBlock()) {
            return 1;
        }
        const currentBlockFloor = Math.floor(this.safePage / this.perBlock());
        const remainder = this.safePage % this.perBlock();
        const addRemainder = remainder > 0 ? 1 : 0;
        return currentBlockFloor + addRemainder;
    }

    /**
     * Returns the first page number in the current block.
     */
    get currentFirstPage(): number {
        return (this.block * this.perBlock()) - this.perBlock() + 1;
    }

    /**
     * Returns the last page number in the current block.
     * Handles the last block which may have fewer pages.
     */
    get currentLastPage() {
        if (this.isLastBlock) {
            return this.currentFirstPage + this.pagesInLastBlock - 1;
        }
        return this.block * this.perBlock();
    }
    
    /**
     * Returns the number of pages in the last block.
     */
    get pagesInLastBlock(): number {
        let lastBlockRemainder = this.pages % this.perBlock();
        return lastBlockRemainder > 0 ? lastBlockRemainder : this.perBlock();
    }

    /**
     * Returns an array of page numbers in the current block.
     */
    get blockPages(): number[] {
        let pages = this.isLastBlock ? this.pagesInLastBlock : this.perBlock();
        return Array(pages).fill(undefined).map((_, i) => i + this.currentFirstPage);
    }

    /**
     * Checks if a given page is the current page.
     * @param page Page number to check
     */
    isCurrentPage(page: number): boolean {
        return page === this.safePage;
    }

    /**
     * Is the current page the first page?
     */
    get isFirstPage() {
        return this.safePage === 1
    }

    /**
     * Is the current block the first block?
     */
    get isFirstBlock() {
        return this.block === 1;
    }

    /**
     * Is the current page the last page?
     */
    get isLastPage() {
        return this.safePage >= this.pages;
    }

    /**
     * Is the current block the last block?
     */
    get isLastBlock() {
        return this.block >= this.blocks;
    }

    /**
     * Does the pagination have multiple pages?
     */
    get hasMultiplePages() {
        return this.pages > 1;
    }

    /**
     * Does the pagination have multiple blocks?
     */
    get hasMultipleBlocks() {
        return this.blocks > 1;
    }

    /**
     * Returns the number of records in the last page.
     */
    get recordsInLastPage() {
        let lastPageRemainder = this.count() % this.perPage();
        return lastPageRemainder > 0 ? lastPageRemainder : this.perPage();
    }

    /**
     * Returns the absolute index of the first record on the current page.
     */
    get firstRecord() {
        return (this.safePage * this.perPage()) - this.perPage() + 1;
    }

    /**
     * Returns the absolute index of the last record on the current page.
     */
    get lastRecord() {
        if (this.isLastPage) {
            return this.firstRecord + this.recordsInLastPage - 1;
        }
        return this.safePage * this.perPage();
    }
}
