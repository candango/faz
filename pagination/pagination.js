/**
 * Copyright 2018-2022 Flávio Gonçalves Garcia
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

import {FazElementItem, FazReactItem} from "../item"
import ReactDOM from "react-dom"
import React from "react"

export class FazReactPagination extends FazReactItem {

    defineStates(props) {
        super.defineStates(props);
        this.state['ariaLabel'] = undefined
        // Used to be records
        this.state['count'] = 0
        // Used to be currentPage
        this.state['page'] = 1
        // Used to be pagesPerBlock
        this.state['perBlock'] = 10
        // Used to be pagesPerPage
        this.state['perPage'] = 10

        this.state['labels'] = {
            first : "First",
            firstTooltip : "Go to the first page",
            last : "Last",
            lastTooltip : "Go to the last page",
            previous : "Previous",
            previousBlock : "Previous {perBlock}",
            previousTooltip : "Go to the previous page",
            previousBlockTooltip : "Go to the previous {perBlock} pages",
            next : "Next",
            nextBlock : "Next {perBlock}",
            nextBlockTooltip : "Go to the next {perBlock} pages",
            nextTooltip : "Go to the next page",
        }
        this.state['initCallback'] = undefined
        this.state['pageCallback'] = undefined

        for(let key in props) {
            switch (key) {
                case "ariaLabel":
                    this.state['ariaLabel'] = props[key]
                    break
                case "count":
                    this.state['count'] = parseInt(props[key])
                    break
                case "page":
                    this.state['page'] =parseInt(props[key])
                    break
                case "perBlock":
                    this.state['perBlock'] = parseInt(props[key])
                    break
                case "perPage":
                    this.state['perPage'] = parseInt(props[key])
                    break
            }
        }

    }

    afterMount() {
        this.callInitCallback()
    }

    get prefix() {
        return "faz-react-pagination"
    }

    get containerId() {
        return "faz-pagination-container-".concat(this.state.id)
    }

    render() {
        return <div className="faz-pagination-container" id={this.containerId}>
            <nav aria-label={this.state.ariaLabel}>
                <ul className="pagination">
                    {this.hasMultiplePages? this.renderFirstPage() : ""}
                    {this.hasMultipleBlocks ? this.renderPreviousBlock() : ""}
                    {this.hasMultiplePages ? this.renderPreviousPage() : ""}
                    {this.renderNumberedPages()}
                    {this.hasMultiplePages ? this.renderNextPage() : ""}
                    {this.hasMultipleBlocks ? this.renderNextBlock() : ""}
                    {this.hasMultiplePages ? this.renderLastPage() : ""}
                </ul>
            </nav> {this.state.debug ? this.renderDebug() : ""}</div>
    }

    renderFirstPage() {
        return <li className={this.firstPreviousButtonClass}>
            {this.isFirstPage ?
                <span className="page-link">{this.state.labels.first}</span> :
                <a className="page-link"
                   onClick={(event) => this.goToFirstPage(event)}
                   href={this.paginatedLink(1)}
                   data-bs-toggle="tooltip"
                   data-bs-placement="top"
                   title={this.state.labels.firstTooltip}
                >{this.state.labels.first}</a>}
        </li>
    }

    renderLastPage() {
        return <li className={this.lastNextButtonClass}>
            {this.isLastPage ?
                <span className="page-link">{this.state.labels.last}</span> :
                <a className="page-link"
                   onClick={(event) => this.goToLastPage(event)}
                   href={this.paginatedLink(this.pages)}
                   data-bs-toggle="tooltip"
                   data-bs-placement="top"
                   title={this.state.labels.lastTooltip}
                >{this.state.labels.last}</a>}
        </li>
    }

    renderPreviousPage() {
        let page = this.state.page - 1
        return <li className={this.firstPreviousButtonClass}>
            {this.isFirstPage ?
                <span className="page-link">{this.state.labels.previous}</span> :
                <a className="page-link"
                   onClick={(event) => this.goToPreviousPage(event)}
                   href={this.paginatedLink(page)}
                   data-bs-toggle="tooltip"
                   data-bs-placement="top"
                   title={this.state.labels.previousTooltip}
                >{this.state.labels.previous}</a>}
        </li>
    }

    renderPreviousBlock() {
        let page = this.currentFirstPage - 1
        let label = this.state.labels.previousBlock.replace("{perBlock}",
            this.state.perBlock)
        let tooltipLabel = this.state.labels.previousBlockTooltip.replace(
            "{perBlock}", this.state.perBlock)
        return <li className={this.previousBlockButtonClass}>
            {this.isFirstBlock ?
                "" :
                <a className="page-link"
                   onClick={(event) => this.goToPreviousBlock(event)}
                   href={this.paginatedLink(page)}
                   data-bs-toggle="tooltip"
                   data-bs-placement="top"
                   title={tooltipLabel}>{label}</a>}
        </li>
    }

    renderNextPage() {
        let page = this.state.page + 1
        return <li className={this.lastNextButtonClass}>
            {this.isLastPage ?
                <span className="page-link">{this.state.labels.next}</span> :
                <a className="page-link"
                   onClick={(event) => this.goToNextPage(event)}
                   href={this.paginatedLink(page)}
                   data-bs-toggle="tooltip"
                   data-bs-placement="top"
                   title={this.state.labels.nextTooltip}
                >{this.state.labels.next}</a>}
        </li>
    }

    renderNextBlock() {
        let page = this.currentLastPage + 1
        let label = this.state.labels.nextBlock.replace("{perBlock}",
            this.state.perBlock)
        let tooltipLabel = this.state.labels.nextBlockTooltip.replace(
            "{perBlock}", this.state.perBlock)
        return <li className={this.nextBlockButtonClass}>
            {this.isLastPage ?
                "" :
                <a className="page-link"
                   onClick={(event) => this.goToNextBlock(event)}
                   href={this.paginatedLink(page)}
                   data-bs-toggle="tooltip"
                   data-bs-placement="top"
                   title={tooltipLabel}>{label}</a>}
        </li>
    }

    renderNumberedPages() {
        return this.pagesInCurrentBlock.map((page) =>
            <li className={this.getButtonClass(page)}
                key={this.state.id.concat("_page_button_", page)}>
                {this.isCurrentPage(page) ?
                    <span className="page-link">{page}</span> :
                    <a className="page-link"
                       onClick={(event) => this.goToPage(event, page)}
                       href={this.paginatedLink(page)}>{page}</a>}
            </li>
        )
    }

    renderDebug() {
        let accordionId = "faz-pagination-debug-".concat(this.state.id)
        let collapseId = accordionId.concat("-", this.state.id)
        return (<div className="accordion faz-pagination-debug-accordion"
                     id={accordionId}>
            <div className="accordion-item">
                <h2 className="accordion-header" id="headingOne">
                    <button className="accordion-button collapsed" type="button"
                            data-bs-toggle="collapse"
                            data-bs-target={"#".concat(collapseId)}
                            aria-expanded="false"
                            aria-controls={collapseId}>
                        <b>Debug information for faz-pagination-element:</b>
                        &nbsp;{this.state.id}
                    </button>
                </h2>
                <div id={collapseId}
                     className="accordion-collapse collapse"
                     aria-labelledby="headingOne"
                     data-bs-parent={"#".concat(accordionId)}>
                    <div className="accordion-body">
                        <h5 className="card-title">Component State Information</h5>
                        <dl className="row">
                            <dt className="col-sm-3">Disabled:</dt>
                            <dd className="col-sm-9">{this.disabled}</dd>
                        </dl>
                        <h5 className="card-title">Records Information</h5>
                        <dl className="row">
                            <dt className="col-sm-3">Records:</dt>
                            <dd className="col-sm-9">{this.state.count}</dd>
                            <dt className="col-sm-3">Current First Record:</dt>
                            <dd className="col-sm-9">{this.currentFirstRecord}</dd>
                            <dt className="col-sm-3">Current Last Record:</dt>
                            <dd className="col-sm-9">{this.currentLastRecord}</dd>
                        </dl>
                        <h5 className="card-title">Pages Information</h5>
                        <dl className="row">
                            <dt className="col-sm-3">Pages:</dt>
                            <dd className="col-sm-9">{this.pages}</dd>
                            <dt className="col-sm-3">Current Page:</dt>
                            <dd className="col-sm-9">{this.state.page}</dd>
                            <dt className="col-sm-3">Current Page Computed:</dt>
                            <dd className="col-sm-9">{this.pageComputed}</dd>
                            <dt className="col-sm-3">Current First Page:</dt>
                            <dd className="col-sm-9">{this.currentFirstPage}</dd>
                            <dt className="col-sm-3">Current Last Page:</dt>
                            <dd className="col-sm-9">{this.currentLastPage}</dd>
                            <dt className="col-sm-3">Records per page:</dt>
                            <dd className="col-sm-9">{this.state.perPage}</dd>
                            <dt className="col-sm-3">Records in last page:</dt>
                            <dd className="col-sm-9">{this.recordsInLastPage}</dd>
                            <dt className="col-sm-3">Is first page:</dt>
                            <dd className="col-sm-9">
                                {this.isFirstPage ? "True" : "False"}
                            </dd>
                            <dt className="col-sm-3">Is last page:</dt>
                            <dd className="col-sm-9">
                                {this.isLastPage ? "True" : "False"}
                            </dd>
                        </dl>
                        <h5 className="card-title">Blocks Information</h5>
                        <dl className="row">
                            <dt className="col-sm-3">Blocks:</dt>
                            <dd className="col-sm-9">{this.blocks}</dd>
                            <dt className="col-sm-3">Current Block:</dt>
                            <dd className="col-sm-9">{this.currentBlock}</dd>
                            <dt className="col-sm-3">Pages per Block:</dt>
                            <dd className="col-sm-9">{this.state.perBlock}</dd>
                            <dt className="col-sm-3">Pages in last Block:</dt>
                            <dd className="col-sm-9">{this.pagesInLastBlock}</dd>
                            <dt className="col-sm-3">Is Last Block:</dt>
                            <dd className="col-sm-9">
                                {this.isLastBlock ? "True" : "False"}
                            </dd>
                            <dt className="col-sm-3">Has Multiple Blocks:</dt>
                            <dd className="col-sm-9">
                                {this.hasMultipleBlocks ? "True" : "False"}
                            </dd>
                        </dl>
                    </div>
                </div>
            </div>
        </div>)
    }

    get firstPreviousButtonClass() {
        let classes = ["page-item"]
        if (this.isFirstPage || this.disabled) {
            classes.push("disabled")
        }
        return classes.join(" ")
    }

    get previousBlockButtonClass() {
        let classes = ["page-item"]
        if (this.isFirstBlock || this.disabled) {
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

    get nextBlockButtonClass() {
        let classes = ["page-item"]
        if (this.isLastBlock || this.disabled) {
            classes.push("disabled")
        }
        return classes.join(" ")
    }

    getButtonClass(page) {
        let classes = ["page-item"]
        if (this.isCurrentPage(page)) {
            classes.push("active")
        }
        if (this.disabled && !this.isCurrentPage(page)) {
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
        if (this.state.page < 1) {
            this.updateState({page: 1})
        }
        if (this.pages < this.state.page) {
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
        if (this.isLastBlock) {
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

    get isFirstBlock() {
        return this.currentBlock === 1
    }

    get isLastPage() {
        return this.pageComputed >= this.pages
    }

    get isLastBlock() {
        return this.currentBlock >= this.blocks
    }

    get hasMultiplePages() {
        return this.pages > 1
    }

    get hasMultipleBlocks() {
        return this.blocks > 1
    }

    /**
     * Returns the nav item href. If item is disabled a javascript void
     * function will be placed to avoid any action.
     *
     * @param page
     * @returns {string}
     */
    paginatedLink(page) {
        return this.link.replace("{page}", page)
    }

    callInitCallback() {
        if (this.state.initCallback !== undefined) {
            this.state.initCallback(this);
        }
    }

    callPageCallback(page) {
        if (this.state.pageCallback !== undefined) {
            this.state.pageCallback(page, this);
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

    goToPreviousBlock(event) {
        this.goToPage(event, this.currentFirstPage - 1)
    }

    goToNextPage(event) {
        this.goToPage(event, this.state.page + 1);
    }

    goToNextBlock(event) {
        this.goToPage(event, this.currentLastPage + 1)
    }
}

export default class FazPaginationElement extends FazElementItem {
    constructor(props) {
        super(props)
    }

    show() {
        ReactDOM.render(
            <FazReactPagination id={this.childId} element={this}/>, this)
    }

    attributesToStates() {
        super.attributesToStates();
        for(let attribute of this.attributes) {
            switch (attribute.name) {
                case "aria-label":
                    this.reactItem.state['ariaLabel'] = attribute.value
                    break;
                case "count":
                    this.reactItem.state['count'] = parseInt(attribute.value)
                    break;
                case "init-callback":
                    this.reactItem.state['initCallback'] = eval(
                        attribute.value)
                    break;
                case "page-callback":
                    this.reactItem.state['pageCallback'] = eval(
                        attribute.value)
                    break;
            }
        }
        let pageAttribute = this.attributes.getNamedItem("page")
        if (pageAttribute) {
            let page = parseInt(pageAttribute.value)
            if (page > this.reactItem.pages) {
                let warning = "You cannot inform a page bigger than than the " +
                    "page count(currently {pages} pages). It was informed " +
                    "{page} as page to be set. The current page will default " +
                    "to {pages} page(the last page), but please inform a " +
                    "correct the value next time.\n\nSee element:"
                console.warn(warning.replaceAll(
                    "{pages}", this.reactItem.pages).replaceAll(
                        "{page}", page.toString()))
                console.log(this)
                page = this.reactItem.pages
            }
            if (page > 1) {
                this.reactItem.state['page'] = page
            } else {
                let warning = "You cannot inform a page smaller than than " +
                    "1(the first page). It was informed " +
                    "{page} as page to be set. Will keep the current page " +
                    "will default to 1, but please inform a correct the " +
                    "value next time.\n\nSee element:"
                console.warn(warning.replaceAll("{page}", page.toString()))
                console.log(this)
            }

        }
    }
}

customElements.define("faz-pagination", FazPaginationElement)
