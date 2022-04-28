const {
  MongoDBNamespace,
  ObjectID
} = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const mongo = require("mongodb").MongoClient;
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('dotenv').config()


async function setAPI(app) {
  // Create a new MongoClient
  const client = await getClient();
  await client.connect();

  db = client.db(process.env.DBNAME);
  users = db.collection(process.env.COLLECTION);

  // Add User 
  app.post("/User", async (req, res) => {

    if (validateUser(req.body)) {

      users.insertOne({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          devices: []
        },
        (err, result) => {
          if (err) {
            console.error(err);
            res.status(500).json({
              err: err
            });
            return;
          }
          console.log(result);
          res.status(200).json({
            ok: true
          });
        }
      );
    } else {
      console.log("User not validated: " + req.body.toString());
      res.status(500).json({
        ok: false
      });
    }




  });

  // Get all Users
  app.get("/Users", async (req, res) => {
    console.log("Get all Users");

    try {
      found = await users.find().toArray();
      if (!found) {
        throw "No Users found";
      }

      console.log(found);
      res.status(200).json({
        user: found
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({
        errSet: e
      });
    }

  });

  // Get User by ID
  app.get("/User/:userID", async (req, res) => {
    const good_id = new ObjectId(req.params.userID);
    console.log("Get User by ID:" + good_id);

    try {
      found = await users.findOne(good_id);
      if (!found) {
        throw "No User found";
      }

      console.log(found);
      res.status(200).json({
        user: found
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({
        error: e
      });
      return;
    }

  });

  // Delete User by ID
  app.delete("/User/:userID", async (req, res) => {
    const good_id = new ObjectId(req.params.userID);
    console.log("Delete User by ID: " + good_id);

    users.deleteOne({
      _id: good_id
    }, (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json({
          err: err
        });
        return;
      }
      res.status(200).json({
        result
      });
    });
  });

  // Add Device, to userID
  app.post("/Device/:userID", async (req, res) => {
    const good_id = new ObjectId(req.params.userID);
    console.log("Add Device to ID:" + good_id);

    if (validateDevice(req.body)) {
      const filter = {_id : good_id};
      const update = { devices : {
        deviceID: new ObjectId(), 
        deviceName: req.body.deviceName,
        deviceLocation: req.body.deviceLocation,
        deviceData : []
      }};

      try {
        let newDoc = users.findOneAndUpdate(filter, {$push: update}, {
          returnOriginal : false
        });
        res.status(200).json({
          newDoc
        });
        console.log(newDoc);

      } catch (e) {
        console.error(e);
        res.status(500).json({
          error: e
        });
        return;
      }


      
    } else {
      console.log("in-valid Device input")
    }


  });


  app.delete("/Device/:userID/:deviceID", async (req, res) => {
    const user_id = new ObjectId(req.params.userID);
    const device_id = new ObjectId(req.params.deviceID);
    console.log("Delete Device: " + device_id + "\nFrom user: " + user_id);


    try {
      let newDoc = users.updateOne(
        {_id:user_id}, { $unset: { "devices": "" } }
      );
      // let delDev = newDoc.findOneAndDelete({deviceID: device_id});
      res.status(200).json({
        delDev
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({
        error: e
      });
      return;
    }


      



  });






  //
  //
  //
  //
  app.post("/editUser/:id", async (req, res) => {

    const good_id = new ObjectId(req.params.id);
    console.log(req.body);
    users.updateOne({
      _id: good_id
    }, {
      $set: req.body
    }, (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json({
          err: err
        });
        return;
      }
      res.status(200).json({
        result
      });
    });
  });

  app.get("/getDevice", async (req, res) => {
    // Create a new MongoClient
    const client = await getClient();
    await client.connect();

    db = client.db(process.env.DBNAME);
    devices = db.collection("devices");

    devices.find({
      _id: ObjectId(id)
    })((err, item) => {

      if (err) {
        console.error(err);
        res.status(500).json({
          err: err
        });
        return;
      }
      res.status(200).json({
        devices: item
      });
    });
  });

  app.post("/editDevice/:id", async (req, res) => {
    // Create a new MongoClient
    const client = await getClient();
    await client.connect();

    db = client.db(process.env.DBNAME);
    devices = db.collection("devices");

    const id = req.params["id"].toString();
    console.log(req.body);
    devices.updateOne({
      _id: ObjectId(id)
    }, {
      $set: req.body
    }, (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json({
          err: err
        });
        return;
      }
      res.status(200).json({
        result
      });
    });
  });


  app.get("/getDevices", async (req, res) => {
    // Create a new MongoClient
    const client = await getClient();
    await client.connect();

    db = client.db(process.env.DBNAME);
    devices = db.collection("devices");

    devices.find().toArray((err, items) => {

      if (err) {
        console.error(err);
        res.status(500).json({
          err: err
        });
        return;
      }
      res.status(200).json({
        devices: items
      });
    });
  });

  app.post("/addDeviceRecord", async (req, res) => {
    // Create a new MongoClient
    const client = await getClient();
    await client.connect();

    db = client.db(process.env.DBNAME);
    devices = db.collection("devices");

    devices.findOneAndUpdate({
      _id: ObjectId(id)
    }, {
      $push: {
        deviceData: req.body.deviceData
      }
    })((err, item) => {

      if (err) {
        console.error(err);
        res.status(500).json({
          err: err
        });
        return;
      }
      res.status(200).json({
        devices: items
      });
    });
  });


}

async function getClient() {
  //  // The database to use
  const uri = getURI();

  // Create a new MongoClient
  const client = new mongo(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await makeConnection();
  // await client.connect();
  return client;

}

function getURI() {
  const username = process.env.LOGINNAME;
  const password = process.env.PASSWORD;
  const clusterUrl = process.env.CLUSTERURL;
  const dbName = process.env.DBNAME;
  const authMechanism = process.env.AUTHMECHANISM;



  const uri =
    `mongodb+srv://${username}:${password}@${clusterUrl}/${dbName}/?authMechanism=${authMechanism}`;
  return uri;
}

async function makeConnection() {
  mongo.connect(
    getURI(), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    (err, client) => {
      if (err) {
        console.error(err);
        return;
      }

    }
  );
}

async function getDBCollection(colName) {
  const client = await getClient();
  await client.connect();
  db = client.db(process.env.DBNAME);
  return db.collection(colName);

}

function validateUser(user) {
  const errors = [];

  if (!user) {
    errors.push("User is required");
  }

  if (!user.firstName) {
    errors.push("firstName is required");
  }

  if (!user.lastName) {
    errors.push("lastName is required");
  }

  if (!user.email) {
    errors.push("email is required");
  }

  if (errors.length != 0) {
    console.log(errors);
    return false
  }
  return true;


}

function validateDevice(device) {
  const errors = [];

  if (!device) {
    errors.push("device is required");
  }

  if (!device.deviceName) {
    errors.push("deviceName is required");
  }

  if (!device.deviceLocation) {
    errors.push("deviceLocation is required");
  }

  if (errors.length != 0) {
    console.log(errors);
    return false
  }
  return true;


}

async function addSchemas() {
  const client = await getClient();
  try {
    await client.connect();
    console.log("Connected correctly to server");

    const db = client.db(process.env.DBNAME);



    db.createCollection("users", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["firstName", "lastName", "email"],
          properties: {
            firstName: {
              bsonType: "string",
              description: "must be a string and is required"
            },
            lastName: {
              bsonType: "string",
              description: "must be a string and is required"
            },
            email: {
              bsonType: "string",
              description: "must be a string and is required XX"
            },
            devices: {
              bsonType: "array",
              description: "Optional list of [deviceID, deviceName, deviceLocation, [dataPoints]]"
            },
          }
        }
      },
      validationLevel: "strict"
    })



    // db.createCollection("devices", {
    //   validator: {
    //     $jsonSchema: {
    //       bsonType: "object",
    //       required: ["userID", "deviceName", "deviceLocation"],
    //       properties: {
    //         userID: {
    //           bsonType: "string",
    //           description: "must be a string and is required"
    //         },
    //         deviceName: {
    //           bsonType: "string",
    //           description: "must be a string and is required"
    //         },
    //         deviceLocation: {
    //           bsonType: "string",
    //           description: "must be a string and is required"
    //         },
    //         currentBatteryStart: {
    //           bsonType: "date",
    //           description: "timestamp for current battery install, Optional"
    //         },
    //         currentBatteryStart: {
    //           bsonType: "array",
    //           description: "timestamps [start date, end date] for old batteries, Optional"
    //         },
    //         expectedBatteryEnd: {
    //           bsonType: "date",
    //           description: "calculated timestamp for expected EOL, Optional"
    //         },
    //       }
    //     }
    //   },
    //   validationLevel: "strict"
    // })



  } catch (err) {
    console.log(err.stack);
  } finally {
    // await client.close();
  }
}


module.exports = {
  getClient,
  getURI,
  makeConnection,
  validateUser,
  addSchemas,
  setAPI,
  getDBCollection
};