$(document).ready(function () {
    chrome.storage.sync.get("empId", function (response) {
        $("#empId").val(response.empId);
        $("#submitEmpId").click();
    });

    timeLogger.initializeDatePicker();
    timeLogger.initializeSubmitDataClick();
    timeLogger.initializeTotalTimeCalculationOfWeek();
});

var todayLoggedTime;

var timeLogger = {
    initializeDatePicker: function () {
        var $datepicker = $('.datepicker').pickadate({
            selectMonths: true, // Creates a dropdown to control month
            selectYears: 15, // Creates a dropdown of 15 years to control year,
            today: 'Today',
            clear: 'Clear',
            close: 'Ok',
            closeOnSelect: true,
            format: 'mm-dd-yyyy'// Close upon selecting a date,
        });

        var picker = $datepicker.pickadate('picker');

        picker.set('select', new Date());
    },

    initializeSubmitDataClick: function () {
        $("#submitEmpId").click(function (event) {
            var input = {fields: timeLogger.createInputToGetTime()};

            chrome.runtime.sendMessage(input, function (response) {
                var totalTimeLoggedInADay = timeLogger.calculateTimeLogAndSetTableData(response[0]);

                todayLoggedTime = totalTimeLoggedInADay;
                $("#chipDiv").hide();

                if (totalTimeLoggedInADay != null && totalTimeLoggedInADay != 0) {
                    timeLogger.setCalculatedTotalTimeToPage(totalTimeLoggedInADay);
                } else {
                    $("#swipeTable").hide();
                }

                timeLogger.initializeTotalTimeCalculationOfWeek(response[1]);

            });

            event.preventDefault();
        });
    },

    createInputToGetTime: function () {
        var fields = {};

        $("#empForm").find(":input").each(function () {
            fields[this.name] = $(this).val();
        });

        return fields;
    },

    initializeTotalTimeCalculationOfWeek: function (response) {
        var $today = new Date();
        var calculateWeekDay = $today.getDay();

        if (calculateWeekDay === 6 || calculateWeekDay === 0) {
            $("#chipDivWeekend").show();
        } else {
            timeLogger.calculateTotalTimeLogForThisWeek(response);
        }
    },

    calculateTotalTimeLogForThisWeek: function (response) {
        var result = JSON.parse(response.d);
        var weeklyHoursListOfMonth = result.WeeklyHours;

        timeLogger.displayAverageHoursOfLastWeek(weeklyHoursListOfMonth);
    },

    displayAverageHoursOfLastWeek: function (weeklyHoursListOfMonth) {
        var thisWeekTimeLog = '';
        $.each(weeklyHoursListOfMonth, function (i, val) {
            thisWeekTimeLog = val;
        });

        timeLogger.splitAndDisplayAvergaeAndTotalTimeLog(thisWeekTimeLog);
    },

    splitAndDisplayAvergaeAndTotalTimeLog: function (thisWeekTimeLog) {
        var splitedWeekTimeLog = thisWeekTimeLog.split(";");
        var averageTimeLog = splitedWeekTimeLog[0];
        var totalLogTimeThisWeekAtInstanceInMinutes = timeLogger.getTotalTimeLogThisWeekAtInstance(splitedWeekTimeLog[1]);

        timeLogger.displayAverageTimeLog(averageTimeLog);
        timeLogger.displayTotalTimeLogInWeekAtInstance(totalLogTimeThisWeekAtInstanceInMinutes);
    },

    getTotalTimeLogThisWeekAtInstance: function (totalWeekTimeLog) {
        var hourAndMinutesOftotalWeekTimeLog = totalWeekTimeLog.split(":");
        return parseInt(hourAndMinutesOftotalWeekTimeLog[0]) * 60 + parseInt(hourAndMinutesOftotalWeekTimeLog[1]) + todayLoggedTime;
    },

    displayAverageTimeLog: function (averageTimeLog) {
        var splitHoursAndMinutes = averageTimeLog.split(":");
        var $averageTimeLog = $("<div>"
            + splitHoursAndMinutes[0]
            + " hours "
            + splitHoursAndMinutes[1]
            + " minutes "
            + "</div>");

        $(".js2-chip").html($averageTimeLog);
        $("#chip2Div").show();
    },

    displayTotalTimeLogInWeekAtInstance: function (totalLogTimeThisWeekAtInstanceInMinutes) {
        var $totalLogTimeAtIstance = $("<div>"
            + Math.floor(totalLogTimeThisWeekAtInstanceInMinutes / 60)
            + " hours "
            + (totalLogTimeThisWeekAtInstanceInMinutes % 60)
            + " minutes "
            + "</div>");

        $(".js3-chip").html($totalLogTimeAtIstance);
        $("#chip3Div").show();
    },

    calculateTimeLogAndSetTableData: function (response) {
        var result = JSON.parse(response.d);
        $("#timeLogTable").html("");
        var lastIn = null;
        var totalMinutes = 0;
        var resultList = result.SwipeRecord;

        $.each(resultList, function () {
            var armyTime = moment(this.swipeTime, ["h:mm A"]).format("HH:mm");
            var logDate = $("#dateForLog").val() + " " + armyTime + ":00";

            if (lastIn == null && this.swipeInOut == "In") {
                lastIn = logDate;
            }

            if (this.swipeInOut == "Out" && lastIn != null) {
                var output = moment.utc(moment(logDate, "MM-DD-YYYY HH:mm:ss").diff(moment(lastIn, "MM-DD-YYYY HH:mm:ss"))).format("HH:mm");
                var outputArray = output.split(":");
                totalMinutes += (parseInt(outputArray[0]) * 60) + parseInt(outputArray[1]);
                lastIn = null;
            }

            var $tr = $("<tr><td>" + this.swipeInOut + "</td><td>" + armyTime + "</td></td></tr>");
            $("#timeLogTable").append($tr);
        });

        if (lastIn != null) {
            var lastLog = new Date();
            var lastInDate = (moment(lastIn, "MM-DD-YYYY HH:mm:ss")).toDate();

            if ((new Date).getDate() - lastInDate.getDate() != 0) {
                lastLog.setHours(0, 0, 0);
            }

            var output = moment.utc(moment(lastLog).diff(moment(lastIn, "MM-DD-YYYY HH:mm:ss"))).format("HH:mm");
            var outputArray = output.split(":");
            totalMinutes += (parseInt(outputArray[0]) * 60) + parseInt(outputArray[1]);
            lastIn = null;

        }

        return totalMinutes;

    },

    setCalculatedTotalTimeToPage: function (totalMinutes) {
        var $totalLogTime = $("<div>" + Math.floor(totalMinutes / 60) + " hours " + totalMinutes % 60 + " minutes </div>");

        if (totalMinutes == 0) {
            $("#swipeTable").hide();
        } else {
            $("#swipeTable").show();
        }

        $(".js-chip").html($totalLogTime);
        $("#chipDiv").show();
    }
}

