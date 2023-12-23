
const fs = require('fs');
const http = require('http');
const  url = require('url');

///////////////////////////////////////
///Files
//blocking ,synchronous way
// const text_s = fs.readFileSync('./txt/input.txt','utf-8');
// console.log(text_s);
// const text_o = `thia sis a new generated line ${text_s} ans its is created on the following date \n${Date.now()}`;
// fs.writeFileSync('./txt/output.txt', text_o);
// console.log("program written in output.txt");

//non blocking, asynchrounous way
// fs.readFile('./txt/startt.txt','utf-8',(err,data1)=>{
//     if(err){
//         return console.log('error');
//     }
//     fs.readFile(`./txt/${data1}.txt`,'utf-8',(err,data2)=>{
//         console.log(data2);
//         fs.readFile('./txt/append.txt','utf-8',(err,data3)=>{
//             console.log(data3);
//             fs.writeFile('./txt/final.txt',`${data2}\n${data3}`,'utf-8',err=>{
//                 console.log('your file has been written ')

//             });
//         });

//     });
//    // console.log(data);
// });
// console.log("will read file");


//////////////////////////////////////
///SERVER
const replaceTemplate = (temp,product) =>{
    let output = temp.replace(/{%PRODUCTNAME%}/g,product.productName);
    output = output.replace(/{%IMAGE%}/g,product.image);
    output = output.replace(/{%PRICE%}/g,product.price);
    output = output.replace(/{%FROM%}/g,product.from);
    output = output.replace(/{%NUTRIENTS%}/g,product.nutrients);
    output = output.replace(/{%QUANTITY%}/g,product.quantity);
    output = output.replace(/{%DESCRIPTION%}/g,product.description);
    output = output.replace(/{%ID%}/g,product.id);

    if(!product.organic)
    output = output.replace(/{%NOT_ORGANIC%}/g,'not-organic');
    return output;
}

const tempOverview = fs.readFileSync(`${__dirname}/template-overview.html`,'utf-8');
const tempCard= fs.readFileSync(`${__dirname}/template-card.html`,'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/template-product.html`,'utf-8');


const data = fs.readFileSync(`${__dirname}/data.json`,'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer((req,res)=>{
    const pathName = req.url;
    
    if(pathName === '/' || pathName ==='/overview'){
        res.writeHead(200 ,{'Content-type':'text/html'});
        const cardsHtml  =  dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        const  output =  tempOverview.replace('{%PRODUCT_CARDS%}',cardsHtml)
        res.end(output);
    }else if(pathName === '/products'){
        res.end('hello products from http server');
    }else if(pathName === '/api'){

            res.writeHead(200 ,{'Content-type':'application/json'});
            res.end(data);    
    }else{
        res.writeHead(404,{
            'Content-type' : 'text/html',
            'my-own-header': 'hello-world'

        });
        res.end('Error found');
    }
    
});
server.listen(9000,'127.0.0.1', () => {
    console.log('Hello HTTP SERVER I GOT YOU !!');
});




