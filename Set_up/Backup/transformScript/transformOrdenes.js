const fs = require("fs");

const content = fs.readFileSync("/path/exportData/dbOrdenes.json");
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
// create set out of an array
fs.writeFile(
  "/path/transformedData/dbOrdenesParsed.json",
  newContent,
  "utf8",
  (err) => {
    if (err) throw err;
    console.log("complete");
  }
);
console.log("\n *DONE transformation!* \n");