// this is a example of using async/await in JavaScript
// async function that simulates fetching data
function getUserInfo(userID) {
  return new Promise((resolve, reject) => {
    console.log(`Fetching user info for userID: ${userID}...`);
    setTimeout(() => {
      const userInfo = { id: userID, name: "John Doe" };
      resolve(userInfo);
    }, 3000); // simulate 3 seconds delay
  });
}

// simulated get user oder function
function getUserOrders(userID) {
  return new Promise((resolve, reject) => {
    console.log(`Fetching user orders for userID: ${userID}...`);
    setTimeout(() => {
      const userOrders = [
        { id: 1, product: "Laptop" },
         { id: 2, product: "Mouse" }];
      resolve(userOrders);
    }, 2000); // simulate 2 seconds delay
  });
}

// simulated async function to fetch user info and orders
async function getUserData(userID) {
  try {
    const userInfo = await getUserInfo(userID);
    console.log("User Info fetched:", userInfo);
    const userOrders = await getUserOrders(userID);
    console.log("User Orders fetched:", userOrders);
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
}

// main app logic
// console.log("1 Start fetching user data");
// getUserData(101);
// console.log("2 Continue with other tasks while fetching user data");
(async () => {
    try {
        console.log("1 Start fetching user data");
        await getUserData(101);
        console.log("2 Finished fetching user data");
    }
    catch (error) {
        console.error("Error in main app logic:", error);
    }   
    console.log("3 Continue with other tasks while fetching user data");
})();