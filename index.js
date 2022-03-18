var servers = require('./lib/whois.servers.json');
const net = require('net');

const lookup = function (options, cb) {

  function getTld(domain) {
    var match = domain.match(/^[\w-]+\.((?:[\w-]+\.?)+)$/i) ||
      domain.match(/^xn\-\-[\w-]+\.(xn\-\-(?:[\w-]+\.?1?))+$/i);
    return match && match[1] || null;
  }

  var callBackIsFunction = (function () {
    return Object.prototype.toString.call(cb) == "[object Function]"
  })();

  function callback(err, res) {
    if (callBackIsFunction) cb(err, res)
  }

  var hostname = (options) && options.hostname || options;
  var port = (options) && options.port || 43;

  var whoisServer = servers[getTld(hostname)];

  if (whoisServer) {
    var stream = net.createConnection(port, whoisServer[0]);

    stream.addListener('connect', function () {
      stream.write(hostname + '\r\n');
    });

    stream.addListener('data', function (data) {
      callback(null, data.toString());
    });

    stream.addListener('error', function (err) {
      callback(err, null);
    });
    stream.addListener('end', function () {
      stream.end();
    });
  } else {
    callback("No whois server for this tld in list!", null);
  }
};

module.exports = {
  lookup
}