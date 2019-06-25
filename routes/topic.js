var express = require('express');
var router = express.Router();//topic.js에서는 express의 router메소드 호출한다.
var path=require('path');
var fs = require('fs');
var sanitizeHtml = require('sanitize-html');
var template = require('../lib/template.js');
var mysql      = require('mysql');
var db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'crj1179023',
  database : 'rakjun'
});
db.connect();




//페이지생성
router.get('/create',function(request,response){




    var title = 'WEB - create';
    var list = template.list(request.list);
    var html = template.HTML(title, list, `
      <form action="/topic/create_process" method="post">
      <p><input type="text" name="title" placeholder="title"></p>
      <p>
      <textarea name="description" placeholder="description"></textarea>
      </p>
      <p>
      <input type="submit">
      </p>
      </form>
      `, '');
      response.send(html);

  });


//페이지 생성 프로세스. 생성된 데이터 받아서 처리한다.
router.post('/create_process',function(request,response){

          //middleware인 body-parser를 가져와서 request data를 따로따로 가져와서 모으지않고
          //request의 body property에 바로 접근가능하다.
        /*
        var body = '';
        request.on('data', function(data){
            body = body + data;
        });
        request.on('end', function(){
        */
        var post =   request.body;
        var title = post.title;
        var description = '\''+post.description+'\'';
        console.log('description: '+description);
        console.log('title: '+title);
        db.query(`INSERT INTO page(title,data) values('${title}',${description})`,function(err,res){

          response.redirect(`/topic/${title}`);
        });

});




router.get('/update/:pageId', function(request, response){
       var filteredId = path.parse(request.params.pageId).base;
       db.query(`SELECT data from page where title='${filteredId}'`,function(err,description){
         var title = filteredId;
         var desc=description[0].data;
         var list = template.list(request.list);
         var html = template.HTML(title, list,
           `
           <form action="/topic/update_process" method="post">
             <input type="hidden" name="id" value="${title}">
             <p><input type="text" name="title" placeholder="title" value="${title}"></p>
             <p>
               <textarea name="description" placeholder="description">${desc}</textarea>
             </p>
             <p>
               <input type="submit">
             </p>
           </form>
           `,
           `<a href="/topic/create">create</a> <a href="/topic/update/${title}">update</a>`
         );
         response.send(html);
       })
});

router.post('/update_process', function(request, response){
       var post = request.body;
       console.log("post:",post);
       var id = post.id;
       var title = post.title;
       var description = post.description;
       console.log("id: ",id);
       console.log("title: ",title);
       console.log("description: ",description);
       db.query(`UPDATE page SET title='${title}', data='${description}' where title='${id}'`,function(err,result){
         if(err)
         {
           throw err;
         }
         response.redirect(`/topic/${title}`);
       })

     });



router.post('/delete_process',function(request,response){
          /*
            var body = '';
            request.on('data', function(data){
                body = body + data;
            });
            request.on('end', function(){
          */

            var post = request.body;
            var id = post.id;
            var filteredId = path.parse(id).base;
            console.log('filteredId: ',filteredId);
            db.query(`delete from page where title='${filteredId}'`,function(err,res){
              response.redirect(`/`);
            });
    });


//상세페이지 구현.post방식의 경우는 app.post로 사용한다.Route paramter를 사용한다. ~/page/html 의 경우 pageId로 html이 매칭된다.
router.get('/:pageId',function(request,response,next){
  //html값이 request.params에 들어가 있다. pageId 마크를 통해 사용자 입력을 parsing할 수 있다.
  //return response.send(request.params);
  var filteredId = path.parse(request.params.pageId).base;
  db.query(`Select data from page where title='${filteredId}'`,function(err,res){

      if(err)
      {
        throw err;
      }
      else{
      var title=`<h1>${filteredId}</h1>`;
      console.log('res: ',res);
      var description=res[0].data;

      var sanitizedTitle = sanitizeHtml(title);
      var sanitizedDescription = sanitizeHtml(description, {
        allowedTags:['h1']
      });


      var list=template.list(request.list);
      var html = template.HTML(sanitizedTitle, list,
        `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
        `

        <h4>Add Portfolio page</h4>
        <a href="/topic/create">ADD</a>
          <h4>Update Portfolio page</h4>
          <a href="/topic/update/${sanitizedTitle}">update</a>
          <h4>Delete Portfolio page</h4>
          <form action="/topic/delete_process" method="post">
            <input type="hidden" name="id" value="${sanitizedTitle}">
            <input type="submit" value="delete">
          </form>`
      );

      response.send(html);

      }
  });
});


//File바깥으로 export시킨다.
module.exports = router;
