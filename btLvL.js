const { MongoClient } = require("mongodb");
 
// // Atlas connection string         s                                                                                                                                
// const url =  "mongodb+srv://cluster0.q70xs.mongodb.net/BatteryLvL";
// const client = new MongoClient(url);
 
//  // The database to use
 const dbName = "BatteryLvL";

const username = encodeURIComponent("bambu_edu");
const password = encodeURIComponent("sprocket");
const clusterUrl = "cluster0.q70xs.mongodb.net/BatteryLVL";
const authMechanism = "DEFAULT";
// Replace the following with your MongoDB deployment's connection string.
const uri =
  `mongodb+srv://${username}:${password}@${clusterUrl}/?authMechanism=${authMechanism}`;
// Create a new MongoClient
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});



async function run() {
    try {
         await client.connect();
         console.log("Connected correctly to server");
         
         const db = client.db(dbName);
        //  console.log("a")
        //  console.log(db.databaseName)
        //  console.log("b")


         // Use the collection "people"
         const col = db.collection("people");
         // Construct a document                                                                                                                                                              
         let personDocument = {
             "name": { "first": "Alan", "last": "Turing" },
             "birth": new Date(1912, 5, 23), // May 23, 1912                                                                                                                                 
             "death": new Date(1954, 5, 7),  // May 7, 1954                                                                                                                                  
             "contribs": [ "Turing machine", "Turing test", "Turingery" ],
             "views": 1250000
         }
         // Insert a single document, wait for promise so we can read it back
         const p = await col.insertOne(personDocument);
         // Find one document
         const myDoc = await col.findOne();
         // Print to the console
         console.log(myDoc);
        } catch (err) {
         console.log(err.stack);
     }
 
     finally {
        await client.close();
    }
}
run().catch(console.dir);
