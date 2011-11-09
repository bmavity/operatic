var fs = require('fs')
  , path = require('path')
  ;

var wrapFile = function(fileName) {

};

var middleware = function(options) {
  return function(req, res, next) {
    var write = function(status, headers, content, encoding) {
      res.writeHead(status, headers || undefined);
      res.end(
        req.method !== 'HEAD' && content ? content : ''
      , encoding || undefined
      );
    };

    var serveOperatic = function(operaticUrl) {
      var operaticFileName = operaticUrl.replace('/operatic', '')
        , operaticFilePath = path.join(__dirname, operaticFileName)
        ;
      fs.readFile(operaticFilePath, function(err, reply) {
        var headers;
        if(err) {
          console.log(err);
          next();
        } else {
          headers = {
            'Content-Length': reply.length
          , 'Content-Type': 'application/javascript'
          };
          write(200, headers, reply, 'utf8');
        }
      });
    };


    if('GET' != req.method && 'HEAD' != req.method) {
      return next();
    }
    if(req.url.indexOf('/operatic/') === 0) {
      serveOperatic(req.url);
    } else {
      next();
    }
  };
};

exports = middleware;
module.exports = exports;


