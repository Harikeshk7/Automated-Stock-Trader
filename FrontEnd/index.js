// This function uses the Fetch API to send a POST request to the 
// "/upload" endpoint on the backend with the selected CSV file as a FormData object
function uploadFile() {
    var _a;
    console.log('Typescript hit2');
    var input = document.getElementById("fileInput");
    var file = (_a = input.files) === null || _a === void 0 ? void 0 : _a[0];
    if (!file) {
        console.error("No file selected.");
        return;
    }
    var formData = new FormData();
    formData.append("file", file);
    var local_hostUrl = "http://localhost:5000/upload";
    fetch(local_hostUrl, {
        method: "POST",
        body: formData
    }).then(function (response) {
        // console.log('resp ', response)
        return response.json();
    }, function (reason) { console.log(reason); })
        .then(function (json) {
        console.log('Displaying on webpage');
        var jsonDataDiv = document.createElement('div');
        jsonDataDiv.innerHTML = JSON.stringify(json);
        document.body.appendChild(jsonDataDiv);
        // console.log('Data is being read = ', json)
    })["catch"](function (error) {
        console.error(error);
    });
}
