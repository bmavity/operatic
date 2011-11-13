var fs = require('fs')
  , path = require('path')
  ;

var getFileNameFromMatcher = function(rawMatcher) {
  return function(url) {
    return url.replace(rawMatcher, '');
  };
};

var getMatcher = function(rawMatcher) {
  return function(url) {
    return url.indexOf(rawMatcher) === 0;
  };
};

var middleware = function(options) {
  var matchesUrl = getMatcher(options.matcher)
    , getFileName = getFileNameFromMatcher(options.matcher)
    , contentDir = options.contentDir
    , wrapFile = options.wrapper || function(file) { return file; }
    ;
  return function(req, res, next) {
    var write = function(status, headers, content, encoding) {
      res.writeHead(status, headers || undefined);
      res.end(
        req.method !== 'HEAD' && content ? content : ''
      , encoding || undefined
      );
    };

    var serveFile = function(url) {
      var fileName = getFileName(url)
        , filePath = path.join(contentDir, fileName)
        ;
      fs.readFile(filePath, function(err, file) {
        var headers
          , content
          ;
        if(err) {
          console.log(err);
          next();
        } else {
          if(fileName.indexOf('client') === -1) {
            content = wrapFile(file);
          } else {
            content = file;
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
      serveFile(req.url);
    } else {
      next();
    }
  };
};

exports = middleware;
module.exports = exports;


