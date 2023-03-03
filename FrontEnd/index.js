// This function uses the Fetch API to send a POST request to the 
// "/upload" endpoint on the backend with the selected CSV file as a FormData object
function uploadFile() {
    console.log('Typescript hit');
    var input = document.getElementById("directoryInput");
    var directoryInput = document.getElementById("directoryInput");
    var directoryButton = document.getElementById("directory_button");
    // const dir = input.files?.[0];
    var dir = input.files;
    console.log(dir);
    if (!dir) {
        console.error("No directory selected.");
        return;
    }
    var formData = new FormData();
    for (var i = 0; i < dir.length; i++) {
        var file = dir[i];
        formData.append("dir[]", file);
    }
    var local_hostUrl = "http://localhost:5000/upload";
    fetch(local_hostUrl, {
        method: "POST",
        body: formData
    }).then(function (response) {
        // console.log('resp ', response)
        return response.json();
    }, function (reason) { console.log(reason); })
        .then(function (json) {
        console.log('Displaying on webpage - directory path: ', json.path);
        var jsonDataDiv = document.createElement('div');
        jsonDataDiv.innerHTML = JSON.stringify(json);
        document.body.appendChild(jsonDataDiv);
        // console.log('Data is being read = ', json)
    })["catch"](function (error) {
        console.error(error);
    });
}
