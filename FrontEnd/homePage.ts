document.body.onload = initializeBalance;

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
    let balance = 1000
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
    const local_hostUrl = `/upload`;
  
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
        console.log('ERROR')
        console.error(error)
      })
  }