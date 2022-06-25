const express = require("express");
const ObjectId = require("mongodb").ObjectId;
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.S3_BUCKET}:${process.env.SECRET_KEY}@cluster0.nrvwj.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

// use the middle ware

app.use(express.json());
app.use(cors());

async function run() {
  try {
    await client.connect();
    const database = client.db("sany_car_mechanic");
    const userCollection = database.collection("book_service");

    // post api
    app.post("/services", async (req, res) => {
      const newService = req.body;
      const result = await userCollection.insertOne(newService);
      res.json(result);
    });

    // find all data
    app.get("/services", async (req, res) => {
      const cursor = userCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });

    // get a single service
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await userCollection.findOne(query);
      res.send(result);
    });

    // delete a service
    app.delete("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      console.log(result);
      res.json(result);
    });
  } finally {
    // await client.close()
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello Developers How are you ? Fine Thank You");
  console.log("Hitting the get api");
});

app.listen(port, () => {
  console.log(`Listening to the port ${port} successfully`);
});
