// 'https://stocks3.onrender.com/api/stocks/getstocksdata';
let selectedTimeLine = "3mo";
let selectedStock = "DIS";
let xAxisData, yAxisData;
const stocks = [
  "AAPL",
  "GOOGL",
  "MSFT",
  "AMZN",
  "PYPL",
  "TSLA",
  "JPM",
  "NVDA",
  "NFLX",
  "DIS",
];
const canvas = document.getElementById("myChart");
const ctx = canvas.getContext("2d");
let myChart;

const stockSummary = document.getElementById("stock-summary");
const section2 = document.getElementById("section2");

async function fetchData() {
  const url1 = "https://stocks3.onrender.com/api/stocks/getstocksdata";
  const url2 = "https://stocks3.onrender.com/api/stocks/getstocksprofiledata";
  const url3 = "https://stocks3.onrender.com/api/stocks/getstockstatsdata";

  try {
    const response = await fetch(url1);
    const data = await response.json();
    const stock = data.stocksData[0][selectedStock];
    const stockWithTimeline = stock[selectedTimeLine];
    xAxisData = stockWithTimeline.timeStamp.map((timestamp) => {
      const date = new Date(timestamp * 1000);
      const day = date.getDate();
      const month = date.toLocaleString("default", { month: "short" });
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    });
    yAxisData = stockWithTimeline.value;
    clearCanvas();
    plotGraph(xAxisData, yAxisData);
    console.log(selectedStock, selectedTimeLine);

    try {
      const response2 = await fetch(url2);
      const data2 = await response2.json();
      const summary = data2.stocksProfileData[0][selectedStock].summary;

      try {
        const responce3 = await fetch(url3);
        const data3 = await responce3.json();
        const bookValue = Number(data3.stocksStatsData[0][selectedStock].bookValue).toFixed(2);
        const profit = Number(data3.stocksStatsData[0][selectedStock].profit).toFixed(2);
        console.log(
          data3.stocksStatsData[0][selectedStock].bookValue,
          data3.stocksStatsData[0][selectedStock].profit
        );
        console.log(data2.stocksProfileData[0][selectedStock].summary);
        if (profit<=0){
            stockSummary.innerHTML = `<div id="stock-strip">
                                    <span id="stock-name">${selectedStock}</span>
                                    <span id="bookValue">$ ${bookValue}</span>
                                    <span id="profit" style="color:red;">${profit} %</span>
                                </div>
                                <div id="summary">${summary}</div>`;
        }else{
            stockSummary.innerHTML = `<div id="stock-strip">
                                    <span id="stock-name">${selectedStock}</span>
                                    <span id="bookValue">$ ${bookValue}</span>
                                    <span id="profit" style="color:green;">${profit} %</span>
                                </div>
                                <div id="summary">${summary}</div>`;
        }
        
        const myObj = data3.stocksStatsData[0];
        console.log(myObj);
        section2.innerHTML="";
        for (let i = 0; i < Object.keys(myObj).length - 1; i++) {
          const key = Object.keys(myObj)[i];
          const profit1= Number(myObj[key].profit).toFixed(2);
          const bookValue1 = Number(myObj[key].bookValue).toFixed(2);
          console.log(typeof bookValue, typeof profit);
          console.log("$", bookValue, profit, "%");
          if (myObj[key].profit <= 0) {
            const ele = `<div class="stock-stats">
            <span>
              <button class="timeline-btns" onclick="selectThisStock(this)">
                ${key}
              </button>
            </span>
            <span>
              <h3 >$ ${bookValue1}</h3>
            </span>
            <span>
              <h3 style="color:red;">${profit1} %</h3>
            </span>
          </div>`;
            section2.insertAdjacentHTML("beforeend", ele);
          } else {
            const ele = `<div class="stock-stats">
            <span>
              <button class="timeline-btns" onclick="selectThisStock(this)">
                ${key}
              </button>
            </span>
            <span>
              <h3 >$ ${bookValue1}</h3>
            </span>
            <span>
              <h3 style="color:green;">${profit1} %</h3>
            </span>
          </div>`;
            section2.insertAdjacentHTML("beforeend", ele);
          }

          // console.log(myObj[key]);
        }
      } catch (err) {
        console.log("Error aa gaya...", err);
      }
    } catch (err) {
      console.log(err);
    }
  } catch (err) {
    console.log("Error while fetching data occurred: ", err);
  }
}

fetchData();

function clickHandler(btn) {
  selectedTimeLine = btn.id.toString();
  console.log(selectedStock, selectedTimeLine);
  fetchData();
}

function selectThisStock(stk) {
  selectedStock = stk.textContent.trim();
  //   selectedTimeLine = "1mo"; // by default any stock selected first graph will be of 1m timeline of that stock
  console.log(typeof selectedStock, typeof selectedTimeLine);
  fetchData();
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function plotGraph(xAxisData, yAxisData) {
  if (
    !xAxisData ||
    !yAxisData ||
    xAxisData.length === 0 ||
    yAxisData.length === 0
  ) {
    console.log("No data to plot");
    return;
  }

  if (myChart) {
    myChart.destroy();
  }

  myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: xAxisData,
      datasets: [
        {
          label: `${selectedStock} data of ${selectedTimeLine}.`,
          data: yAxisData,
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: false,
        },
      },
    },
  });
}
