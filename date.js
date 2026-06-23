
export default class DateUtil {

    static getMonthName(month) {
        let monthNames = ["January", "February", "March", "April", "May",
            "June", "July", "August", "September", "October", "November",
            "December"
        ];
        return monthNames[month];
    }

    static daysOfMonthArray(year, month) {
        let days = [];
        Array.from(
            {length: new Date(year, month + 1, 0).getDate()},
            (_, day)=> days.push(
                new Date(year, month, day + 1)
            )
        );
        return days;
    }

    static daysOfMonthMatrix(year, month) {
        let weeks = 6
        let lastDayOfMonth = DateUtil.lastDayOfMonth(year, month);
        let dayMatrix = new Array(weeks);
        Array.from(
            {length: weeks},
            (_, i)=> dayMatrix[i] = new Array(7)
        );
        let week = 0;
        DateUtil.daysOfMonthArray(year, month).forEach(day=>{
            dayMatrix[week][day.getDay()] = day;
            if(day.getDate() == 1 && day.getDay() > 0 ) {
                let dayGap = 1;
                for(let weekDay= day.getDay()-1; weekDay > -1 ; weekDay--) {
                    dayMatrix[week][weekDay] = new Date(
                        day.getFullYear(),
                        day.getMonth(),
                        day.getDate() - dayGap
                    );
                    dayGap++;
                }
            }
            if (day.getDay()==6) {
                week ++;
            }
        });

        let dayGap = 1;
        for(let week=4; week < 6; week++) {
            for(let weekDay=0; weekDay < 7; weekDay++) {
                if (dayMatrix[week][weekDay]==undefined) {
                    dayMatrix[week][weekDay] = new Date(year, month,
                        lastDayOfMonth.getDate() + dayGap);
                    dayGap++;
                }
            }
        }
        return dayMatrix;
    }

    static lastDayOfMonth(year, month) {
        return new Date(year, month + 1, 0);
    }


    static isToday(date) {
        if (DateUtil.dateString(date) == DateUtil.dateString(new Date())) {
            return true;
        }
        return false;
    }

    static dateString(date) {
        return date.getFullYear() + "-" + date.getMonth() + date.getDate();
    }

}
