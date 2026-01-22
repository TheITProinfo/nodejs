// example async with callback function
function fetchData(callback) {
  console.log("Fetching data...");
  setTimeout(() => {
    const data = "Some data";
    callback(null, data);
  }, 5000);
}

// main app logic
// 1 - 2 - 3 (非阻塞)
// 1 -start the order
// 2 - 2nd order
// 3  - data fetched successfully -maens 1st task is done
console.log("1 start- 1st order");
fetchData((err, data) => {
  if (err) {
    console.error("Error fetching data:", err);
  } else {
    console.log(" 3 Data fetched successfully: 1st order is done", data);
  }
});
console.log("2 2nd order");