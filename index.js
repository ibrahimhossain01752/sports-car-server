const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.638jm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

client.connect((err) => {
  const servicesCollection = client.db("Toyoya-car").collection("AllCars");
  const usersCollection = client.db("Toyoya-car").collection("users");
  const ordersCollection = client.db("Toyoya-car").collection("orders");
  const reviewCollection = client.db("Toyoya-car").collection("review");


//place order ..........................
  app.post("/placeorderInsert", async (req, res) => {
    const result = await ordersCollection.insertOne(req.body);
    res.send(result);
  });


  // geting all my booking.................
  app.get("/dashboard/myBooking", async (req, res) => {
    const query = { email: req.query.email };
    const result = await ordersCollection.find(query).toArray();
    console.log(result);
    res.send(result);
  });


  // get all services.....................
  app.get("/allServices", async (req, res) => {
    const result = await servicesCollection.find({}).toArray();
    res.send(result);
  });

 
 // single service........................
 app.get("/services/:id", async (req, res) => {
   const result = await servicesCollection.find({_id: ObjectId(req.params.id)}).toArray();
   res.send(result);
  });




// manage order list is showing on dashboard.
app.get("/dashboard/manageOrder", async (req, res) => {
    console.log(req.body);
    const result = await ordersCollection.find({}).toArray();
    res.send(result);
    console.log(result);
  });

 

// Approved Status............. ...........
app.put("/dashboard/manageOrder/Approved/:id", async (req, res) =>{
  const filter = {_id : ObjectId(req.params.id)};
  const result = await ordersCollection.updateOne(filter, {
      $set: {status: 'Approved'}
  })
  res.send(result);
  console.log(result);
})


// delete ManageOrders for admin............. ...........
app.delete("/dashboard/manageOrder/deleted/:id", async (req, res) =>{
  const filter = {_id : ObjectId(req.params.id)};
  const result = await ordersCollection.deleteOne(filter)
  res.send(result);
  console.log(result);
})


// delete myBooking for user............. ...........
app.delete("/dashboard/myBooking/deleted/:id", async (req, res) =>{
  const filter = {_id : ObjectId(req.params.id)};
  const result = await ordersCollection.deleteOne(filter)
  res.send(result);
  console.log(result);
})





//resgisteratiuon information is storeing firebase & also my database mongobd..

app.post('/signup/userInformation', async (req, res) =>{
  const result = await usersCollection.insertOne(req.body);
  res.send(result);
  console.log(result);
 })



  //  make admin
  app.put("/dashboard/makeAdmin", async (req, res) => {
    const filter = { email: req.body.email };
    const result = await usersCollection.find(filter).toArray();
    if (result) {
      const made = await usersCollection.updateOne(filter, {
        $set: { role: "admin" },
      });
      res.send(made);
    }
  });



 // Add Services from admin dashboard...................
  app.post('/dashboard/addService', async (req, res) =>{
    const result = await servicesCollection.insertOne(req.body);
    res.send(result);
    console.log(result);
   })
  
  



// manage Services list is showing on dashboard.
app.get("/dashboard/manageServices", async (req, res) => {
    console.log(req.body);
    const result = await servicesCollection.find({}).toArray();
    res.send(result);
    console.log(result);
  });


// delete Services from admin dashboard............. ...........
app.delete("/dashboard/manageServices/deleted/:id", async (req, res) =>{
    const filter = {_id : ObjectId(req.params.id)};
    const result = await servicesCollection.deleteOne(filter)
    res.send(result);
    console.log(result);
  })
  

 // review
 app.post("/addSReview", async (req, res) => {
    const result = await reviewCollection.insertOne(req.body);
    res.send(result);
  });


//Show All Reviews in Ui..................
app.get("/allReview", async (req, res) => {
    console.log(req.body);
    const result = await reviewCollection.find({}).toArray();
    res.send(result);
  });


  // check admin or not
  app.get("/checkAdmin/:email", async (req, res) => {
    const query = { email: req.params.email };
    const result = await usersCollection.find(query).toArray();
    console.log(result);
    res.send(result);
  });







  
});

app.listen(process.env.PORT || 5000);
