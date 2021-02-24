import { MongoClient } from "mongodb"
import { DB } from '@lib/constants/db'

const uri = process.env.MONGO_AWSGM2

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  poolSize: 10,
});

/**
 * https://stackoverflow.com/questions/55499175/how-to-fix-error-querysrv-erefused-when-connecting-to-mongodb-atlas
 *
 * mongodb://<username>:<password>@main-shard-00-00-03xkr.mongodb.net:27017,main-shard-00-01-03xkr.mongodb.net:27017,main-shard-00-02-03xkr.mongodb.net:27017/main?ssl=true&replicaSet=Main-shard-0&authSource=admin&retryWrites=true
 *
 * --- OR ----
 * Downgrade to 2.2.12 or later
 * mongodb://petitcode:O3Ps8pLIK5ybSPof@awsgm2-shard-00-00.osmph.mongodb.net:27017,awsgm2-shard-00-01.osmph.mongodb.net:27017,awsgm2-shard-00-02.osmph.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-7pcy7i-shard-0&authSource=admin&retryWrites=true&w=majority
 *
 * 3.6
 * mongodb+srv://petitcode:O3Ps8pLIK5ybSPof@awsgm2.osmph.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
 */
//

async function connect() {
  if (!client.isConnected()) await client.connect();
  const db = client.db(DB.DBName);
  return { db, client };
}

export { connect };


// 2.2.12 sample code

// var MongoClient = require('mongodb').MongoClient;

// var uri = "mongodb://petitcode:O3Ps8pLIK5ybSPof@awsgm2-shard-00-00.osmph.mongodb.net:27017,awsgm2-shard-00-01.osmph.mongodb.net:27017,awsgm2-shard-00-02.osmph.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-7pcy7i-shard-0&authSource=admin&retryWrites=true&w=majority";
// MongoClient.connect(uri, function(err, client) {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });

// 3.6 sample code

// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://petitcode:O3Ps8pLIK5ybSPof@awsgm2.osmph.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });

