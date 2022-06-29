// <정의>
// 1) views의 pug파일 form을 브라우저에서 열 수 있게 함수를 정의하는 곳
// 2) 여기서 함수를 작성 후 routes 폴더에서 만든 routes.js의 router를 적어 app.js에게 알린다

// <역할>
// 1) 내가 맡은 마이페이지 관련 실행 될 함수들 정의 (ex. render(파일) => 단, exports를 써야겠지)
// 2-1) require할 것들: models.js/db.js/

/*
★★★ 중요 ★★★
controller도 그냥 홈페이지만 띄우는 함수들(get) 따로 , 값 받아와서 처리하는 함수들(POST, DELETE, PUT등) 각각 다른 파일에 따로 작성
=> 페이지만 띄워주는 것과 처리가 필요한 페이지들을 구분하기 위함
★★★ 중요 ★★★
*/

const models = require("../models/models");
const bodyParser = require("body-parser");
const express = require("express");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ★핵심: 요청을 받았을 때 어떤 "미들웨어" 실행할래? => 해당 미들웨어 함수를 routes.js에서 실행
// Read - My Page
exports.rendermypage = (req, res) => {
  exports.currentUser = req.session.userID;
  if (!req.session.userID) {
    console.error("Error at result-mypage");
  } else {
    console.log(req.session.userID);
    models.readMypage().then((result) => {
      res.render("result-myPage", {
        userID: result[0].id,
        userName: result[0].name,
        userEmail: result[0].email,
        userAddr: result[0].addr,
      });
    });
  };
};

// Before Update - infoModify
exports.rendermypageModify = (req, res) => {
  if (!req.session.userID) {
    console.error("Error at infoModify");
  } else {
    models.readMypage().then((result) => {
      res.render("infoModify", {
        userid: result[0].id,
        username: result[0].name,
        useremail: result[0].email,
        useraddr: result[0].addr,
      });
    });
  };
};

// After Update - My page(patch)
exports.rendermypageButton = (req, res) => {
  if (!req.session.userID) {
    console.error("Error after modify UserInfo");
  } else {
    exports.modifyInfo = {
      name: req.body.modiname,
      email: req.body.modiemail,
      password: req.body.modipwd1,
    };
    if (req.body.modipwd1 !== req.body.modipwd2) {
      res.send(
        `<script>alert("비밀번호가 일치하지 않습니다");
      location.href='${"/modify"}';</script>`
      );
    } else {
      models.updateMypage().then(() => {
        res.redirect("/mypage");
      });
    }
  }
};

// Order Page
exports.renderOrderpage = (req, res) => {
  exports.currentUser2 = req.session.userID;
  if (!req.session.userID) {
    console.error("Error at myOrder");
  } else {
    models.renderOrder().then((result) => {
      res.render("myOrder", {
        itemName: result[0].itemname,
        itemCate: result[0].itemcate,
        itemPrice: result[0].itemprice,
        itemDate: result[0].itemdate.toLocaleString(),
      });
    });
  }
};

// Subs Page
exports.renderSubspage = (req, res) => {
  exports.currentUser3 = req.session.userID;
  if (!req.session.userID) {
    console.error("Error at mySubs");
  } else {
    models.renderSubs().then((result) => {
      res.render("mySubs", {
        subsName: result[0].subsname,
        subsDetail: result[0].subsdetail,
        subsDate: result[0].subsdate.toLocaleString(),
        subsPeriod: result[0].subsperiod.toLocaleString(),
      });
    });
  }
};


exports.rendermypageModify2 = (req, res) => {
  res.render("result-myPage");
};

exports.rendermypageQna = (req, res) => {
  res.render("qna");
};

exports.rendermypageQnaPost = (req, res) => {
  res.render("qnaList");
};

exports.rendermypageQnaList = (req, res) => {
  res.render("qnaList");
};
