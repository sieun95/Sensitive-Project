const express = require('express');
const session = require('express-session');
const path = require('path');
const routes = require('./routes');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const app = express();
const mysql = require('mysql');
const controller = require("./controllers/controllers");

// product db 연결
const productMysql = require("./utils/productdbcon")

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));
app.use(session({
    name: 'session',
    secret: 'my_secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 3600 * 1000, // 1hr
    }
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(routes);

// app.use((err, req, res, next) => {
//     // console.log(err);
//     return res.send('Internal Server Error');
// });


app.get('/subscribe', (req, res) => {
    res.render('./subscribe.ejs');
});


const router = require("./routes/routes.js");
app.use('/', router); // 일단 app.js에서 router를 긁어오긴 했는데, 이거 따로 못빼나?????????


// -------  product  -------

// 로그인체크 추가
const ifNotLoggedin = (req, res, next) => {
    if (!req.session.userID) {
        // return res.render("main") // 로그인이 안되어있을 시 main으로 이동.
        return res.redirect('/login');
    }
    next();
}

app.get('/product_list', (req, res) => {
    const sql = `select * from product`
    productMysql.query(sql, function(err, result, fields) {
        if(err) throw err;
        res.render('ProductList',{product : result});
    });
});

app.post('/detail', (req, res) =>{
    var productId = req.body.productid
    let sql = `select * from product where id=${productId}` 
    productMysql.query(sql, function(err, result, fields){
        if(err) throw err;
        res.render('ProductDetail', {product : result})
    });
});

app.post('/order', (req, res) => {
    var productId = req.body.productid    
    let currentUser = req.session.userID;
    let sql = `select * from product where id=${productId}` 
    productMysql.query(sql, function(err, result, fields){
        if(err) throw err;        
        res.render('Order', {product : result})        
    });

    // DB table: mypageitem INSERT용도
    let sql2 =
    `INSERT INTO mypageitem (id, itemname, itemcate, itemprice, itemdate) VALUES ('${currentUser}', '${req.body.prodname}', '${req.body.prodcate}', '${req.body.prodprice}', now());`;
    productMysql.query(sql2, function(err, result, fields) {
        if(err) throw err;

        console.log("mypageitem INSERT OK");
    });
});

app.listen(3000, () => console.log('Server is runngin on port http://localhost:3000'));