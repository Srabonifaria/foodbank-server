const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const fs =require('fs-extra')
const fileUpload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()


const app = express()
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('admins'));
 app.use(fileUpload());


const port = process.env.PORT || 7000

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mfj8i.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', (req, res) => {
  res.send('Hello FoodBank!')
})


client.connect(err => {
  const orderCollection = client.db("foodBank").collection("orders");
  const adminCollection = client.db("foodBank").collection("admins");
  app.post('/addOrder', (req, res) => {
    const order = req.body;
    orderCollection.insertOne(order)
        .then(result => {

     res.send(result.insertedCount > 0)
        })
});

// app.post('/ordersByDate', (req, res) => {
//   const created = req.body;
//   orderCollection.find({created: created.date})
//      .toArray((err,document)=>{
//        res.send(document)
//      })
// })

app.post('/ordersByDate', (req, res) => {
  const created = req.body;
   const email = req.body.email;
  adminCollection.find({ email: email })
      .toArray((err, admins) => {
          const filter = { date: date.date }
          if (admins.length === 0) {
              filter.email = email;
          }
          orderCollection.find(filter)
              .toArray((err, documents) => {
                  console.log(email, created.date, admins, documents)
                  res.send(documents);
              })
      })
})

app.get('/orders', (req, res) => {
  orderCollection.find({})
       .toArray((err, documents) => {
           res.send(documents);
       })
})

app.post('/makeAdmin', (req, res) => {
  const file = req.files.file;
  const name = req.body.name;
  const email = req.body.email;
  const newImg = file.data;
  const encImg = newImg.toString('base64');

  var image = {
      contentType: file.mimetype,
      size: file.size,
      img: Buffer.from(encImg, 'base64')
  };

  adminCollection.insertOne({ name, email, image })
      .then(result => {
          res.send(result.insertedCount > 0);
      })
})

app.post('/makeAdmin', (req, res) => {
  const file = req.files.file;
  const name = req.body.name;
  const email = req.body.email;
  const newImg = file.data;
  const encImg = newImg.toString('base64');

  var image = {
      contentType: file.mimetype,
      size: file.size,
      img: Buffer.from(encImg, 'base64')
  };

  adminCollection.insertOne({ name, email, image })
      .then(result => {
          res.send(result.insertedCount > 0);
      })
})

app.post('/isAdmin', (req, res) => {
  const email = req.body.email;
  adminCollection.find({ email: email })
      .toArray((err, admins) => {
          res.send(admins.insertedCount > 0);
      })
})
  // client.close();
});


app.listen(process.env.PORT || port)