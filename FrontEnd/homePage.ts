document.body.onload = initializeBalance;
document.body.onload = initializeGraph;

interface Action
{
  type: string,
  price: number,
  shares: number,
  time: string,
  stock: string
}

function compareTime(a:Action, b:Action)
{
  if (a.time < b.time)
  {
    return -1
  }
  if (a.time > b.time)
  {
    return 1
  }
  return 0
}

function convertTimeString(time: any): string
{
  if (time == null)
    time = ''

  var match = time.match(/(\d{4})\-(\d{1,2})\-(\d{1,2}) (\d{1,2}:\d{1,2})/)
  return (match[2]+"/"+match[3]+"/"+match[1]+" "+match[4])
}

function initializeBalance()
{
    let balance = 10000
    const app = document.getElementById("balance")!
    const p = document.createElement("p")
    p.innerHTML = "Balance: $"+balance
    app.append(p)
}

function writeLog(history: Action[])
{
  const actionList:Action[] = []
  for (let i = 0; i < history.length; i++)
  {
    const currentAction = history[i];
    const newAction:Action = {
      type: currentAction.type,
      price: currentAction.price,
      shares: currentAction.shares,
      time: currentAction.time,
      stock: currentAction.stock
    }
    actionList.push(newAction)
  }
  actionList.sort(compareTime)
  const popupText = document.getElementById("logPopup")!
  for (let i = 0; i < actionList.length; i++)
  {
    const action = document.createTextNode(actionList[i].type+" "+actionList[i].shares.toFixed(2)+" shares of "
    +actionList[i].stock+" at $"+actionList[i].price.toFixed(2)+" at "+convertTimeString(actionList[i].time))
    popupText.appendChild(action)
    popupText.appendChild(document.createElement("br"))
  }
}

function displayLog()
{
  const popupText = document.getElementById("logPopup")!
  const popupButton = document.getElementById("logButton")!
  if (popupText.style.display === "none")
  {
    popupText.style.display = "block"
    popupButton.innerHTML = "Hide Log"
  }
  else
  {
    popupText.style.display = "none"
    popupButton.innerHTML = "Display Log"
  }
}

function initializeGraph()
{
  
}

function createPriceArray(history: Action[])
{
  let currentPrice = 10000
  let boughtPrice = 0
  let soldPrice = 0
  const prices:{x: string,y: number}[] = [{x: '2022-10-06 09:30', y: 10000}]
  for (let i = 0; i < history.length; i++)
  {
    if (history[i].type == "Bought")
    {
      boughtPrice = history[i].shares * history[i].price
    }
    if (history[i].type == "Sold")
    {
      soldPrice = history[i].shares * history[i].price
      currentPrice += soldPrice - boughtPrice
      prices.push({x: history[i].time, y: currentPrice})
    }
  }
}

function runBot() {
  console.log('Typescript hit')
  const input = document.getElementById("stockInput") as HTMLSelectElement
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
  const local_hostUrl = 'http://localhost:5000/upload'; // http://localhost:5000/

  fetch(local_hostUrl, {
    method: "POST",
    body: formData,
  })
  .then((response) => {return response.json()}, (reason) => { console.log(reason) })
  .then(json => {
      console.log('Displaying on webpage - directory path: ', json.path)

      const balanceArea = document.getElementById("balance")!
      balanceArea.innerHTML = "Balance: $"+(json.JsonList.total_capital).toFixed(2)

      const completeLog = document.getElementById("completeLog")!
      completeLog.style.display = "inline"
      writeLog(json.JsonList.history)

    })
    .catch(error => {
      console.error(error)
    })
}

  /*function runBot() {
    const input = document.getElementById("stockInput") as HTMLSelectElement;
    const selectedStrings = Array.from(input.selectedOptions, (option) => option.value);
  
    if (selectedStrings.length === 0) {
      console.error("No strings selected.");
      return;
    }
  
    const formData = new FormData();
    for (let i = 0; i < selectedStrings.length; i++) {
      const string = selectedStrings[i];
      formData.append("strings[]", string);
    }
  
    const local_hostUrl = `http://localhost:5000/upload`;
  
    // Define a function to handle the response
    const handleResponse = (json: {path: string, JsonList: {history: Action[], total_capital: number}}) => {
      setTimeout(() => {
        const balanceArea = document.getElementById("balance")!;
        balanceArea.innerHTML = "Balance: $" + json.JsonList.total_capital.toFixed(2);
    
        const completeLog = document.getElementById("completeLog")!;
        completeLog.style.display = "inline";
        writeLog(json.JsonList.history);
      }, 0);
    };
  
    // Define a function to make a POST request and handle the response
    const fetchData = () => {
      fetch(local_hostUrl, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then(handleResponse)
        .catch((error) => {
          console.error(error);
        });
    };
  
    // Call the fetchData function every 5 seconds
    setInterval(fetchData, 5000);
  }*/

  /*function runBot() {
    console.log('Typescript hit')
    const input = document.getElementById("stockInput") as HTMLSelectElement
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
    const local_hostUrl = 'http://localhost:5000/upload';
  
    fetch(local_hostUrl, {
      method: "POST",
      body: formData,
    })
    .then((response) => {return response.json()}, (reason) => { console.log(reason) })
    .then(json => {
        console.log('Displaying on webpage - directory path: ', json.path)
  
        const balanceArea = document.getElementById("balance")!
        balanceArea.innerHTML = "Balance: $"+(json.JsonList.total_capital).toFixed(2)
  
        const completeLog = document.getElementById("completeLog")!
        completeLog.style.display = "inline"
        writeLog(json.JsonList.history as Action[])
  
      })
      .catch(error => {
        console.error(error)
      })
  }*/

  /*function runBot() {
    console.log('Typescript hit')
    const input = document.getElementById("stockInput") as HTMLSelectElement
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
    const local_hostUrl = 'http://localhost:5000/upload';
  
    const balanceArea = document.getElementById("balance")!;
    const completeLog = document.getElementById("completeLog")!;
  
    // Fetch data every 5 seconds
    setInterval(() => {
      fetch(local_hostUrl, {
        method: "POST",
        body: formData,
      })
      .then((response) => {return response.json()}, (reason) => { console.log(reason) })
      .then(json => {
        console.log('Displaying on webpage - directory path: ', json.path);
      
        const { total_capital, history } = json.JsonList;
      
        balanceArea.innerHTML = "Balance: $" + total_capital.toFixed(2);
      
        completeLog.style.display = "inline";
        writeLog(history);
      })
      
        .catch(error => {
          console.error(error)
        })
    }, 5000);
  }*/