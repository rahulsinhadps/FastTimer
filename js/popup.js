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
            var index = 0;
            var lastIn = null;
            var totalMinutes = 0;
            $.each(result.SwipeRecord, function() {
                var armyTime = moment(this.swipeTime, ["h:mm A"]).format("HH:mm");
                var logDate = $("#dateForLog").val() + " " + armyTime + ":00";
                if(lastIn == null && this.swipeInOut == "In") {
            		lastIn = logDate;
            	}
            	if(this.swipeInOut == "Out" && lastIn != null) {
            		var output = moment.utc(moment(logDate,"MM-DD-YYYY HH:mm:ss").diff(moment(lastIn,"MM-DD-YYYY HH:mm:ss"))).format("HH:mm");
					var outputArray = output.split(":");
					totalMinutes += (parseInt(outputArray[0])*60)+parseInt(outputArray[1]);
					lastIn = null;
            	}
                var $tr = $("<tr><td>"+this.swipeInOut+"</td><td>"+armyTime+"</td></td></tr>");
                $("#timeLogTable").append($tr);

            });
        	if (lastIn != null) {
        		var currentDate = (new Date()).toString("MM-DD-YYYY HH:mm:ss");
        		var output = moment.utc(moment(new Date()).diff(moment(lastIn,"MM-DD-YYYY HH:mm:ss"))).format("HH:mm");
					var outputArray = output.split(":");
					totalMinutes += (parseInt(outputArray[0])*60)+parseInt(outputArray[1]);
					lastIn = null;

        	}
			$totalLogTime = $("<div>"+ Math.floor(totalMinutes/60) + " hours " + totalMinutes%60 + " minutes </div>");

			if(totalMinutes == 0) {
				$("#swipeTable").hide();
			} else {
				$("#swipeTable").show();
			}	

			$(".js-chip").html($totalLogTime);
			$("#chipDiv").show();

        });

    });

});

function initializeDatePicker() {
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
}

