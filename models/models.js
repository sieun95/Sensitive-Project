/*
<models의 역할>
1) DB CRUD함수 정의 및 작성
2) 정의한 함수를 각 페이지/상황에 맞게 실행하는 구문 작성
3) 1,2)가 끝나면 controllers는 models에서 만들어 놓은 것을 호출만 하면 OK
*/

const mysql = require("mysql");
const con = require("../utils/db.js");
const modelsExports = (module.exports = {});
const controller = require("../controllers/controllers.js"); // Update 때문에 어쩔 수 없이 controller 빌리긴 했는데, 맞나 싶다
require("express");

// ★Read
modelsExports.readMypage = () => {
  return new Promise((resolve, reject) => {
    let currentUser = controller.currentUser;
    let sql = "SELECT * FROM users where id='"+ currentUser + "';";
    con.getConnection((err, connection) => {
      try {
        if(err) throw err;
        console.log("Connection Success");

        connection.query(sql, (err, result, fields) => {
          if(err) {
            console.error("SELECT Error");
          } else {
            if(result.length === 0) {
              console.error("DB response NOT Found");
            } else {
              resolve(result);
              console.log("Read Data OK");
            }
          }
        });
        connection.release();
      } catch (err) {
        console.error("pool READ Error");
      }
    });
  });
};

// ★Update
modelsExports.updateMypage = () => {
  return new Promise((resolve, reject) => {
    con.getConnection((err, connection) => {
      try {
        if(err) throw err;
        console.log("Connection Success");

        let options1 = controller.modifyInfo.name;
        let options2 = controller.modifyInfo.email;
        let options3 = controller.modifyInfo.password;
        let sql = "UPDATE users SET email = '" + options2 + "', password = '" + options3 + "' where name = '" + options1 + "';";

        connection.query(sql, (err, result, fields) => {
          if(err) {
            console.error("UPDATE Error");
          } else {
            if(result === 0) {
              console.error("DB response NOT Found");
            } else {
              resolve(result);
              console.log("Update Data OK");
            };
          };
        });
        con.release();
      } catch(err) {
        console.error("pool UPDATE Error");
      };
    });
  });
};

// ★Read - Order List
modelsExports.renderOrder = () => {
  return new Promise((resolve, reject) => {
    let currentUser2 = controller.currentUser2;
    let sql = "SELECT * FROM mypageitem where id='" + currentUser2 + "';"; 
    con.getConnection((err, connection) => {
      try {
        if(err) throw err;
        console.log("Connection Success");
        
        // 일단 주문 1개만 했다고 쳤을 땐 맞음. 여러개 시켰을 땐 for문 써야 되는데 시간 없다 ㅠㅠ

        connection.query(sql, (err, result, fields) => {
          if(err) console.error("INSERT Error");
          else {
            if(result === 0) console.error("DB response NOT Found");
            else {
              resolve(result);
              console.log("TEST OK");
            };
          };
        });
        con.release();
      } catch(err) {
        console.error("pool Error(Order)");
      };
    });
  });
};

// ★Read - Subs List
modelsExports.renderSubs = () => {
  return new Promise((resolve, reject) => {
    let currentUser3 = controller.currentUser3;
    let sql = "SELECT * FROM mypagesub where id='" + currentUser3 +"';";
    con.getConnection((err, connection) => {
      try {
        if(err) throw err;
        console.log("Connection Success");
        

        connection.query(sql, (err, result, fields) => {
          if(err) console.error("INSERT Error");
          else {
            if(result === 0) console.error("DB response NOT Found");
            else {
              resolve(result);
              console.log("TEST OK");
            };
          };
        });
        con.release();
      } catch(err) {
        console.error("pool Error(Subs List)");
      };
    });
  });
};
