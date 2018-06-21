const stringSearcher = require("string-search");
const utf8 = require("utf8");
const quotedPrintable = require("quoted-printable");
var base64 = require("base-64");

// Helper function that finds string
const getStr = async (file, lookUp, splitAt) => {
  const arr = await stringSearcher.find(file, lookUp);

  let string = arr[0].text;
  string = string.split(splitAt);
  return string[1].toString().trim();
};

class ParseEmail {
  constructor(email) {
    this.email = email;
    this.parsedData = {};
  }

  async _headers() {
    let headers = {};
    // This can be refactored into a promise array for faster execution.
    headers.DeliveredTo = await getStr(this.email, "^Delivered-To", ":");
    headers.From = await getStr(this.email, "^From", ":");
    headers.To = await getStr(this.email, "^To", ":");
    headers.Subject = await getStr(this.email, "^Subject", ":");
    headers.Date = await getStr(this.email, "^Date", ":");
    headers.ContentType = await getStr(this.email, "^Content-Type", ":");
    headers.ContentTransferEncoding = await getStr(
      this.email,
      "^Content-Transfer-Encoding",
      ":"
    );
    headers.MIME_Version = await getStr(this.email, "^MIME-Version", ":");
    this.parsedData.headers = headers;
    return headers;
  }

  async _body() {
    // Search for the first empty line which is where the body starts.
    let pos = this.email.search(/\r\n\r\ngit a/g);
    let body = this.email.substr(pos + 4);
    let { ContentTransferEncoding } = this.parsedData.headers;

    switch (ContentTransferEncoding) {
      case "quoted-printable":
        body = quotedPrintable.decode(body);
        break;
      case "base64":
        body = body.trim()
        break;
      default:
        body = "Something went wrong.";
        break;
    }

    this.parsedData.body = body;
  }

  async getParsedJSON() {
    await this._headers();
    await this._body();
    return this.parsedData;
  }
}

module.exports = ParseEmail;
