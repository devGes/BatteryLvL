const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const LVLfunctions = require("./LVLfunctions");

  
// Create a new MongoClient
const client = LVLfunctions.getClient();


async function run() {
    try {
         await client.connect();
         console.log("Connected correctly to server");
         
         const db = client.db("BatteryLvL");
        //  console.log(db.databaseName)


         // Use the collection "users"
         const col = db.collection("users");
         // Construct a document                                                                                                                                                              
         let personDocument = {
            "firstName": "1stN",
            "lastName": "lastN",                                                                                                                                 
            "email": "abc@123.com"                                                                                                                                  
        }
         // Insert a single document, wait for promise so we can read it back
         const p = await col.insertOne(personDocument);

         
        console.log("starting to create schema document");
        const user = new Schema(
          {
            userID: String,
            userName: String,
            email: String,
          }
          );

        const MyModelUsers = mongoose.model('user', user);
        console.log(MyModelUsers.schema)
        console.log("done setting schema???");


        } catch (err) {
         console.log(err.stack);
     }
 
     finally {
        await client.close();
    }
}
run().catch(console.dir);                                                                                                                             

