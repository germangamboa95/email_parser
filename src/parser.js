const utf8 = require("utf8");
const quotedPrintable = require("quoted-printable");
const base64 = require("base-64");
const { getStr, getBody } = require("./helpers");

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
    let body = getBody(this.email);
    const { ContentTransferEncoding } = this.parsedData.headers;
    // Decode body by its transfer encoding. 
    switch (ContentTransferEncoding) {
      case "quoted-printable":
        body = quotedPrintable.decode(body);
        break;
      case "base64":
        body = utf8.decode(base64.decode(body));
        break;
      default:
        body = "Format currently not supported";
        break;
    }

    this.parsedData.body = body;
  }

  // Generates object with all data extrated from email. 
  async getParsedObj() {
    await this._headers();
    await this._body();
    return this.parsedData;
  }
}

module.exports = ParseEmail;
