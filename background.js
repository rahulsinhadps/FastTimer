chrome.runtime.onMessage.addListener(function (response, sender, sendResponse) {
    var employeeId = parseInt(response.fields.empId);
    var date = response.fields.dateForLog;
    var javaScriptObjectForInputToTodaysTime = {SelectedDate: date, empid: employeeId};
    var javaScriptObejctForInputToMonthlyLeftTime = {
        "Currdate": utility.formatDateOfMOnthStart(new Date()),
        "empid": employeeId
    };
    var responsedArray = [];

    if (employeeId != null && employeeId != "") {
        utility.saveEmployeeId(employeeId);
    }

    $.ajax({
        type: "POST",
        async: false,
        url: "https://itportaltimer.azurewebsites.net/attendancecalendar/pages/Attendancecalendar.aspx/getDailyPunchRecords",
        data: JSON.stringify(javaScriptObjectForInputToTodaysTime),
        success: function (response) {
            var dt = moment("12:15 AM", ["h:mm A"]).format("HH:mm");
            responsedArray[0] = response;
        },

        contentType: "application/json; charset=utf-8"
    });

    $.ajax({
        type: "POST",
        async: false,
        url: "https://itportaltimer.azurewebsites.net/attendancecalendar/pages/Attendancecalendar.aspx/getAllLeaveDays",
        data: JSON.stringify(javaScriptObejctForInputToMonthlyLeftTime),
        success: function (response) {
            responsedArray[1] = response;
            sendResponse(responsedArray);
        },

        contentType: "application/json; charset=utf-8"
    });
});

var utility = {
    saveEmployeeId: function (empId) {
        // Save it using the Chrome extension storage API.
        chrome.storage.sync.set({'empId': empId}, function () {
            console.log("Saved employeeId");
        });
    },

    formatDateOfMOnthStart: function ($today) {
        return (parseInt($today.getYear()) + 1900).toString() + '/' + ($today.getMonth() + 1) + '/' + 1;
    }
}
