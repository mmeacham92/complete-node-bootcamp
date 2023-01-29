const fs = require("fs");

// Blocking, synchronous method
// const textInput = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(textInput);

// const textOutput = `This is what we know about the avocado: ${textInput}. \nCreated on ${Date.now()}`;

// fs.writeFileSync('./txt/output.txt', textOutput);
// console.log("File written!");

// console.log("=========");
// console.log(fs.readFileSync("./txt/output.txt", "utf-8"));

// Non-blocking, asynchronous method
fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
    fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
        fs.readFile(`./txt/append.txt`, "utf-8", (err, data3) => {
            const output = `${data2}\n${data3}`;
            fs.writeFile('./txt/final.txt', output, () => {
                fs.readFile('./txt/final.txt', "utf-8", (err, data4) => {
                    console.log(data4);
                })
            });
            
        })
    })
})
console.log("Reading and writing files...");