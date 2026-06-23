
import FazDatepicker from "../datepicker/datepicker";
import { domEvents }  from "can";
import DateUtil from "../date";
import { FazStacheItem } from "../item";
import inputDatepickerTemplate from "./stache/datepicker.stache";


export default class FazInputDatepicker extends FazStacheItem {

    static view = inputDatepickerTemplate;

    static get props() {
        return $.extend(super.props, {
            datepicker: {type: Object, get default () {
                let datepicker = new FazDatepicker();
                console.log(this.datePickerId);
                datepicker.id = this.datePickerId;
                datepicker.render();
                return datepicker;
            }}
        });
    }

    get datePickerId () {
        return this.id + "-datepicker";
    }

    get inputId () {
        return this.id + "-input";
    }

    get popoverId () {
        return this.inputId + "-popover";
    }

    get year() {
        return this.currentDate.getFullYear();
    }

    get componentClass() {
        let classes = ["container", "m-0", "p-0"];
        if(this.type=="expanded"){
            classes.push("datepicker-container-expanded");
        } else {
            classes.push("datepicker-container-fixed");
        }
        return classes.join(" ");
    }

    getDayLinkClass(day) {
        let classes = ["btn", "btn-sm"];

        if(DateUtil.isToday(day)){
            classes.push("btn-info");
        } else {
            classes.push("btn-day");
        }

        return classes.join(" ");
    }

    get monthName() {
        return DateUtil.getMonthName(this.currentDate.getMonth());
    }

    get dateMatrix() {
        return DateUtil.daysOfMonthMatrix(
            this.currentDate.getFullYear(),
            this.currentDate.getMonth()
        );
    }

    showPopover() {
        $("#" + this.inputId).popover("show");

        $("#" + this.popoverId).append(this.datepicker);
    }

    afterConnectedCallback() {
    }

    beforeConnectedCallback() {
        for(let attribute of this.attributes) {
            switch (attribute.name) {
                case "type":
                    this.type = attribute.value;
                    break;
            }
        }
    }

    dispatchDayClick(event, day) {
        let eventData = {
            type: "day-click",
            originalEvent: event,
            day: day
        }
        domEvents.dispatch(this, eventData);
    }

    show() {
        $(this).addClass("faz-datepicker-rendered");
        $(() => {
            $("#" + this.inputId).popover({
                content: this.datepicker,
                placement: "top",
                trigger: "focus",
                html: true
            })
        }).on("hide.bs.popover", (event) => {
            if (this.datepicker.overDatePicker) {
                event.preventDefault();
                $("#" + this.inputId).focus();
                return null;
            }

        });
    }

    static get seal() {
        return true;
    }
}



customElements.define("faz-input-datepicker", FazInputDatepicker);

