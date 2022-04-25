const {
  MongoDBNamespace
} = require("mongodb");
const mongo = require("mongodb").MongoClient;
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('dotenv').config()

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

  if (!device.userID) {
    errors.push("userID is required");
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
            deviceIDs: {
              bsonType: "array",
              description: "Optional list of [String]"
            },
          }
        }
      },
      validationLevel: "strict"
    })



    db.createCollection("devices", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["userID", "deviceName", "deviceLocation"],
          properties: {
            userID: {
              bsonType: "string",
              description: "must be a string and is required"
            },
            deviceName: {
              bsonType: "string",
              description: "must be a string and is required"
            },
            deviceLocation: {
              bsonType: "string",
              description: "must be a string and is required"
            },
            currentBatteryStart: {
              bsonType: "date",
              description: "timestamp for current battery install, Optional"
            },
            currentBatteryStart: {
              bsonType: "array",
              description: "timestamps [start date, end date] for old batteries, Optional"
            },
            expectedBatteryEnd: {
              bsonType: "date",
              description: "calculated timestamp for expected EOL, Optional"
            },
          }
        }
      },
      validationLevel: "strict"
    })



  } catch (err) {
    console.log(err.stack);
  } finally {
    // await client.close();
  }
}


async function setAPI(app) {

  app.post("/addUser", async (req, res) => {
    // Create a new MongoClient
    const client = await getClient();
    await client.connect();

    db = client.db(process.env.DBNAME);
    users = db.collection("users");

    // console.log(req.body.dir);
    // console.log(req.body.firstName, req.body.lastName, req.body.email);

    if (validateUser(req.body)) {
      // console.log("validated")

      users.insertOne({
          // $set: req.body
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email
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
      res.status(500).json({
        ok: false
      });
    }




  });

  app.get("/getUsers", async (req, res) => {
    // Create a new MongoClient
    const client = await getClient();
    await client.connect();

    db = client.db(process.env.DBNAME);
    users = db.collection("users");

    users.find().toArray((err, items) => {

      if (err) {
        console.error(err);
        res.status(500).json({
          err: err
        });
        return;
      }
      res.status(200).json({
        users: items
      });
    });
  });

  app.get("/getUser", async (req, res) => {
    // Create a new MongoClient
    const client = await getClient();
    await client.connect();

    db = client.db(process.env.DBNAME);
    users = db.collection("users");

    users.find( { _id: ObjectId(id)} ) ((err, item) =>  {

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

  app.delete("/deleteUser/:id", async (req, res) => {
    // Create a new MongoClient
    const client = await getClient();
    await client.connect();

    db = client.db(process.env.DBNAME);
    users = db.collection("users");
    
    const id = req.params["id"].toString();
    users.deleteOne({
      _id: ObjectId(id)
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

  app.post("/editUser/:id", async (req, res) => {
    // Create a new MongoClient
    const client = await getClient();
    await client.connect();

    db = client.db(process.env.DBNAME);
    users = db.collection("users");

    const id = req.params["id"].toString();
    console.log(req.body);  
    users.updateOne({
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

  app.post("/addDevice", async (req, res) => {
    // Create a new MongoClient
    const client = await getClient();
    await client.connect();

    db = client.db(process.env.DBNAME);
    devices = db.collection("devices");

    if (validateDevice(req.body)) {

      devices.insertOne({
          deviceName: req.body.deviceName,
          deviceLocation: req.body.deviceLocatio,
          userID: req.body.userID,
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
    }


  });

  app.get("/getDevice", async (req, res) => {
    // Create a new MongoClient
    const client = await getClient();
    await client.connect();

    db = client.db(process.env.DBNAME);
    devices = db.collection("devices");

    devices.find( { _id: ObjectId(id)} ) ((err, item) =>  {

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

  app.delete("/deletDevice/:id", async (req, res) => {
    // Create a new MongoClient
    const client = await getClient();
    await client.connect();

    db = client.db(process.env.DBNAME);
    devices = db.collection("devices");
    
    const id = req.params["id"].toString();
    devices.deleteOne({
      _id: ObjectId(id)
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


}


module.exports = {
  getClient,
  getURI,
  makeConnection,
  validateUser,
  addSchemas,
  setAPI
};