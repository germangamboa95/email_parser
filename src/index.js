const fs = require("fs");
const EmailParser = require('./parser.js'); 

function loadEmailFile(file) {
  // Wrap loaded file into promise. Using node LTS but node v10 has promises for fs natively.
  return new Promise((resolve, reject) => {
    // Emails are small so stream not needed.
    fs.readFile(file, "utf-8", (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
}

// Initial function. 

async function init() {
    const loadedEmail = await loadEmailFile('./testEmails/simpleEmail.txt'); 
    const parsedEmail = new EmailParser(loadedEmail); 
    console.log(await parsedEmail.getParsedJSON())
    

}

init();