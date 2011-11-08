var fs = require('fs')
  , path = require('path')
  ;

var wrapFile = function(fileName) {

};

function write(status, headers, content, encoding) {
  try {
    res.writeHead(status, headers || undefined);

    // only write content if it's not a HEAD request and we actually have
    // some content to write (304's doesn't have content).
    res.end(
      req.method !== 'HEAD' && content ? content : ''
    , encoding || undefined
    );
  } catch (e) {}
}

var middleware = function(options) {
  return function(req, res, next) {
    if('GET' != req.method && 'HEAD' != req.method) {
      return next();
    }
    if(req.url.indexOf('/operatic/operatic.js') {
      fs.readFile(path.join(__dirname, 'client.js'), function(err, reply) {
        var headers;
        if(err) {
        } else {
          headers = {
            'Content-Length': reply.length
          , 'Content-Type': 'application/javascript'
          };
          write(200, headers, reply, 'utf8');
        }
      });
    } else {
      next();
    }
  };
};

exports = middleware;
module.exports = exports;


