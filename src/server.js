const express = require("express");
const server = express();
const nunjucks = require("nunjucks");

const db = require("./database/db");

nunjucks.configure("src/views", {
    express: server,
    noCache: true
});


// server.get("/", (req, res) => {
//     res.render("/views/index.html")
// });

server.use(express.static("public"));

server.use(express.urlencoded({extended: true}));

server.get("/", (req, res) => {
   return res.render("index.html");
});

server.get("/createPoint", (req, res) => {
    return res.render("create-point.html");
});

server.post("/savePoint", (req, res) => {
    const query = `
        INSERT INTO places (
            image,
            name,
            address,
            address2,
            state,
            city,
            items
        ) VALUES (?,?,?,?,?,?,?);
    `
    const values = [
       req.body.image,
       req.body.name,
       req.body.address,
       req.body.address2,
       req.body.state,
       req.body.city,
       req.body.items
    ];

    function afterInsertData(err){
        if(err){
            return console.log(err);
        }
        console.log("Cadastrado com Sucesso");
        console.log(this);
        return res.render("create-point.html", { saved: true });        
    }

    db.run(query, values, afterInsertData)
})

server.get("/search", (req, res) => {
    const search = req.query.search;

    if(search == ""){
        return res.render("search-results.html", {total: 0});
    }

    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err, rows){
        if(err){
            return console.log(err);
        }
        const total = rows.length;
        return res.render("search-results.html", {places: rows, total: total});
    });
    
});

server.listen(3000, () => {
    console.log("Server has Started!");
});