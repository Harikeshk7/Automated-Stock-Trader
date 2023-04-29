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
exports.runBot = exports.displayLog = void 0;
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
function updateChart(history) {
    return __awaiter(this, void 0, void 0, function () {
        var chart, balance, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    chart = auto_1.Chart.getChart('balanceChart');
                    balance = 10000;
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < history.length)) return [3 /*break*/, 4];
                    if (history[i].type == "Bought") {
                        balance -= history[i].price * history[i].shares;
                    }
                    if (!(history[i].type == "Sold")) return [3 /*break*/, 3];
                    balance += history[i].price * history[i].shares;
                    chart.data.datasets[0].data.push(balance);
                    chart.data.labels.push(history[i].time);
                    return [4 /*yield*/, sleep(3000)];
                case 2:
                    _a.sent();
                    chart.update();
                    _a.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function createPriceArray(history) {
    var currentPrice = 10000;
    var boughtPrice = 0;
    var soldPrice = 0;
    var prices = [{ x: '2022-10-06 09:30', y: 10000 }];
    for (var i = 0; i < history.length; i++) {
        if (history[i].type == "Bought") {
            boughtPrice = history[i].shares * history[i].price;
        }
        if (history[i].type == "Sold") {
            soldPrice = history[i].shares * history[i].price;
            currentPrice += soldPrice - boughtPrice;
            prices.push({ x: history[i].time, y: currentPrice });
        }
    }
}
function runBot() {
    console.log('Typescript hit');
    var stockInput = document.getElementById("stockInput");
    var algoInput = document.getElementById("algoInput");
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
    formData.append("algorithm", algorithm);
    var local_hostUrl = 'http://localhost:5000/upload';
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
        updateChart(json.JsonList.history);
    })["catch"](function (error) {
        console.error(error);
    });
}
exports.runBot = runBot;
