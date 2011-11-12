var fs = require('fs')
  , path = require('path')
  ;

var getMatcher = function(rawMatcher) {
  return function(url) {
    return url.indexOf(rawMatcher) === 0;
  };
};

var middleware = function(options) {
  var wrapFile = options.wrapper || function(file) { return file; }
    , matchesUrl = getMatcher(options.matcher)
    ;
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
      fs.readFile(operaticFilePath, function(err, operaticFile) {
        var headers
          , content
          ;
        if(err) {
          console.log(err);
          next();
        } else {
          if(operaticFileName.indexOf('client') === -1) {
            content = wrapFile(operaticFile);
          } else {
            content = operaticFile;
          }
          headers = {
            'Content-Length': content.length
          , 'Content-Type': 'application/javascript'
          };
          write(200, headers, content, 'utf8');
        }
      });
    };


    if('GET' != req.method && 'HEAD' != req.method) {
      return next();
    }

    if(matchesUrl(req.url)) {
      serveOperatic(req.url);
    } else {
      next();
    }
  };
};

exports = middleware;
module.exports = exports;


