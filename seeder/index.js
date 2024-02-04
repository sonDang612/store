/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
const { MongoClient } = require("mongodb");
const json2mongo = require("./json2mongo");

const { readdir, writeFile } = require("fs/promises");

const MONGO_URL = "mongodb://127.0.0.1:27017/electronics-store";
const DB_NAME = "electronics-store";
const convertJson = async (source) => {
  const jsonFiles = await readdir(source);
  const dataConverted = jsonFiles.map((jsonFile) => {
    const data = json2mongo(require(`${source}/${jsonFile}`));

    return writeFile(`data/${jsonFile}`, JSON.stringify(data));
  });
  return Promise.all(dataConverted);
};
const seedData = async (source) => {
  try {
    // await convertJson(source);

    const jsonFiles = await readdir(source);

    const uri = MONGO_URL;

    const client = new MongoClient(uri, {
      useNewUrlParser: true,
    });
    await client.connect();
    const database = client.db(DB_NAME);

    const deleteOldCollections = jsonFiles.map((jsonFile) => {
      const collectionName = jsonFile.split(".")[0];
      return database.collection(collectionName).deleteMany();
    });
    await Promise.all(deleteOldCollections);
    const insertNewCollections = jsonFiles.map((jsonFile) => {
      const collectionName = jsonFile.split(".")[0];
      const data = json2mongo(require(`${source}/${jsonFile}`));

      return database.collection(collectionName).insertMany(data);
    });

    await Promise.all(insertNewCollections);

    client.close();

    console.log("\x1b[32m%s\x1b[0m", "Database seeded! 🚀🚀🚀");
  } catch (error) {
    console.log("\x1b[31m%s\x1b[0m", error);
  }
};

seedData("./rawData");
// const deleteOldCollections = [];
// const insertNewCollections = [];
// jsonFiles.forEach((jsonFile) => {
//   const collectionName = jsonFile.split(".")[0];
//   deleteOldCollections.push(
//     database.collection(collectionName).deleteMany(),
//   );
//   const data = json2mongo(require(`${source}/${jsonFile}`));
//   insertNewCollections.push(
//     database.collection(collectionName).insertMany(data),
//   );
// });
