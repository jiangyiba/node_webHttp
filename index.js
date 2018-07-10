//引入node模板
let http = require('http');
let fs = require('fs');
let path = require('path');
let querystring = require('querystring');
//引入第三方的模板,设置文件的识别码
let mime = require('mime');
//设置服务器的根目录
let rootPath = path.join(__dirname,'www');

//开启服务器
let server = http.createServer((request,response)=>{
    //创建绝对路径并且完成根目录下的中文url解码
    let filesPath = path.join(rootPath,querystring.unescape(request.url));
    //判断根目录的路径是否存在
    let isYes = fs.existsSync(filesPath);
    if(isYes) {
        //如果有则进来判断是否为文件夹
        fs.readdir(filesPath,(err,file)=>{
            if(err){
                //进入这里说明不是文件夹,直接读取文件返回数据
                fs.readFile(filesPath,(err,data)=>{
                    if(err) {
                        console.log(err);
                    }else{
                        response.end(data);
                    }
                })
            }else{
                //进入这里说明是文件夹,判断是否为index.html
                console.log(file);
                
                if(file.indexOf('index.html') != -1){
                    //如果有直接读取文件,当做主页
                    fs.readFile(path.join(filesPath,'index.html'),(err,data)=>{
                        if(err) {
                            console.log(err);
                        }else{
                            response.writeHead(200,{"content-type":"text/html;charset=utf-8"});
                            response.end(data);
                        }
                    })
                }else{
                    //没有index.html则返回文件列表
                    let backData = '';
                    for(let i = 0; i < file.length; i++) {
                        backData += `<h3><a href="${request.url == '/'?'':request.url}/${file[i]}">${file[i]}</a></h3>`
                    }
                    response.writeHead(200,{"content-type":"text/html;charset=utf-8"});
                    response.end(backData);
                }
            }
        })

        
    }else{
        //如果没有则返回没有这个页面 状态码改成404
        response.writeHead(404,{"content-type":"text/html;charset=utf-8"});
        response.end(`
        <h1>404</h1>
        <h3>文件不存在......</h3>
        `)
    }
    
}).listen(8080,"127.0.0.1",()=>{
    console.log('服务器开启');
    
})


// 引入了第三方代码
//npm install mime