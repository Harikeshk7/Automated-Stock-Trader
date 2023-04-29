import { Chart } from 'chart.js/auto'

document.body.onload = function() {
  initializeBalance()
  initializeChart()
}

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
    const currentAction = history[i]
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

export function displayLog()
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

function initializeChart()
{
  const ctx = document.getElementById('balanceChart') as HTMLCanvasElement
  new Chart(ctx, {
    type: 'line',
    data: {
      datasets: [{
        data: [10000],
        borderWidth: 1,
      }],
      labels: ['2022-10-06 09:30']
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false,
              } } } 
  });
}

function sleep(ms: number)
{
  return new Promise(resolve => setTimeout(resolve,ms))
}

function updateTable(action: Action)
{
  const table = document.getElementById('ownedTable') as HTMLTableElement
  if (action.type == "Bought")
  {
    const row = table.tBodies[0].insertRow()
    const stockCell = row.insertCell()
    const sharesCell = row.insertCell()
    const valueCell = row.insertCell()
    stockCell.innerText = action.stock
    sharesCell.innerText = action.shares.toFixed(2).toString()
    valueCell.innerText = (action.shares * action.price).toFixed(2).toString()
  }
  if (action.type == "Sold")
  {
    table.tBodies[0].deleteRow(-1)
  }
}

async function updatePage(history: Action[])
{
  const chart = Chart.getChart('balanceChart')
  const balanceArea = document.getElementById("balance")!
  let balance = 10000
  for (let i = 0; i < history.length; i++)
  {
    if (history[i].type == "Bought")
    {
      balance -= history[i].price * history[i].shares
      await sleep(3000)
      updateTable(history[i])
    }
    if (history[i].type == "Sold")
    {
      balance += history[i].price * history[i].shares
      chart!.data.datasets[0].data.push(balance)
      chart!.data.labels!.push(history[i].time)
      await sleep(3000)
      balanceArea.innerHTML = "Balance: $"+(balance).toFixed(2)
      updateTable(history[i])
      chart!.update()
    }
  }
}

export function runBot() {
  console.log('Typescript hit')
  const stockInput = document.getElementById("stockInput") as HTMLSelectElement
  const algoInput = document.getElementById("algoInput") as HTMLSelectElement
  console.log('Input')
  const selectedStrings = Array.from(stockInput.selectedOptions, option => option.value)
  const algorithm = algoInput.value

  if (selectedStrings.length === 0) {
    console.error("No strings selected.")
    return;
  }
  if (algorithm === 'Select')
  {
    console.error("No algorithm selected.")
    return;
  }

  const formData = new FormData();
  for (let i = 0; i < selectedStrings.length; i++) {
    const string = selectedStrings[i]
    formData.append("strings[]", string)
  }
  formData.append("algorithm", algorithm)
  const local_hostUrl = 'http://localhost:5000/upload';

  fetch(local_hostUrl, {
    method: "POST",
    body: formData,
  })
  .then((response) => {return response.json()}, (reason) => { console.log(reason) })
  .then(json => {
      console.log('Displaying on webpage - directory path: ', json.path)

      writeLog(json.JsonList.history)
      updatePage(json.JsonList.history)

      const completeLog = document.getElementById("completeLog")!
      completeLog.style.display = "inline"
    })
    .catch(error => {
      console.error(error)
    })
}