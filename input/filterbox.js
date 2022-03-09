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
import {isString} from "lodash"
import ReactDOM from "react-dom"
import React from "react"


export class FazFilterboxReact extends FazReactItem {

    constructor(props) {
        super(props)
        this.state['autocomplete'] = "off"
        this.state['filterCallback'] = undefined
        this.state['isFiltering'] = false
        this.state['displayFilter'] = false
        this.state['innitCallback'] = undefined
        this.state['label'] = "Type something to filter"
        this.state['selectedName'] = ""
        this.state['selectedValue'] = ""

        this.buffer = ""
        this.filterDelay = 300
        this.filterTimeoutHandler = -1
        this.beOverTimeoutHandler = -1
        this.overListGroup = false
        this.inputHasFocus = false
        this.innitCallback = undefined
        this.filterInput = undefined

        this.doFilter = this.doFilter.bind(this)
        this.clearFilter = this.clearFilter.bind(this)
        this.beOverListGroup = this.beOverListGroup.bind(this)
        this.leaveListGroup = this.leaveListGroup.bind(this)
        this.activateOption = this.activateOption.bind(this)
        this.deactivateOption = this.deactivateOption.bind(this)
        this.selectOption = this.selectOption.bind(this)
    }

    defineStates(props) {
        for (let key in props) {
            switch (key) {
                case "autocomplete":
                    this.state['autocomplete'] = props[key].toLowerCase()
                    break
                case "innitCallback":
                    this.innitCallback = props[key]
                    break
                case "filterCallback":
                    this.state['filterCallback'] = props[key]
                    break
                case "label":
                    this.state['justify'] = props[key]
                    break
            }
        }
    }

    hasItems() {
        return this.state.items.length > 0
    }

    get prefix() {
        return "faz-filterbox-react"
    }

    get idOuterDiv() {
        return this.state.id + "-div";
    }

    get idInput() {
        return this.state.id + "-input";
    }

    get idFilterboxListContainer() {
        return this.state.id + "-filterbox-list-container";
    }

    get categories() {
        return this.filteredItems.reduce((categories, item)=> {
            if(item.hasOwnProperty("category") &&
                categories.indexOf(item.category) === -1) {
                categories.push(item.category);
            }
            return categories;
        }, []);
    }

    doFilter(event) {
        this.verifySelectedValue(event.target)
        this.updateState({isFiltering: true})
        this.updateState({displayFilter: false})
        this.overListGroup = true
        this.inputHasFocus = true
        this.buffer = event.target.value
        this.clearFilterTimeout()
        if(this.state.buffer !== "") {
            this.filterTimeoutHandler = setTimeout(
                this.showFilter.bind(this),
                this.filterDelay
            )
            return
        }
        this.updateState({isFiltering: false})
    }

    defaultFilterCallback() {
        return this.state.items.filter(
            item => item.name.toLowerCase().indexOf(
                this.buffer.toLowerCase()
            ) !== -1
        )
    }

    get filteredItems() {
        if(this.state.filterCallback===undefined) {
            return this.defaultFilterCallback()
        }
        return this.state.filterCallback()
    }

    get filteredItemsUncategorized() {
        return this.filteredItems.filter(
            (item) => {
                return !item.hasOwnProperty("category")
            }
        )
    }

    filteredItemsByCategory(category) {
        return this.filteredItems.filter(
            (item) => {
                return item.hasOwnProperty("category") &&
                    item.category === category
            }
        )
    }

    showFilter() {
        this.updateState({isFiltering: false})
        this.updateState({displayFilter: true})
    }

    clearFilter() {
        console.log(this.overListGroup)
        this.inputHasFocus = false
        if (!this.overListGroup) {
            this.buffer = ""
            this.leaveListGroup()
        }
    }

    clearFilterTimeout() {
        if(this.filterTimeoutHandler > 0) {
            clearTimeout(this.filterTimeoutHandler)
            this.filterTimeoutHandler = -1
        }
    }

    verifySelectedValue(input) {
        if(this.state.selectedName !== "" &&
            input.value !== this.state.selectedName) {
            let inputValue = input.value
            this.updateState({
                selectedName: "",
                selectedValue: ""
            })
            input.value = inputValue
        }
    }

    activateOption(event) {
        let option = event.target
        this.elementAddClass(option, "list-group-item-secondary")
    }

    deactivateOption(event) {
        let option = event.target
        this.elementRemoveClass(option, "list-group-item-secondary")
    }

    selectOption(event) {
        let option = event.target
        this.updateState({
            selectedName: option.getAttribute("item-name"),
            selectedValue: option.getAttribute("item-value")
        })
        document.getElementById(this.idInput).value =
            option.getAttribute("item-name")
        this.overListGroup = false
        this.clearFilter()
    }

    beOverListGroup() {
        this.overListGroup = true
        clearTimeout(this.beOverTimeoutHandler)
    }

    leaveListGroup() {
        this.overListGroup = false
        this.beOverTimeoutHandler = setTimeout(() => {
            if(!this.overListGroup && !this.inputHasFocus) {
                this.updateState({isFiltering: false})
                this.updateState({displayFilter: false})
            }
        }, 150)
    }

    get filterContainer() {
        return <div key={this.idFilterboxListContainer}
                    className="filterbox-list-container"
                    onMouseOver={this.beOverListGroup()}
                    onMouseOut={this.leaveListGroup()}
        >
            <div className="list-group">
                {this.uncategorizedResults}
                {this.categorizedResults}
            </div>
        </div>
    }


    get uncategorizedResults() {

        return this.filteredItemsUncategorized.map((item) => {
            return <a href="#"
                      className="list-group-item list-group-item-action"
                      key={item.value + "-" + item.name}
                      item-value={item.value} item-name={item.name}
                      onClick={this.selectOption}
                      onMouseOver={this.activateOption}
                      onMouseOut={this.deactivateOption}>{item.name}</a>
        })
    }

    get categorizedResults() {
        let className = [
            "list-group-item",
            "list-group-item-action",
            "list-group-item-dark"].join(" ")
        return this.categories.map((category) => {
            return <React.Fragment key={"category-fragment-" + category}>
                <a key={"category-" + category } href="#"
                   className={className}>
                    <h6 className="mb-1">{category}</h6>
                </a>
                {this.categorizedResultItems(category)}

            </React.Fragment>
        })
    }

    categorizedResultItems(category) {
        return this.filteredItemsByCategory(category).map((item) => {
            return <a href="#"
                      className="list-group-item list-group-item-action"
                      key={item.value + "-" + item.name}
                      item-value={item.value} item-name={item.name}
                      onClick={this.selectOption}
                      onMouseOver={this.activateOption}
                      onMouseOut={this.deactivateOption}>{item.name}</a>
        })
    }

    get filterInputElement() {
        return (
            <input key={this.idInput} id={this.idInput} type="text"
                   defaultValue={this.state.selectedName}
                   className="form-control"
                   onKeyUp={this.doFilter}
                   onFocus={this.doFilter}
                   onBlur={this.clearFilter}
                   placeholder={this.state.label}
                   autoComplete={this.state.autocomplete}
            />
        )
    }

    get filteringMessage() {
        return (
            <div
                style={{position: "absolute", marginTop: "5px", width: "100%"}}>
                <div className="list-group">
                    <a href="#"
                       className="list-group-item list-group-item-action"
                       aria-current="true">
                        Filtering....
                    </a>
                </div>
            </div>
        )
    }

    render() {
        return (
            <div key={this.idOuterDiv}
                 id={this.idOuterDiv}
                 className="filterbox-outer-container">
                {this.filterInputElement}
                {this.state.isFiltering ? this.filteringMessage : ""}
                {this.state.displayFilter ? this.filterContainer : ""}
            </div>
        )
    }

    afterMount() {
        super.afterMount()

        document.addEventListener("DOMContentLoaded", event => {
            if(isString(this.innitCallback)) {
                // TODO: need to check this better
                this.innitCallback = eval(this.innitCallback)
            }
            if(this.filterCallback) {
                if(isString(this.filterCallback)) {
                    // TODO: need to check this better
                    this.filterCallback = eval(this.filterCallback)
                }
            }
            this.innitCallback(this);
        })
    }
}

export class FazFilterboxItem extends FazElementItem {
    constructor(props) {
        super(props)
    }

    show() {
        ReactDOM.render(
            <FazFilterboxReact id={this.childId} element={this}/>, this)
    }

    attributesToStates() {
        super.attributesToStates();
        for(let attribute of this.attributes) {
            switch (attribute.name.toLowerCase()) {
                case "autocomplete":
                    this.reactItem.updateState({autocomplete: attribute.value})
                    break
                case "items":
                    this.reactItem.items = JSON.parse(attribute.value);
                    break
                case "filtercallback":
                    document.addEventListener("DOMContentLoaded", event => {
                        this.filterCallback = eval(attribute.value);
                    });
                    break;
                case "innitcallback":
                    document.addEventListener("DOMContentLoaded", event => {
                        this.reactItem.innitCallback = eval(attribute.value)
                    });
                    break
            }
        }
    }
}

customElements.define("faz-filterbox", FazFilterboxItem);
