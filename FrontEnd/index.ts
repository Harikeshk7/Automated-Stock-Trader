// This function uses the Fetch API to send a POST request to the 
// "/upload" endpoint on the backend with the selected CSV file as a FormData object

function uploadFile() {
  console.log('Typescript hit2')
  const input = document.getElementById("fileInput") as HTMLInputElement;
  const file = input.files?.[0];

  if (!file) {
    console.error("No file selected.");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);
  const local_hostUrl = `http://localhost:5000/upload`;

  fetch(local_hostUrl, {
    method: "POST",
    body: formData,
  }).then((response) => {
    // console.log('resp ', response)
    return response.json()
  },
    (reason) => { console.log(reason) })
    .then(json => {
      console.log('Displaying on webpage')

      const jsonDataDiv = document.createElement('div');
      jsonDataDiv.innerHTML = JSON.stringify(json);
      document.body.appendChild(jsonDataDiv);
      // console.log('Data is being read = ', json)

    })
    .catch(error => {
      console.error(error);
    });
}
