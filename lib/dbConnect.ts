/* eslint-disable no-var */
/* eslint-disable vars-on-top */
/* eslint-disable no-console */
import mongoose from "mongoose";

declare global {
  var mongoose: any;
}

const MONGODB_URI = process.env.MONGO_URI2;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI2 environment variable inside .env.local",
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  // eslint-disable-next-line no-multi-assign
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    // const opts = {
    //    useNewUrlParser: true,
    //    useUnifiedTopology: true,
    //    bufferCommands: false,
    //    bufferMaxEntries: 0,
    //    useFindAndModify: false,
    //    useCreateIndex: true,
    // };
    const opts = {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      bufferCommands: false,
      // bufferMaxEntries: 0,
      // useFindAndModify: false,
      // useCreateIndex: true,
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      console.log(
        "\x1b[32m%s\x1b[0m",
        `MongoDB Connected: ${mongoose.connection.host}`,
      );
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
