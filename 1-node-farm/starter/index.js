const fs = require("fs");
const http = require("http");
const url = require("url");

// Blocking, synchronous method
// const textInput = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(textInput);

// const textOutput = `This is what we know about the avocado: ${textInput}. \nCreated on ${Date.now()}`;

// fs.writeFileSync('./txt/output.txt', textOutput);
// console.log("File written!");

// console.log("=========");
// console.log(fs.readFileSync("./txt/output.txt", "utf-8"));

// Non-blocking, asynchronous method
// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//     fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//         fs.readFile(`./txt/append.txt`, "utf-8", (err, data3) => {
//             const output = `${data2}\n${data3}`;
//             fs.writeFile('./txt/final.txt', output, () => {
//                 fs.readFile('./txt/final.txt', "utf-8", (err, data4) => {
//                     console.log(data4);
//                 })
//             });

//         })
//     })
// })
// console.log("Reading and writing files...");

const templateOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, "utf-8");
const templateProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, "utf-8");
const templateCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, "utf-8");

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const server = http.createServer((request, response) => {
    const { query, pathname } = url.parse(request.url, true);

    // overview page
    if (pathname === "/" || pathname === "/overview") {

        response.writeHead(200, { "Content-type": "text/html" });

        const cardsHTML = dataObj.map(product => replaceTemplate(templateCard, product)).join("");
        const output = templateOverview.replace('{%PRODUCT_CARDS%}', cardsHTML);

        response.end(output);

        // product page
    } else if (pathname === "/product") {
        console.log(query);
        const product = dataObj[query.id];
        response.writeHead(200, { "Content-type": "text/html" });
        const output = replaceTemplate(templateProduct, product);
        response.end(output);

        // API
    } else if (pathname === "/api") {
        response.writeHead(200, { 'Content-type': "application/json" });
        response.end(data);

        // not found
    } else {
        //adding a status code
        //headers must be set before we send a response (end)
        response.writeHead(404, {
            "Content-type": "text/html",
            "my-own-header": "hello-world",
        });
        response.end("<h1>Page not found!</h1>");
    }
});

server.listen(8000, "127.0.0.1", () => {
    console.log("Listening to requests on port 8000");
});

const replaceTemplate = (template, product) => {
    let output = template.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%ID%}/g, product.id);

    if (!product.organic) {
        output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
    }

    return output;
}
