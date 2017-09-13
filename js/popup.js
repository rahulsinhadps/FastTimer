$(document).ready(function() {
    $("#submitEmpId").click(function() {
        var $employeeIdForm = $("#empForm");
        var fields = {};
        $employeeIdForm.find(":input").each(function() {
            fields[this.name] = $(this).val();
        });
        var input = {fields: fields};
        chrome.runtime.sendMessage(input, function(response) {
            var something = document.getElementsByTagName('table');
            var tableca = something[0];

            var result = JSON.parse(response.d);

            console.log(result.SwipeRecord);
            $("tbody").html("");
            $("#swipeTable").show();
            $.each(result.SwipeRecord, function() {
                var $tr = $("<tr><td>"+this.swipeInOut+"</td><td>"+this.swipeTime+"</td></td></tr>");
                $("tbody").append($tr);

            });
            document.body.appendChild(tableca);

            //  document.write(result.SwipeRecord);
        });

    });

});

