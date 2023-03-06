document.body.onload = initializeBalance;
function compareTime(a, b) {
    if (a.time < b.time) {
        return -1;
    }
    if (a.time > b.time) {
        return 1;
    }
    return 0;
}
function convertTimeString(time) {
    if (time == null)
        time = '';
    var match = time.match(/(\d{4})\-(\d{1,2})\-(\d{1,2}) (\d{1,2}:\d{1,2})/);
    return (match[2] + "/" + match[3] + "/" + match[1] + " " + match[4]);
}
function initializeBalance() {
    var balance = 25000;
    var app = document.getElementById("balance");
    var p = document.createElement("p");
    p.innerHTML = "Balance: $" + balance;
    app.append(p);
}
function writeLog(history) {
    var actionList = [];
    for (var i = 0; i < history.length; i++) {
        var currentAction = history[i];
        var newAction = {
            type: currentAction.type,
            price: currentAction.price,
            shares: currentAction.shares,
            time: currentAction.time,
            stock: currentAction.stock
        };
        actionList.push(newAction);
    }
    actionList.sort(compareTime);
    var popupText = document.getElementById("logPopup");
    for (var i = 0; i < actionList.length; i++) {
        var action = document.createTextNode(actionList[i].type + " " + actionList[i].shares.toFixed(2) + " shares of "
            + actionList[i].stock + " at $" + actionList[i].price.toFixed(2) + " at " + convertTimeString(actionList[i].time));
        popupText.appendChild(action);
        popupText.appendChild(document.createElement("br"));
    }
}
function displayLog() {
    var popupText = document.getElementById("logPopup");
    var popupButton = document.getElementById("logButton");
    if (popupText.style.display === "none") {
        popupText.style.display = "block";
        popupButton.innerHTML = "Hide Log";
    }
    else {
        popupText.style.display = "none";
        popupButton.innerHTML = "Display Log";
    }
}
function runBot() {
    console.log('Typescript hit');
    var input = document.getElementById("stockInput");
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
        var completeLog = document.getElementById("completeLog");
        completeLog.style.display = "inline";
        writeLog(json.JsonList.history);
    })["catch"](function (error) {
        console.error(error);
    });
}
