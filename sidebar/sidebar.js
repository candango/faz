
import {FazElementItem, FazReactItem} from "../item";
import React from 'react'
import ReactDOM from "react-dom"


class FazSidebarReact extends FazReactItem {

    defineStates(props) {
        this.state['type'] = "primary"
        if (props.type) {
            this.state['type'] = props.type.toLowerCase()
        }
    }

    get prefix() {
        return "faz-sidebar-react"
    }

    get classNames() {
        let classes = ["alert"]
        classes.push("alert-" + this.state.type)
        return classes.join(" ")
    }

    render() {
        return (
            <div id={this.state.id}
                className={this.classNames}
                role="alert">{this.content}</div>
        )
    }

}

export default class FazSidebarElement extends FazElementItem {
    constructor(props) {
        super(props)
    }

    beforeLoad() {
        ReactDOM.render(<FazSidebarReact id={this.childId} element={this}/>,
            this)
    }

    attributesToStates() {
        super.attributesToStates();
        for (let attribute of this.attributes) {
            switch (attribute.name) {
                case "type":
                    this.reactItem.state['type'] = attribute.value
                    break
            }
        }
    }

    show() {
        $(this).addClass("faz-sidebar-rendered")
    }
}

customElements.define("faz-sidebar", FazSidebarElement)
