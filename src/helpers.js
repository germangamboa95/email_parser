const stringSearcher = require("string-search");

// Helper function that finds string
const getStr = async (file, lookUp, splitAt) => {
  const arr = await stringSearcher.find(file, lookUp);
  let string = arr[0].text;
  string = string.split(splitAt);
  return string[1].toString().trim();
};

const splitDocument = file => file.split("\n");

// Gets body depending on what it is being split by. 
const getBody = file => {
  file = splitDocument(file);
  let pos = file.indexOf("\r");
  if (pos > -1) {
    return file
      .slice(pos)
      .join("\n")
      .trim();
  } else {
    let pos = file.indexOf("");
    return file
      .slice(pos)
      .join("\n")
      .trim();
  }
};

module.exports = {
  getStr: getStr,
  splitDocument: splitDocument,
  getBody: getBody
};
