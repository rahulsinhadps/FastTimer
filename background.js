chrome.runtime.onMessage.addListener(function (response, sender, sendResponse) {
    var employeeId = parseInt(response.fields.empId);
    var date = response.fields.dateForLog;
    var javascriptObjectForInput = {SelectedDate: date, empid: employeeId};

    if (employeeId != null && employeeId != "") {
        utility.saveEmployeeId(employeeId);
    }

    $.ajax({
        type: "POST",
        async: false,
        url: "https://itportaltimer.azurewebsites.net/attendancecalendar/pages/Attendancecalendar.aspx/getDailyPunchRecords",
        data: JSON.stringify(javascriptObjectForInput),
        success: function (data) {
            var dt = moment("12:15 AM", ["h:mm A"]).format("HH:mm");
            sendResponse(data);
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
    }
}