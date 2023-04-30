"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.runBot = exports.searchStocks = exports.toggleCustom = exports.toggleStockList = exports.toggleSelectButton = exports.displayLog = void 0;
var auto_1 = require("chart.js/auto");
document.body.onload = function () {
    initializeBalance();
    initializeChart();
};
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
    var balance = 10000;
    var app = document.getElementById("balance");
    var p = document.createElement("p");
    p.innerHTML = "Total Value: $" + balance;
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
exports.displayLog = displayLog;
function initializeChart() {
    var ctx = document.getElementById('balanceChart');
    new auto_1.Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                    data: [10000],
                    borderWidth: 1
                }],
            labels: ['2022-10-06 09:30']
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}
function sleep(ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
}
function updateTable(action) {
    var table = document.getElementById('ownedTable');
    if (action.type == "Bought") {
        var row = table.tBodies[0].insertRow();
        var stockCell = row.insertCell();
        var sharesCell = row.insertCell();
        var valueCell = row.insertCell();
        stockCell.innerText = action.stock;
        sharesCell.innerText = action.shares.toFixed(2).toString();
        valueCell.innerText = (action.shares * action.price).toFixed(2).toString();
    }
    if (action.type == "Sold") {
        table.tBodies[0].deleteRow(-1);
    }
}
function updatePage(history) {
    return __awaiter(this, void 0, void 0, function () {
        var chart, balanceArea, balance, ownValue, currentValue, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    chart = auto_1.Chart.getChart('balanceChart');
                    balanceArea = document.getElementById("balance");
                    balance = 10000;
                    ownValue = 0;
                    currentValue = 0;
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < history.length)) return [3 /*break*/, 6];
                    if (!(history[i].type == "Bought")) return [3 /*break*/, 3];
                    balance -= history[i].price * history[i].shares;
                    ownValue += history[i].price * history[i].shares;
                    currentValue = history[i].price * history[i].shares;
                    return [4 /*yield*/, sleep(500)];
                case 2:
                    _a.sent();
                    updateTable(history[i]);
                    _a.label = 3;
                case 3:
                    if (!(history[i].type == "Sold")) return [3 /*break*/, 5];
                    balance += history[i].price * history[i].shares;
                    ownValue -= currentValue;
                    chart.data.datasets[0].data.push(balance + ownValue);
                    chart.data.labels.push(history[i].time);
                    return [4 /*yield*/, sleep(500)];
                case 4:
                    _a.sent();
                    balanceArea.innerHTML = "Total Value: $" + (balance + ownValue).toFixed(2);
                    updateTable(history[i]);
                    chart.update();
                    _a.label = 5;
                case 5:
                    i++;
                    return [3 /*break*/, 1];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function toggleSelectButton() {
    var selectButton = document.getElementById("selectButton");
    var stockInput = document.getElementById("stockInput");
    if (stockInput && selectButton) {
        if (stockInput.value.length > 0) {
            selectButton.classList.remove("hide");
        }
        else {
            selectButton.classList.add("hide");
        }
    }
}
exports.toggleSelectButton = toggleSelectButton;
function toggleStockList() {
    var stockDropdown = document.getElementById("stockDropdown");
    var algoInput = document.getElementById("algoInput");
    var selectButton = document.getElementById("selectButton");
    if (algoInput !== null && algoInput.value !== null && algoInput.value !== "Select") {
        if (stockDropdown !== null) {
            stockDropdown.classList.remove("hide");
        }
    }
    else {
        if (stockDropdown !== null) {
            stockDropdown.classList.add("hide");
        }
        if (selectButton !== null) {
            selectButton.classList.add("hide");
        }
    }
}
exports.toggleStockList = toggleStockList;
function toggleCustom() {
    var customDiv = document.getElementById("customDiv");
    var algoInput = document.getElementById("algoInput");
    if (algoInput && algoInput.value === "custom" && customDiv) {
        customDiv.style.display = "block";
    }
    else if (customDiv) {
        customDiv.style.display = "none";
    }
}
exports.toggleCustom = toggleCustom;
function searchStocks() {
    var input = document.getElementById("stockSearch");
    var filter = input.value.toUpperCase();
    var select = document.getElementById("stockInput");
    var options = select.getElementsByTagName("option");
    for (var i = 0; i < options.length; i++) {
        var symbol = options[i].value;
        if (symbol.toUpperCase().indexOf(filter) > -1) {
            options[i].style.display = "";
        }
        else {
            options[i].style.display = "none";
        }
    }
}
exports.searchStocks = searchStocks;
function runBot() {
    var _a;
    var loadingText = document.getElementById("loadingText");
    loadingText.style.display = "inline-block";
    console.log('Typescript hit');
    var stockInput = document.getElementById("stockInput");
    var algoInput = document.getElementById("algoInput");
    var customFileInput = document.getElementById("customFileInput");
    if (!((_a = customFileInput === null || customFileInput === void 0 ? void 0 : customFileInput.files) === null || _a === void 0 ? void 0 : _a.length) && algoInput.value === "custom") {
        alert("Please upload a custom algorithm file.");
        return;
    }
    console.log('Input');
    var selectedStrings = Array.from(stockInput.selectedOptions, function (option) { return option.value; });
    var algorithm = algoInput.value;
    if (selectedStrings.length === 0) {
        console.error("No strings selected.");
        return;
    }
    if (algorithm === 'Select') {
        console.error("No algorithm selected.");
        return;
    }
    var formData = new FormData();
    for (var i = 0; i < selectedStrings.length; i++) {
        var string = selectedStrings[i];
        formData.append("strings[]", string);
    }
    if (algorithm === "custom") {
        var file = customFileInput.files[0];
        formData.append("customFileInput", file, file.name);
        console.log(formData.get("file")); // check if file is appended
    }
    else {
        formData.append("algorithm", algorithm);
    }
    formData.append("algorithm", algorithm);
    var local_hostUrl = 'http://localhost:5000/upload';
    fetch(local_hostUrl, {
        method: "POST",
        body: formData
    })
        .then(function (response) { return response.json(); }, function (reason) { console.log(reason); })
        .then(function (json) {
        console.log('Displaying on webpage - directory path: ', json.path);
        writeLog(json.JsonList.history);
        loadingText.style.display = "none";
        updatePage(json.JsonList.history);
        var completeLog = document.getElementById("completeLog");
        completeLog.style.display = "inline";
    })["catch"](function (error) {
        console.error(error);
    });
}
exports.runBot = runBot;
