/* eslint-disable no-case-declarations */
/* eslint-disable no-underscore-dangle */
/* eslint-disable complexity */
const mongo = require("mongodb");

module.exports = function (obj) {
  let key;
  let val;
  for (key in obj) {
    if (!obj.hasOwnProperty(key)) continue;
    val = obj[key];
    switch (key) {
      case "$binary":
      case "$type":
        return new mongo.Binary(obj.$binary, obj.$type);
      case "$date": {
        if (val.$numberLong) {
          return new Date(+val.$numberLong);
        }
        return new Date(val.$numberLong);
      }
      case "$decimal128":
        return new mongo.Decimal128(Buffer.from(val));
      case "$timestamp":
        return new mongo.Timestamp({ t: val.t, i: val.i });
      case "$regex":
      case "$options":
        return new RegExp(obj.$regex, obj.$options);
      case "$oid":
        return new mongo.ObjectId(val);
      case "$ref":
      case "$id":
      case "$db":
        const id = obj.$id._bsontype ? obj.$id : mongo.ObjectId(obj.$id.$oid);
        return new mongo.DBRef(obj.$ref, id, obj.$db);
      case "$undefined":
        return undefined;
      case "$minKey":
        return new mongo.MinKey();
      case "$maxKey":
        return new mongo.MaxKey();
      case "$numberLong":
        if (typeof val === "string") {
          return mongo.Long.fromString(val);
        }
        return mongo.Long.fromNumber(val);
    }
    if (typeof val === "object") {
      obj[key] = module.exports(val);
    }
  }
  return obj;
};
