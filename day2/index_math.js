// this is a example math utility module
const math = require('./math');
console.log(math.add(5, 3));       // 8

// or destructuring (very common)
const { add, PI } = require('./math');
console.log(add(10, 20));          // 30