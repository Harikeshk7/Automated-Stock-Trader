document.body.onload = initializeBalance;
function initializeBalance() {
    var balance = 25000;
    var app = document.getElementById("balance");
    var p = document.createElement("p");
    p.innerHTML = "Balance: $" + balance;
    app.append(p);
}
function runBot() {
    console.log('Typescript hit');
    var input = document.getElementById("stock_input");
    console.log('Input');
    var selectedStrings = Array.from(input.selectedOptions, function (option) { return option.value; });
    console.log(selectedStrings);
    if (selectedStrings.length === 0) {
        console.error("No strings selected.");
        return;
    }
    var formData = new FormData();
    for (var i = 0; i < selectedStrings.length; i++) {
        var string = selectedStrings[i];
        formData.append("strings[]", string);
    }
    var local_hostUrl = "http://localhost:5000/upload";
    fetch(local_hostUrl, {
        method: "POST",
        body: formData
    })
        .then(function (response) { return response.json(); }, function (reason) { console.log(reason); })
        .then(function (json) {
        console.log('Displaying on webpage - directory path: ', json.path);
        var balanceArea = document.getElementById("balance");
        balanceArea.innerHTML = "Balance: $" + (json.JsonList.total_capital).toFixed(2);
    })["catch"](function (error) {
        console.error(error);
    });
}
