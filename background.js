//alert("wololo");
chrome.runtime.onMessage.addListener(function(response, sender, sendResponse) {
    var employeeId = parseInt(response.fields.empId);
    var date = response.fields.dateForLog;
    var inp = {SelectedDate: date, empid: employeeId };
    $.ajax({
        type: "POST",
        async: false,
        url: "https://itportaltimer.azurewebsites.net/attendancecalendar/pages/Attendancecalendar.aspx/getDailyPunchRecords",
        data: JSON.stringify(inp),
        success: function(data) {
            var dt = moment("12:15 AM", ["h:mm A"]).format("HH:mm");
            sendResponse(data);
        },
        contentType: "application/json; charset=utf-8"
    });
});