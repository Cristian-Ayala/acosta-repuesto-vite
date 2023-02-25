// STEP 1: Export the db to json
// curl -X GET http://127.0.0.1:5984/productos/_all_docs\?include_docs\=true > ./dbProductos.json

// STEP 2: Modify the json file
const fs = require("fs");

const content = fs.readFileSync("./dbProductos.json");
const json = JSON.parse(content);
const docs = json.rows;
console.log("\n *START transformation* \n");

const newDocs = docs.map((doc) => {
  const innerdoc = doc.doc;
  delete innerdoc._rev;
  return innerdoc;
});

const newJson = {};
newJson.docs = newDocs;
const newContent = JSON.stringify(newJson);
fs.writeFile("./dbProductosParsed.json", newContent, "utf8", (err) => {
  if (err) throw err;
  console.log("complete");
});
console.log("\n *DONE transformation!* \n");

// STEP 3: Import the json file to couchdb
// curl -u user:password -d @dbProductosParsed.json -H "Content-type: application/json" -X POST http://127.0.0.1:5984/productos/_bulk_docs
