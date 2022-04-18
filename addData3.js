const { MongoDBNamespace } = require("mongodb");
const mongo = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
const mongoose = require('mongoose');
const LVLfunctions = require("./LVLfunctions");

  
// Create a new MongoClient
const client = LVLfunctions.getClient();



async function run() {
    try {
         await client.connect();
         console.log("Connected correctly to server");
         
         const db = client.db("BatteryLvL");
         console.log("Adding to DB: " + db.databaseName)


         // Use the collection "people"
         const col = db.collection("users");
         console.log("Adding to collection: " + col.collectionName)
         // Construct a document                                                                                                                                                              
         let personDocument = {
            "firstName": "1stN",
            "lastName": "lastN",                                                                                                                                 
            "email": "abc@1234.com"                                                                                                                                  
        }
         // Insert a single document, wait for promise so we can read it back
         const p = await col.insertOne(personDocument);
         


         // Find one document
        //  const myDoc = await col.findOne();
         // Print to the console
        //  console.log(myDoc);
        } catch (err) {
         console.log(err.stack);
     }
 
     finally {
        await client.close();
    }
}


run().catch(console.dir);                                                                                                                             

