
//EXPRESS쓰면 가독성이 좋다.
//Routing. '/'경로를 만난뒤에 적용할 콜배함수.
//Middleware사용가능하다.

var express=require('express')
var app =express();
var fs = require('fs');
var path = require('path');
var qs = require('querystring');//URL모듈로 URL PARSEING등을 할 수 있다.
var template = require('./lib/template.js');
var mysql      = require('mysql');
var db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'crj1179023',
  database : 'rakjun'
});

db.connect();



//MIDDLEWARE를 사용. npm install body-parser. body는 브라우저에서 요청한 정보의  본체. 본체를 설명하는 것은 헤더다.
//Middleware를 통해 request와 response객체를 변경할 수 있고 그 다음 미들웨어를 무엇을 실행시킬지 결정할 수 있다.
var bodyParser = require('body-parser');


//Express router. router를 가져온다.
var indexRouter=require('./routes/index');
var topicRouter = require('./routes/topic');


//app.use 미들웨어가 제일 먼저 실행되고 compression이 실행되고 그 다음에 *가 실행되면서 특정 경로의 미들웨어가 실행된다
//서로가 연결해주는 점이라는 점에서 미들웨어로 쓰인다고 할 수 있다.


//정적인 이미지파일 서비스 시작.
app.use(express.static('public'));//public dir안에서 static서비스의 소스를 가져온다. 다른 경로에서는 정적인 파일을 가져오지 못하게 하는 보안측면에서도 의미가 있다.

app.use(bodyParser.urlencoded({extended:false}));//app.use안에 boyyparser가 만들어내는 미들웨어가 들어온다. main.js 실행될 떄 마다 미들웨어도 실행된다.

//app.use(function(request,response,next){

//})
// 위처럼 구현되어 있던 사용자 정의 middleware에 대해서 들어오는 모든 요청이 아닌 get방식 요청에 대해서만 파일목록을 udpate해 가면서 가지고 있다. post방식에서는 request.list할 때 밑의 fsreadir이 실행되지않아있다.
//
//
// Middleware만들기. 글 목록 표현. 이제 request객체에 list property에 모든 목록이 담긴다.


app.get('*',function(request,response,next){
      db.query('SELECT title from page',function(error,topics){
        request.list=topics;
        next();//next라는 변수에 담긴 그 다음에 호출되어야 할 미들웨어를 실행시킨다.

      });

  });


app.use('/',indexRouter);
//'/topic'으로 실행하는 주소에 topicrouter 미들웨어를 적용한다.
app.use('/topic',topicRouter);//topic경로로 오는것들에 대해서 topicrouter함수를 실행




app.listen(4000, function() {
 console.log('Example app listening on port 3000!')
});

// //페이지생성
// app.get('/topic/create',function(request,response){
//
//     var title = 'WEB - create';
//     var list = template.list(request.list);
//     var html = template.HTML(title, list, `
//       <form action="/topic/create_process" method="post">
//       <p><input type="text" name="title" placeholder="title"></p>
//       <p>
//       <textarea name="description" placeholder="description"></textarea>
//       </p>
//       <p>
//       <input type="submit">
//       </p>
//       </form>
//       `, '');
//       response.send(html);
//
//   });
//

  // //페이지 생성 프로세스. 생성된 데이터 받아서 처리한다.
  // app.post('/topic/create_process',function(request,response){
  //
  //         //middleware인 body-parser를 가져와서 request data를 따로따로 가져와서 모으지않고
  //         //request의 body property에 바로 접근가능하다.
  //       /*
  //       var body = '';
  //       request.on('data', function(data){
  //           body = body + data;
  //       });
  //       request.on('end', function(){
  //       */
  //       var post =   request.body;
  //       var title = post.title;
  //       var description = post.description;
  //       fs.writeFile(`data/${title}`, description, 'utf8', function(err){
  //         response.redirect(302,`/topic/${title}`);
  //       })
  //   });
//
//   app.get('/topic/update/:pageId',function(request,response){
//
//         var filteredId = path.parse(request.params.pageId).base;
//         fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
//           var title = request.params.pageId;
//           var list = template.list(request.list);
//           var html = template.HTML(title, list,
//             `
//             <form action="/topic/update_process" method="post">
//               <input type="hidden" name="id" value="${title}">
//               <p><input type="text" name="title" placeholder="title" value="${title}"></p>
//               <p>
//                 <textarea name="description" placeholder="description">${description}</textarea>
//               </p>
//               <p>
//                 <input type="submit">
//               </p>
//             </form>
//             `,
//             `<a href="/topic/create">create</a> <a href="/topic/update?id=${title}">update</a>`
//           );
//           response.send(html);
//         });
//
//
//
//     });
//
// app.post('/topic/update_process',function(request,response){
//     /*
//       var body = '';
//       request.on('data', function(data){
//           body = body + data;
//       });
//       request.on('end', function(){
//     */
//           var post = request.body;
//           var id = post.id;
//           var title = post.title;
//           var description = post.description;
//           fs.rename(`data/${id}`, `data/${title}`, function(error){
//             fs.writeFile(`data/${title}`, description, 'utf8', function(err){
//               response.redirect(302,`/topic/${title}`);
//
//             })
//           });
//       });
//
//
//   app.post('/topic/delete_process',function(request,response){
//           /*
//             var body = '';
//             request.on('data', function(data){
//                 body = body + data;
//             });
//             request.on('end', function(){
//           */
//             var post = request.body;
//             var id = post.id;
//             var filteredId = path.parse(id).base;
//             fs.unlink(`data/${filteredId}`, function(error){
//               response.redirect('/');
//             })
//         });
//
//
// //상세페이지 구현.post방식의 경우는 app.post로 사용한다.Route paramter를 사용한다. ~/page/html 의 경우 pageId로 html이 매칭된다.
// app.get('/topic/:pageId',function(request,response,next){
//   //html값이 request.params에 들어가 있다. pageId 마크를 통해 사용자 입력을 parsing할 수 있다.
//   //return response.send(request.params);
//     var filteredId = path.parse(request.params.pageId).base;
//     fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
//
//       if(err){
//         //정상적인 상황이면 next(); 혹은 next('route') 다음 미들웨어를 호출하는것 ;.
//         next(err);//error메시지를 다음 실행할 것으로 보낸다.
//       }
//       else{
//         var title = request.params.pageId;
//         var sanitizedTitle = sanitizeHtml(title);
//         var sanitizedDescription = sanitizeHtml(description, {
//           allowedTags:['h1']
//         });
//         var list = template.list(request.list);
//         var html = template.HTML(sanitizedTitle, list,
//           `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
//           ` <a href="/topic/create">create</a>
//             <a href="/topic/update/${sanitizedTitle}">update</a>
//             <form action="/topic/delete_process" method="post">
//               <input type="hidden" name="id" value="${sanitizedTitle}">
//               <input type="submit" value="delete">
//             </form>`
//         );
//         response.send(html);
//
//       }
//
//     });
//
// });
//
// //Middleware는 순차적으로 진행되는데 여기까지 온 것은 앞에 한 번도 실행된것이 없다는
// app.use(function(req,res,next){
//   res.status(404).send('Soory can\'t find that!');
// })
//
// //페이지찾을 수 없는 err(next통해 전달받은 err)가 넘어온다.
// app.use(function(err,req,res,next){
//   console.error(err.stack);
//   res.status(500).send('Something broke!');
// })
//
//
// //웹 서버 실행되면서 3000포트 listening하고 성공하면 해당 코드가 실행된다.
// app.listen(4000,function(){
//
//   console.log('Example app listening on port 3000!');
//
// });


//--------------------------------------------------------------------------------------
/*
var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    if(pathname === '/'){
      if(queryData.id === undefined){
        fs.readdir('./data', function(error, filelist){
          var title = 'Welcome';
          var description = 'Hello, Node.js';
          var list = template.list(filelist);
          var html = template.HTML(title, list,
            `<h2>${title}</h2>${description}`,
            `<a href="/create">create</a>`
          );
          response.writeHead(200);
          response.end(html);
        });
      } else {
        fs.readdir('./data', function(error, filelist){
          var filteredId = path.parse(queryData.id).base;
          fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
            var title = queryData.id;
            var sanitizedTitle = sanitizeHtml(title);
            var sanitizedDescription = sanitizeHtml(description, {
              allowedTags:['h1']
            });
            var list = template.list(filelist);
            var html = template.HTML(sanitizedTitle, list,
              `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
              ` <a href="/create">create</a>
                <a href="/update?id=${sanitizedTitle}">update</a>
                <form action="delete_process" method="post">
                  <input type="hidden" name="id" value="${sanitizedTitle}">
                  <input type="submit" value="delete">
                </form>`
            );
            response.writeHead(200);
            response.end(html);
          });
        });
      }
    } else if(pathname === '/create'){
      fs.readdir('./data', function(error, filelist){
        var title = 'WEB - create';
        var list = template.list(filelist);
        var html = template.HTML(title, list, `
          <form action="/create_process" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
              <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
              <input type="submit">
            </p>
          </form>
        `, '');
        response.writeHead(200);
        response.end(html);
      });
    } else if(pathname === '/create_process'){
      var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
          var title = post.title;
          var description = post.description;
          fs.writeFile(`data/${title}`, description, 'utf8', function(err){
            response.writeHead(302, {Location: `/?id=${title}`});
            response.end();
          })
      });
    } else if(pathname === '/update'){
      fs.readdir('./data', function(error, filelist){
        var filteredId = path.parse(queryData.id).base;
        fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
          var title = queryData.id;
          var list = template.list(filelist);
          var html = template.HTML(title, list,
            `
            <form action="/update_process" method="post">
              <input type="hidden" name="id" value="${title}">
              <p><input type="text" name="title" placeholder="title" value="${title}"></p>
              <p>
                <textarea name="description" placeholder="description">${description}</textarea>
              </p>
              <p>
                <input type="submit">
              </p>
            </form>
            `,
            `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
          );
          response.writeHead(200);
          response.end(html);
        });
      });
    } else if(pathname === '/update_process'){
      var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
          var id = post.id;
          var title = post.title;
          var description = post.description;
          fs.rename(`data/${id}`, `data/${title}`, function(error){
            fs.writeFile(`data/${title}`, description, 'utf8', function(err){
              response.writeHead(302, {Location: `/?id=${title}`});
              response.end();
            })
          });
      });
    } else if(pathname === '/delete_process'){
      var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
          var id = post.id;
          var filteredId = path.parse(id).base;
          fs.unlink(`data/${filteredId}`, function(error){
            response.writeHead(302, {Location: `/`});
            response.end();
          })
      });
    } else {
      response.writeHead(404);
      response.end('Not found');
    }
});
app.listen(3000);
*/
