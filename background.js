//alert("wololo");
chrome.runtime.onMessage.addListener(function(response, sender, sendResponse) {
    var employeeId = parseInt(response.fields.empId);
    var date = moment().format('MM-DD-YYYY');
    var inp = {SelectedDate: date, empid: employeeId };
    $.ajax({
        type: "POST",
        async: false,
        url: "https://itportaltimer.azurewebsites.net/attendancecalendar/pages/Attendancecalendar.aspx/getDailyPunchRecords",
        data: JSON.stringify(inp),
        success: function(data) {
            sendResponse(data);
        },
        contentType: "application/json; charset=utf-8"
    });
});