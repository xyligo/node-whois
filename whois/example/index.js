var whois = require("../index")

var options = "google.co.uk"

whois.lookup(options, function (error, response) {
  if (error) console.log(error);
  else console.log(response)
});