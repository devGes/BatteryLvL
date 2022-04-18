const { MongoDBNamespace } = require("mongodb");
const mongo = require("mongodb").MongoClient;

function getClient() {
    //  // The database to use
    const username = encodeURIComponent("bambu_edu");
    const password = encodeURIComponent("sprocket");
    const clusterUrl = "cluster0.q70xs.mongodb.net";
    const dbName = "BatteryLvL";
    const authMechanism = "DEFAULT";
    const uri = getURI();
    
    // Create a new MongoClient
    const client = new mongo(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    });

    makeConnection()
    return client;

}

function getURI() {
    const username = encodeURIComponent("bambu_edu");
    const password = encodeURIComponent("sprocket");
    const clusterUrl = "cluster0.q70xs.mongodb.net";
    const dbName = "BatteryLvL";
    const authMechanism = "DEFAULT";
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