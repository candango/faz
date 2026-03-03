
import { FazPaginator } from "../src/paginator";
import { describe, expect, test } from "vitest";

describe("Test Paginator", () => {
    test("One page", () => {
        const paginator = new FazPaginator();
        paginator.setCount(10)
        expect(paginator.pages).toBe(1);
        expect(paginator.blocks).toBe(1);

        expect(paginator.page()).toBe(1);
        expect(paginator.safePage).toBe(1);
        expect(paginator.block).toBe(1);
        expect(paginator.isLastPage).toBeTruthy();
        expect(paginator.isLastBlock).toBeTruthy();
        paginator.setPage(0)
        expect(paginator.safePage).toBe(1);
        expect(paginator.page()).toBe(1);
        expect(paginator.isLastPage).toBeTruthy();
        expect(paginator.isLastBlock).toBeTruthy();
        expect(paginator.firstRecord).toBe(1);
        expect(paginator.lastRecord).toBe(10);
        expect(paginator.recordsInLastPage).toBe(10);
        paginator.setPage(2)
        expect(paginator.safePage == 2).toBeFalsy();
        expect(paginator.page() == 2).toBeFalsy();
        expect(paginator.safePage).toBe(1);
        expect(paginator.page()).toBe(1);
        expect(paginator.block).toBe(1);
        expect(paginator.hasMultiplePages).toBeFalsy();
        expect(paginator.hasMultipleBlocks).toBeFalsy();
        expect(paginator.isLastPage).toBeTruthy();
        expect(paginator.isLastBlock).toBeTruthy();
        expect(paginator.pagesInLastBlock).toBe(1);
        expect(paginator.firstRecord).toBe(1);
        expect(paginator.lastRecord).toBe(10);
        expect(paginator.recordsInLastPage).toBe(10);
    });
    test("More than one page, one block", () => {
        const paginator = new FazPaginator();
        paginator.setCount(91)
        expect(paginator.blocks).toBe(1);
        expect(paginator.pages).toBe(10);

        expect(paginator.page()).toBe(1);
        expect(paginator.safePage).toBe(1);
        expect(paginator.block).toBe(1);
        expect(paginator.isFirstPage).toBeTruthy();
        expect(paginator.isLastPage).toBeFalsy();
        expect(paginator.isLastBlock).toBeTruthy();
        expect(paginator.firstRecord).toBe(1);
        expect(paginator.lastRecord).toBe(10);
        paginator.setPage(2)
        expect(paginator.safePage).toBe(2);
        expect(paginator.page()).toBe(2);
        expect(paginator.block).toBe(1);
        expect(paginator.isFirstPage).toBeFalsy();
        expect(paginator.isLastPage).toBeFalsy();
        expect(paginator.isLastBlock).toBeTruthy();
        expect(paginator.firstRecord).toBe(11);
        expect(paginator.lastRecord).toBe(20);
        paginator.setPage(8)
        expect(paginator.safePage).toBe(8);
        expect(paginator.page()).toBe(8);
        expect(paginator.block).toBe(1);
        expect(paginator.isFirstPage).toBeFalsy();
        expect(paginator.isLastPage).toBeFalsy();
        expect(paginator.isLastBlock).toBeTruthy();
        expect(paginator.hasMultiplePages).toBeTruthy();
        expect(paginator.hasMultipleBlocks).toBeFalsy();
        expect(paginator.firstRecord).toBe(71);
        expect(paginator.lastRecord).toBe(80);
        paginator.setPage(10)
        expect(paginator.isFirstPage).toBeFalsy();
        expect(paginator.isLastPage).toBeTruthy();
        expect(paginator.isLastBlock).toBeTruthy();
        expect(paginator.safePage).toBe(10);
        expect(paginator.page()).toBe(10);
        expect(paginator.block).toBe(1);
        expect(paginator.firstRecord).toBe(91);
        expect(paginator.lastRecord).toBe(91);
        expect(paginator.recordsInLastPage).toBe(1);
        expect(paginator.pagesInLastBlock).toBe(10);
    });
    test("More than one page, more than one block", () => {
        const paginator = new FazPaginator();
        paginator.setCount(340)
        expect(paginator.pages).toBe(34);
        expect(paginator.blocks).toBe(4);

        expect(paginator.page()).toBe(1);
        expect(paginator.safePage).toBe(1);
        expect(paginator.block).toBe(1);
        expect(paginator.isLastPage).toBeFalsy();
        expect(paginator.isLastBlock).toBeFalsy();
        expect(paginator.firstRecord).toBe(1);
        expect(paginator.lastRecord).toBe(10);
        paginator.setPage(11)
        expect(paginator.isLastPage).toBeFalsy();
        expect(paginator.isLastBlock).toBeFalsy();
        expect(paginator.safePage).toBe(11);
        expect(paginator.page()).toBe(11);
        expect(paginator.block).toBe(2);
        expect(paginator.firstRecord).toBe(101);
        expect(paginator.lastRecord).toBe(110);
        paginator.setPage(25)
        expect(paginator.isLastPage).toBeFalsy();
        expect(paginator.isLastBlock).toBeFalsy();
        expect(paginator.safePage).toBe(25);
        expect(paginator.page()).toBe(25);
        expect(paginator.block).toBe(3);
        expect(paginator.firstRecord).toBe(241);
        expect(paginator.lastRecord).toBe(250);
        paginator.setPage(32)
        expect(paginator.isLastPage).toBeFalsy();
        expect(paginator.isLastBlock).toBeTruthy();
        expect(paginator.pagesInLastBlock).toBe(4);
        expect(paginator.safePage).toBe(32);
        expect(paginator.page()).toBe(32);
        expect(paginator.block).toBe(4);
        expect(paginator.firstRecord).toBe(311);
        expect(paginator.lastRecord).toBe(320);
        paginator.setPage(34)
        expect(paginator.isLastPage).toBeTruthy();
        expect(paginator.isLastBlock).toBeTruthy();
        expect(paginator.pagesInLastBlock).toBe(4);
        expect(paginator.safePage).toBe(34);
        expect(paginator.page()).toBe(34);
        expect(paginator.block).toBe(4);
        expect(paginator.firstRecord).toBe(331);
        expect(paginator.lastRecord).toBe(340);
        paginator.setPage(35)
        expect(paginator.pagesInLastBlock).toBe(4);
        expect(paginator.safePage).toBe(34);
        expect(paginator.isLastPage).toBeTruthy();
        expect(paginator.isLastBlock).toBeTruthy();
        expect(paginator.page()).toBe(34);
        expect(paginator.block).toBe(4);
        expect(paginator.firstRecord).toBe(331);
        expect(paginator.lastRecord).toBe(340);
    });
});
