// example sync 
function greet(name, callback) {
  const msg = `Hello, ${name}`;
  callback(msg); // 立刻调用
}

greet("Eric", (message) => {
  console.log("Callback got:", message);
});
