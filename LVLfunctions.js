const { MongoDBNamespace } = require("mongodb");
const mongo = require("mongodb").MongoClient;
require('dotenv').config()

async function getClient() {
    //  // The database to use
    const uri = getURI();
    
    // Create a new MongoClient
    const client = new mongo(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    });

    await makeConnection()
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
        getURI(),
      {
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

module.exports = { getClient, getURI, makeConnection };