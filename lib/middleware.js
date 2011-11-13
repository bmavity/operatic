var fs = require('fs')
  , path = require('path')
  , modules = {}
  , identity = function(file) { return file; }
  , wrapFile
  ;

var getFileNameFromMatcher = function(rawMatcher) {
  return function(url) {
    return url.replace(rawMatcher, '');
  };
};

var getIsExcluded = function(excludes) {
  return function(fileName) {
    return fileName.indexOf(excludes) !== -1;
  };
};

var getMatcher = function(rawMatcher) {
  return function(url) {
    return url.indexOf(rawMatcher) === 0;
  };
};

var getModuleForUrl = function(url) {
  var keys = Object.keys(modules)
    , module
    , i
    , len = keys.length
    ;
  for(i = 0; i < len; i += 1) {
    module = modules[keys[i]];
    if(module.matchesUrl(url)) {
      return module;
    }
  }
};

var hasModuleForUrl = function(url) {
  return !!getModuleForUrl(url);
};

var serveFile = function(url, errback, serveContent) {
  var activeModule = getModuleForUrl(url)
    , fileName = activeModule.getFileName(url)
    , filePath = path.join(activeModule.contentDir, fileName)
    ;
  fs.readFile(filePath, function(err, file) {
    if(err) {
      errback();
    } else {
      if(activeModule.isExcluded(fileName)) {
        serveContent(file);
      } else {
        serveContent(wrapFile(file));
      }
    }
  });
};

var middleware = function(options) {
  wrapFile = wrapFile || options.globalWrapper || identity;

  var middlewareFn = function(req, res, next) {
    var write = function(status, headers, content, encoding) {
      res.writeHead(status, headers || undefined);
      res.end(
        req.method !== 'HEAD' && content ? content : ''
      , encoding || undefined
      );
    };

    var serveContent = function(content) {
      var headers = {
        'Content-Length': content.length
      , 'Content-Type': 'application/javascript'
      };
      write(200, headers, content, 'utf8');
    };

    if('GET' != req.method && 'HEAD' != req.method) {
      return next();
    }

    if(hasModuleForUrl(req.url)) {
      serveFile(req.url, next, serveContent);
    } else {
      next();
    }
  };

  var add = function(module) {
    modules[module.name] = {
      matchesUrl: getMatcher(module.matcher)
    , getFileName: getFileNameFromMatcher(module.matcher)
    , contentDir: module.contentDir
    , isExcluded: getIsExcluded(module.excludes)
    };
    return middlewareFn;
  };

  middlewareFn.add = add;
  return middlewareFn;
};


exports = middleware;
module.exports = exports;
