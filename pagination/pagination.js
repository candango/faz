/**
 * Copyright 2018-2022 Flavio Gonçalves Garcia
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

import { assign, StacheElement, type} from "can";

import {FazElementItem, FazReactItem} from "../item"

import paginationTemplate from "./stache/pagination.stache"
import ReactDOM from "react-dom"
import React from "react"


export class FazPaginationReact extends FazReactItem {

    constructor(props) {
        super(props);
        // Used to be currentPage
        this.state['page'] = 1
        // Used to be pagesPerBlock
        this.state['perBlock'] = 10
        // Used to be pagesPerPage
        this.state['perPage'] = 10
        // Used to be records
        this.state['count'] = 0

        this.state['labels'] = {
            first : "First",
            last : "Last",
            previous : "Previous",
            next : "Next"
        }

        this.state['debug'] = false
        this.state['disabled'] = false
        this.state['initCallback'] = undefined
        this.state['pageCallback'] = undefined
        this.state['ariaLabel'] = undefined

        if (this.state.element!==undefined) {
            for(let attribute of this.state.element.attributes) {
                switch (attribute.name) {
                    case "aria-label":
                        this.state.ariaLabel=attribute.value
                        break;
                    case "count":
                        this.state.count=attribute.value
                        break;
                }
            }
        }

    }

    render() {
        return (
            <nav aria-label={this.state.ariaLabel}>
                <ul className="pagination">
                    {this.renderFirstPage()}
                    {this.renderPreviousPage()}
                    {this.renderNumberedPages()}
                </ul>
            </nav>
        )
    }

    renderFirstPage() {
        return <li className={this.firstPreviousButtonClass}>
            {this.isFirstPage ?
                <span className="page-link">{this.state.labels.first}</span> :
                <a className="page-link"
                   onClick={(event) => this.goToFirstPage(event)}
                   href={this.hrefLink(1)}>{this.state.labels.first}</a>}
        </li>
    }

    renderPreviousPage() {
        let page = this.state.page - 1
        return <li className={this.firstPreviousButtonClass}>
            {this.isFirstPage ?
                <span className="page-link">{this.state.labels.previous}</span> :
                <a className="page-link"
                   onClick={(event) => this.goToPreviousPage(event)}
                   href={this.hrefLink(page)}>{this.state.labels.previous}</a>}
        </li>
    }

    renderNumberedPages() {
        return this.pagesInCurrentBlock.map((page) =>
            <li className={this.getButtonClass(page)}
                key={this.state.id.concat("_page_button_", page)}>
                <a className="page-link"
                   onClick={(event) => this.goToPage(event, page)}
                   href={this.hrefLink(page)}>{page}</a>
            </li>
        )
    }

    get firstPreviousButtonClass() {
        let classes = ["page-item"]
        if (this.isFirstPage || this.disabled) {
            classes.push("disabled")
        }
        return classes.join(" ")
    }

    get lastNextButtonClass() {
        let classes = ["page-item"]
        if (this.isLastPage || this.disabled) {
            classes.push("disabled")
        }
        return classes.join(" ")
    }

    getButtonClass(page) {
        let classes = ["page-item"]
        if (this.isCurrentPage(page)) {
            classes.push("active")
        }
        if (this.disabled) {
            classes.push("disabled")
        }
        return classes.join(" ")
    }

    get pages() {
        if (this.state.count === 0) {
            return 1
        }
        let pagesFloor = Math.floor(this.state.count/this.state.perPage)
        let remainder = this.state.count % this.state.perPage
        let addRemainder = remainder > 0 ? 1 : 0
        return pagesFloor + addRemainder
    }

    /**
     *  Page computed is used to protect the page limit.
     *
     *  If the state page is out of limits of 1 and pages we fix the state
     *  page value.
     *
     * @returns {number|*}
     */
    get pageComputed() {
        if (this.state.page > 1 || this.pages < this.state.page) {
            this.updateState({page: this.pages})
        }
        return this.state.page
    }

    get recordsInLastPage() {
        let lastPageRemainder = this.state.count % this.state.perPage;
        return lastPageRemainder > 0 ? lastPageRemainder : this.state.perPage
    }

    get blocks() {
        let blocksFloor = Math.floor(this.pages / this.state.perBlock);
        let addReminder = this.pages % this.state.perBlock > 0 ? 1 : 0;
        return blocksFloor + addReminder;
    }

    get pagesInLastBlock() {
        if (!this.isLastPage) {
            return this.pages
        }
        let lastBlockRemainder = this.pages % this.state.perBlock
        return lastBlockRemainder > 0 ? lastBlockRemainder :
            this.state.perBlock
    }

    get currentFirstRecord() {
        return (this.pageComputed * this.state.perPage) - this.state.perPage + 1
    }

    get currentLastRecord() {
        if (this.isLastPage) {
            return this.currentFirstRecord + this.recordsInLastPage - 1
        }
        return this.pageComputed * this.state.perPage
    }

    get currentBlock() {
        if (this.pageComputed <= this.state.perBlock) {
            return 1
        }
        let currentBlockFloor = Math.floor(
            this.pageComputed / this.state.perBlock)
        let remainder = this.pageComputed % this.state.perBlock
        let addRemainder = remainder > 0 ? 1 : 0

        return currentBlockFloor + addRemainder
    }

    get currentFirstPage() {
        return (this.currentBlock * this.state.perBlock) -
            this.state.perBlock + 1
    }

    get currentLastPage() {
        if (this.currentBlock === this.blocks) {
            return this.currentFirstPage + this.pagesInLastBlock - 1
        }
        return this.currentBlock * this.state.perBlock
    }

    get pagesInCurrentBlock() {
        let pages = this.isLastBlock ?
            this.pagesInLastBlock : this.state.perBlock
        return Array(pages).fill(
            undefined).map((_, i) => i + this.currentFirstPage)
    }

    isCurrentPage(page) {
        return page === this.pageComputed
    }

    get isFirstPage() {
        return this.pageComputed === 1
    }

    get isLastPage() {
        return this.pageComputed >= this.pages
    }

    get isLastBlock() {
        return this.currentBlock >= this.blocks
    }

    get hasMultipleBlocks() {
        return this.blocks > 1
    }


    /**
     * Returns the nav item href. If item is disabled a javascript void
     * function will be placed to avoid any action.
     *
     * @param {FazNavItem} item
     * @returns {string}
     */
    hrefLink(page) {
        // It is void because won't change the browser's location
        let voidHref = "#"
        let validHef = this.state.link === undefined ?
            voidHref : this.state.link
        if (this.disabled) {
            return voidHref
        }
        return validHef.replace("{page}", page)
    }

    callInitCallback() {
        if (this.initCallback !== undefined) {
            this.initCallback(this);
        }
    }

    callPageCallback(page) {
        if (this.pageCallback !== undefined) {
            this.pageCallback(page, this);
        }
    }

    goToPage(event, page) {
        this.updateState({page: page})
        this.callPageCallback(page)
    }

    goToFirstPage(event) {
        this.goToPage(event, 1);
    }

    goToLastPage(event) {
        this.goToPage(event, this.pages);
    }

    goToPreviousPage(event) {
        this.goToPage(event, this.state.page - 1)
    }

    goToNextPage(event) {
        this.goToPage(event, this.state.page + 1);
    }

}

export class FazPaginationElement extends FazElementItem {
    constructor(props) {
        super(props)
        console.log("buga")
    }

    beforeLoad() {
        ReactDOM.render(
            <FazPaginationReact id={this.childId} element={this}/>,
            this)
    }

    show() {
        $(this).addClass("faz-alert-rendered")
    }
}


export default class FazPagination extends StacheElement {
    static view = paginationTemplate;

    static get props() {
        return {
            currentPage: {type: type.convert(Number), default: 1},
            debug : {type: type.convert(Boolean), default: false},
            disabled: {type: type.convert(Boolean), default: false},
            href: String,
            initCallback: {type: Object },
            pageCallback: {type: Object },
            pagesPerBlock: {type: type.convert(Number), default: 10},
            records: {type: type.convert(Number), default: 0},
            recordsPerPage: {type: type.convert(Number), default: 10},
            firstPageLabel: {type: type.convert(String), default: "First"},
            lastPageLabel: {type: type.convert(String), default: "Last"},
            previousLabel: {type: type.convert(String), default: "Previous"},
            nextLabel: {type: type.convert(String), default: "Next"},
            get firstPreviousButtonClass() {
                let classes = ["page-item"];
                if (this.isFirstPage || this.disabled) {
                    classes.push("disabled");
                }
                return classes.join(" ");
            },
            get lastNextButtonClass() {
                let classes = ["page-item"];
                if (this.isLastPage || this.disabled) {
                    classes.push("disabled");
                }
                return classes.join(" ");
            },
            getBlockButtonClass(page) {
                let classes = ["page-item"];
                if (this.isCurrentPage(page)) {
                    classes.push("active");
                }
                if (this.disabled) {
                    classes.push("disabled");
                }
                return classes.join(" ");
            },
            get pages() {
                if (this.records == 0) {
                    return 1;
                }
                let pagesFloor = Math.floor(this.records/this.recordsPerPage);
                let remainder = this.records % this.recordsPerPage;
                let addRemainder = remainder > 0 ? 1 : 0;
                return pagesFloor + addRemainder;
            },
            get currentPageComputed() {
                if (this.pages < this.currentPage ||
                    this.currentPage == 0) {
                    return this.pages;
                }
                return this.currentPage;
            },
            get recordsInLastPage() {
                let lastPageRemainder = this.records % this.recordsPerPage;
                return lastPageRemainder > 0 ? lastPageRemainder :
                    this.recordsPerPage;
            },
            get blocks() {
                let blocksFloor = Math.floor(this.pages / this.pagesPerBlock);
                let addReminder = this.pages % this.pagesPerBlock > 0 ? 1 : 0;
                return blocksFloor + addReminder;
            },
            get pagesInLastBlock() {
                if (this.pages < this.pagesPerBlock) {
                    return this.pages;
                }
                let lastBlockRemainder = this.pages % this.pagesPerBlock;
                return lastBlockRemainder > 0 ? lastBlockRemainder :
                    this.pagesPerBlock;
            },
            get currentFirstRecord() {
                return (this.currentPageComputed * this.recordsPerPage) -
                    this.recordsPerPage + 1;
            },
            get currentLastRecord() {
                if (this.currentPageComputed == this.pages) {
                    return this.currentFirstRecord +
                        this.recordsInLastPage - 1;
                }
                return this.currentPageComputed * this.recordsPerPage;
            },
            get currentBlock() {
                if (this.currentPageComputed <= this.pagesPerBlock) {
                    return 1;
                }
                let currentBlockFloor = Math.floor(
                    this.currentPageComputed / this.pagesPerBlock);
                let remainder = this.currentPageComputed % this.pagesPerBlock;
                let addRemainder = remainder > 0 ? 1 : 0;
                return currentBlockFloor + addRemainder;
            },
            get currentFirstPage() {
                return (this.currentBlock * this.pagesPerBlock) -
                    this.pagesPerBlock + 1;
            },
            get currentLastPage() {
                if (this.currentBlock == this.blocks) {
                    return this.currentFirstPage + this.pagesInLastBlock - 1;
                }
                return this.currentBlock * this.pagesPerBlock;
            },
            get pagesInCurrentBlock() {
                let pagesInCurrentBlock = this.currentBlock == this.blocks ?
                    this.pagesInLastBlock : this.pagesPerBlock;
                return Array(pagesInCurrentBlock).fill(undefined).map(
                    (n, i) => i + this.currentFirstPage);
            },
            isCurrentPage: function(page) {
                return page == this.currentPageComputed;
            },
            get isFirstPage() {
                return this.currentPageComputed == 1;
            },
            get isLastPage() {
                return this.currentPageComputed == this.pages;
            },
            get hasMultipleBlocks() {
                return this.blocks > 1;
            }
        };
    }

    connectedCallback() {
        let attributes = {};
        for(let attribute of this.attributes) {
            switch (attribute.name.toLowerCase()) {
                case "debug":
                    attributes["debug"] = attribute.value;
                    break;
                case "disabled":
                    attributes["disabled"] = attribute.value;
                    break;
                case "currentpage":
                    attributes["currentPage"] = attribute.value;
                    break;
                case "href":
                    attributes["href"] = attribute.value;
                    break;
                case "initcallback":
                    attributes["initCallback"] = eval(attribute.value);
                case "pagecallback":
                    attributes["pageCallback"] = eval(attribute.value);
                    break;
                case "pagesperblock":
                    attributes["pagesPerBlock"] = attribute.value;
                    break;
                case "records":
                    attributes["records"] = attribute.value;
                    break;
            }
        }
        assign(this, attributes);
        this.callInitCallback();
        super.connectedCallback();
        this.callPageCallback(this.currentPageComputed);
    }

    /**
     * Returns the nav item href. If item is disabled a javascript void
     * function will be placed to avoid any action.
     *
     * @param {FazNavItem} item
     * @returns {string}
     */
    getHref() {
        let voidHref = "javascript:void(0)";
        let validHef = this.href === undefined ? voidHref : this.href;
        if (this.disabled) {
            return voidHref;
        }
        return validHef.replace("{page}", this.currentPageComputed);
    }

    callInitCallback() {
        if (this.initCallback !== undefined) {
            this.initCallback(this);
        }
    }

    callPageCallback(page) {
        if (this.pageCallback !== undefined) {
            this.pageCallback(page, this);
        }
    }

    goToPage(page) {
        this.currentPage = page;
        this.callPageCallback(page);
    }

    gotToFirstPage() {
        this.goToPage(1);
    }

    gotToLastPage() {
        this.goToPage(this.pages);
    }

    gotToPreviousPage() {
        this.goToPage(this.currentPage - 1);
    }

    gotToNextPage() {
        this.goToPage(this.currentPage + 1);
    }

    static get seal() {
        return true;
    }
}

customElements.define("faz-pagination", FazPagination);
customElements.define("faz-pagination-el", FazPaginationElement);