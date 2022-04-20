const { MongoDBNamespace } = require("mongodb");
const mongo = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const express = require("express");
const LVLfunctions = require("./LVLfunctions");


// LVLfunctions.makeConnection();

// database and collections
// client = LVLfunctions.getClient();
// db = client.db("BatteryLvL");
// users = db.collection("users");
// devices = db.collection("devices");
// deviceDataPoints = db.collection("deviceDataPoints");



const app = express();
app.use(express.json());

app.post("/adduser", async (req, res) => {
  

  // Create a new MongoClient
  const client = await LVLfunctions.getClient();
  await client.connect();
  
  db = client.db("BatteryLvL");
  users = db.collection("users");

  // console.log(req.body.dir);

  const userName = req.body.userName;
  const email     = req.body.email;
  console.log(userName, email);

  users.insertOne(
    { userName: userName, email: email},
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ err: err });
        return;
      }
      console.log(result);
      res.status(200).json({ ok: true });
    }
  );
});

app.get("/users", async ( req, res) => {
  // Create a new MongoClient
  const client = await LVLfunctions.getClient();
  await client.connect();
  
  db = client.db("BatteryLvL");
  users = db.collection("users");

  users.find().toArray((err, items) => {

    if (err) {
      console.error(err);
      res.status(500).json({ err: err });
      return;
    }
    res.status(200).json({ users: items });
  });
});

app.delete("/delete/:id", (req, res) => {
  const id = req.params["id"].toString();
  users.deleteOne({ _id: ObjectId(id) }, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ err: err });
      return;
    }
    res.status(200).json({ result });
  });
});

app.post("/edituser/:id", (req, res) => {
  const id = req.params["id"].toString();
  console.log(req.body);
  users.updateOne({ _id: ObjectId(id) }, { $set: req.body }, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ err: err });
      return;
    }
    res.status(200).json({ result });
  });
});

app.post("/adddevice", (req, res) => {
  const deviceName = req.body.deviceName;
  const deviceLocation = req.body.deviceLocation;
  const newDeviceID = Schema.newID;

  devices.insertOne(
    { deviceName: deviceName, deviceLocation: deviceLocation, deviceID: newDeviceID },
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ err: err });
        return;
      }
      console.log(result);
      res.status(200).json({ ok: true });
    }
  );


  });


app.listen(3000, () => console.log("Server ready"));