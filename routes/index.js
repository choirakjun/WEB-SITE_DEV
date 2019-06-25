
var express=require('express')
var router =express.Router();
var template = require('../lib/template.js');
var mysql      = require('mysql');
var db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'crj1179023',
  database : 'rakjun'
});

db.connect();


//홈페이지 구현
router.get('/',function(request,response){

    var title = 'Rakjun\'s Portfolio ';
    var description = `
    <div class="text-center mt-4">
        <i class="fas fa-download mr-2"></i>
        <p style="font-family:맑은 고딕; font-size:15px; font-weight:bold; color:blue;">
            '최락준' 개발자 소개 페이지 입니다.
            <br>평촌고등학교를 졸업 하였으며 (2019)현재 국민대학교 소프트웨어학부에 재학 중입니다.
            <br>2018'12 ~ 2019'02 'EPOPCON'에서 데이터엔지니어로 인턴 경험. 빅데이터플랫폼구축 및 데이터이관 작업을 했습니다.(Stack: Python,Cloudera.Hbase,Hive,Sql,Presto,Airflow)
            <br>

                <div style="color:red;">
                <h3>Interested In</h3></div>
            :Web Back-end,Game-Client,Date Engineering

            <div style="color:red;">
            <h3>Stack</h3></div>
        :Python, Java, C++, Javascript, Nodejs, Raspberrypi, SQL, Hbase, Hive, Presto, Unity


        </p>
      </a>
    </div>
    <br>
    `;
      var list = template.list(request.list);
      var html = template.HTML(title, list,
        `<h2>${title}</h2>${description}
        <img src="/images/rak_jun.jpg" style="width:200px; height:200px; display:block; margin-top:10px;">
        <br>

        `,
        `
        <h4>Add Portfolio page</h4>
        <a href="/topic/create">ADD</a>`
      );
      response.send(html);


});
module.exports=router;
