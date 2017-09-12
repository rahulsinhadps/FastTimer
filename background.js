//alert("wololo");
chrome.runtime.onMessage.addListener(function(response, sender, sendResponse) {
    var inp = {SelectedDate: "09-12-2017", empid: "106846;87" };
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

//This line opens up a long-lived connection to your background page.
var port = chrome.runtime.connect({name:"mycontentscript"});
port.onMessage.addListener(function(message,sender){
    if(message.greeting === "hello"){
        alert(message.greeting);
    }
});