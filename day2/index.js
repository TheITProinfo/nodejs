// this ia a example with built-in modules
const os = require('os');
const fs = require('fs');
const path = require('path');
const http = require('http');
console.log('Hello World');
console.log('This is a simple Node.js application using built-in modules.');
console.log(`Current directory: ${__dirname}`);
// os module
console.log('operating system info:',os.platform(), os.release());
console.log('Total Memory:', os.totalmem());
// os mudule
// fs module
console.log('CPU core:', os.cpus().length);
// fs module example
const filePath = path.join(__dirname, 'example03.txt');
fs.writeFile(filePath, 'This is an example03 file created using fs module.',(err) => {
    if (err) {
        console.error('Error writing file:', err);
        return;
    };
    console.log('File written successfully.');
});

// read the file
const data=fs.readFile(filePath, 'utf8',(err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }
    console.log('File read successfully. file content:', data);
});