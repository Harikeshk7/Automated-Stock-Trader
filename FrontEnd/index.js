// This function uses the Fetch API to send a POST request to the 
// "/upload" endpoint on the backend with the selected CSV file as a FormData object
// function uploadFile() {
//   console.log('Typescript hit')
//   const input = document.getElementById("directoryInput") as HTMLInputElement;
//   const directoryInput = document.getElementById("directoryInput");
//   const directoryButton = document.getElementById("directory_button");
//   // const dir = input.files?.[0];
//   const dir = input.files;
//   console.log(dir)
//   if (!dir) {
//     console.error("No directory selected.");
//     return;
//   }
//   const formData = new FormData();
//   for (let i = 0; i < dir.length; i++) {
//     const file = dir[i]
//     formData.append("dir[]", file);
//   }
//   const local_hostUrl = `http://localhost:5000/upload`;
//   fetch(local_hostUrl, {
//     method: "POST",
//     body: formData,
//   }).then((response) => {
//     // console.log('resp ', response)
//     return response.json()
//   },
//     (reason) => { console.log(reason) })
//     .then(json => {
//       console.log('Displaying on webpage - directory path: ', json.path)
//       const jsonDataDiv = document.createElement('div');
//       jsonDataDiv.innerHTML = JSON.stringify(json);
//       document.body.appendChild(jsonDataDiv);
//       // console.log('Data is being read = ', json)
//     })
//     .catch(error => {
//       console.error(error);
//     });
// }
function uploadStrings() {
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
    }).then(function (response) {
        return response.json();
    }, function (reason) { console.log(reason); })
        .then(function (json) {
        console.log('Displaying on webpage - directory path: ', json.path);
        var jsonDataDiv = document.createElement('div');
        jsonDataDiv.innerHTML = JSON.stringify(json);
        document.body.appendChild(jsonDataDiv);
    })["catch"](function (error) {
        console.error(error);
    });
}