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
            $.each(result.SwipeRecord, function() {
                var $tr = $("<tr><td>"+this.swipeInOut+"</td><td>"+this.swipeTime+"</td></td></tr>");
/*                var tr = document.createElement('tr');

                var td1 = document.createElement('td');
                var td2 = document.createElement('td');

                var text1 = document.createTextNode(this.swipeInOut);
                var text2 = document.createTextNode(this.swipeTime);

                td1.appendChild(text1);
                td2.appendChild(text2);
                tr.appendChild(td1);
                tr.appendChild(td2);

                tableca.appendChild(tr);*/
                $("tbody").append($tr);

            });
            document.body.appendChild(tableca);

            //  document.write(result.SwipeRecord);
        });

    });

});

