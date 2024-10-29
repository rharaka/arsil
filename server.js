const express = require('express')
const mysql = require('mysql')
const bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.json({type: 'application/json'}))
app.use(bodyParser.urlencoded({extended: true}))

const con = mysql.createConnection({
    host: 'localhost',
    port: '8889',
    user: 'root',
    password: 'root',
    database: 'arsildb'
})

const server = app.listen(4545, function(){
    const host = server.address().address
    const port = server.address().port
})

con.connect(function(error){
    if(error) 
        console.log(error)
    else 
        console.log("Connected to DB")
})

app.get(`/prices/:w`, function(req, res){
    con.query('SELECT MIN(PRICE) AS PRICE FROM prices WHERE WEIGHT>=? LIMIT 1', req.params.w, function(error, rows, fields){
        if(error) 
            console.log(error)
        else{
            res.send(rows)
        }
    })
})

app.get(`/prices_courier/:w`, function(req, res){
    con.query('SELECT C.NAME AS NAME, P.PRICE AS PRICE FROM prices P INNER JOIN courier C ON P.ID_COURIER=C.ID WHERE P.WEIGHT_FROM<? AND P.WEIGHT_TO>=? ORDER BY P.PRICE', [req.params.w, req.params.w], function(error, rows, fields){
        if(error) 
            console.log(error)
        else{
            res.send(rows)
        }
    })
})
