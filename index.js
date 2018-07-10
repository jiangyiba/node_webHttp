//引入模块
let http = require('http');
let path = require('path');
let fs = require('fs');
//根目录路径
let rootPath = path.join(__dirname,"www");
//开启
let server = http.createServer((request,response)=>{
    //返回的绝对路径
    let filePath = path.join(rootPath,request.url);
    console.log(filePath);
    let exists = fs.existsSync(filePath)
    //判断有没有文件,有文件才执行
    if(exists) {
        fs.readdir(filePath,(err,files)=>{
            if(err) {
                console.log(err);
                //进入到这里说明是文件
                fs.readFile(filePath,(err,data)=>{
                    response.end(data);
                })
            }else{
                console.log(files);
                //判断有没有index.html 有首页直接读取首页,没有则返回列表
                if(files.indexOf('index.html') != -1) {
                    fs.readFile(path.join(filePath,"index.html"),(err,data)=>{
                        if(err) {
                            console.log(err);
                        }else{
                            response.end(data);
                        }
                    })
                }else{
                    //如果没有首页则返回列表
                    let backData = '';
                    for(let i = 0; i < files.length; i++) {
                        backData+= `<h3><a href='./${files[i]}'>${files[i]}</a></h3>`;
                    }
                    console.log(backData);
                    response.writeHead(200,{"content-type":"text/html;charset=utf-8"});
                    response.end(backData);

                }
            }
        })
    }else{
        //没有则返回404,和文件不存在
        response.writeHead(404,{'content-type':'text/html;charset=utf-8'});
        response.end(`
        <h1>404</h1>
        <h3>文件不存在......</h3>
        `);
    }
}).listen(8080,"127.0.0.1",()=>{
    console.log('hay!!!it');
})