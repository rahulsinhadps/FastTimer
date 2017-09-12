
chrome.runtime.sendMessage("Hello world", function(response) {
    var something = document.getElementsByTagName('table');
    var tableca = something[0];

    var result = JSON.parse(response.d);

    console.log(result.SwipeRecord);
    $.each(result.SwipeRecord, function() {
/*        console.log(this);
        document.write(this.swipeInOut + "---" + this.swipeTime+"<br>");*/
        var tr = document.createElement('tr');

        var td1 = document.createElement('td');
        var td2 = document.createElement('td');

        var text1 = document.createTextNode(this.swipeInOut);
        var text2 = document.createTextNode(this.swipeTime);

        td1.appendChild(text1);
        td2.appendChild(text2);
        tr.appendChild(td1);
        tr.appendChild(td2);

        tableca.appendChild(tr);

    });
    document.body.appendChild(tableca);

  //  document.write(result.SwipeRecord);
});

