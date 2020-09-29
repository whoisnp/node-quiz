const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const path = require("path");
const MongoClient = require("mongodb").MongoClient;
var ObjectID = require("mongodb").ObjectID;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

//* mongoDB connect
const connectionString =
  "mongodb+srv://whoisNP:NithyaPrakash123@cluster0-gihtk.mongodb.net/test?retryWrites=true&w=majority";
MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then((client) => {
    console.log("Connected to Database");
    const db = client.db("Quiz-App");
    const questCollection = db.collection("question");

    // ! POST REQUEST
    app.post("/add", (req, res) => {
      questCollection
        .insertOne(req.body)
        .then((result) => {
          // res.render('index.ejs',{ question:results })
          res.redirect("/");
          console.log(result);
        })
        .catch((error) => console.error(error));
    });

    // app.post('/edit',(req,res)=>{
    //     questCollection.updateMany(req.body)
    //     .then(result => {
    //         // res.render('index.ejs',{ question:results })
    //         res.redirect('/')
    //         console.log(req.body)
    //     }).catch(error => console.error(error))
    // })

    // app.post('/edit',(req,res) => {
    //     questCollection.update({'_id':new ObjectID(req.body._id)},
    //     {$set: {
    //         'question': req.body.question,
    //         'choice1': req.body.choice1,
    //         'choice2': req.body.choice2,
    //         'choice3': req.body.choice3,
    //         'choice4': req.body.choice4,
    //         'answer': req.body.answer
    //     }}).then(result => {
    //         console.log("section Updated")
    //         res.send('sdi')
    //     })
    // })

    // ! GET REQUEST
    app.get("/", (req, res) => {
      res.send("hello world");
    });
    app.get("/add", (req, res) => {
      res.render("index.ejs");
    });
    app.get("/game", (req, res) => {
      res.sendFile("views/game.html", { root: __dirname });
    });
    app.get("/preview", (req, res) => {
      db.collection("question")
        .find()
        .toArray()
        .then((results) => {
          res.render("preview.ejs", { question: results });
          // console.log(results)
        })
        .catch((error) => console.error(error));
    });
    app.get("/edit/:id", (req, res) => {
      var id = req.params.id;
      var o_id = new ObjectID(id);
      db.collection("question")
        .find(id)
        .toArray()
        .then((results) => {
          res.render("update.ejs", { question: results, id });
        })
        .catch((error) => console.error(error));
    });

    // ! PUT REQUEST
    app.put("/edit/:id", (req, res) => {
      var oldValue = {
        _id: "req.param.id",
      };
      db.collection("question")
        .updateMany(oldValue, req.body)
        .then((results) => {
          id = req.params.id;
          res.render("update.ejs", { question: results });
        })
        .catch((error) => console.error(error));
    });

    // ! DELETE REQUEST

    // ! static files
    app.use(express.static(__dirname + "/public"));
  })
  .catch(console.error);

app.listen(3000, () => {
  console.log("listening on 3000");
});
