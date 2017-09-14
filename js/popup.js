$(document).ready(function() {
    initializeDatePicker();
    $("#submitEmpId").click(function() {
        var $employeeIdForm = $("#empForm");
        var fields = {};
        $employeeIdForm.find(":input").each(function() {
            fields[this.name] = $(this).val();
        });
        var input = {fields: fields};
        chrome.runtime.sendMessage(input, function(response) {
            var result = JSON.parse(response.d);
            console.log(result.SwipeRecord);
            $("#timeLogTable").html("");
            $("#swipeTable").show();
            $.each(result.SwipeRecord, function() {
                var $tr = $("<tr><td>"+this.swipeInOut+"</td><td>"+this.swipeTime+"</td></td></tr>");
                $("#timeLogTable").append($tr);

            });
        });

    });

});

function initializeDatePicker() {
    $('.datepicker').pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 15, // Creates a dropdown of 15 years to control year,
        today: 'Today',
        clear: 'Clear',
        close: 'Ok',
        closeOnSelect: true,
        format: 'mm-dd-yyyy'// Close upon selecting a date,
    });
}

