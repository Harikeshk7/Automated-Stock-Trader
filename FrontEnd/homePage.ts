document.body.onload = initializeBalance;

function initializeBalance()
{
    let balance = 25000
    const app = document.getElementById("balance")!
    const p = document.createElement("p")
    p.innerHTML = "Balance: $"+balance
    app.append(p)
}

function runBot() {
    console.log('Typescript hit')
    const input = document.getElementById("stock_input") as HTMLSelectElement
    console.log('Input')
    const selectedStrings = Array.from(input.selectedOptions, option => option.value)
    console.log(selectedStrings)
  
    if (selectedStrings.length === 0) {
      console.error("No strings selected.")
      return;
    }
  
    const formData = new FormData();
    for (let i = 0; i < selectedStrings.length; i++) {
      const string = selectedStrings[i]
      formData.append("strings[]", string)
    }
    const local_hostUrl = `http://localhost:5000/upload`;
  
    fetch(local_hostUrl, {
      method: "POST",
      body: formData,
    })
    .then((response) => {return response.json()}, (reason) => { console.log(reason) })
    .then(json => {
        console.log('Displaying on webpage - directory path: ', json.path)

        const balanceArea = document.getElementById("balance")!
        balanceArea.innerHTML = "Balance: $"+(json.JsonList.total_capital).toFixed(2)

      })
      .catch(error => {
        console.error(error)
      })
  }