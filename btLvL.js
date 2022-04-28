const express = require("express");
const LVLfunctions = require("./LVLfunctions");


// // #Run once ... to add collections with schemas
// LVLfunctions.addSchemas().catch(console.dir);

// creates express app using json
const app = express();
app.use(express.json());

// set API functionality
LVLfunctions.setAPI(app);

// Listen for requests
app.listen(process.env.PORT, () => console.log("Server ready"));

