const { MongoClient, ObjectId } = require("mongodb");
const dotenv = require("dotenv");
dotenv.config();
const Client = new MongoClient(process.env.DB_URL);
const Db = Client.db(process.env.DB_NAME);
const Collection = [
  Db.collection(process.env.DB_COLLECTION_ONE),
  Db.collection(process.env.DB_COLLECTION_TWO),
  Db.collection(process.env.DB_COLLECTION_THREE),
];
module.exports = { ObjectId, Client, Collection };
